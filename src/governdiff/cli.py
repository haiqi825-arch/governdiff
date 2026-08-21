"""Command-line interface for GovernDiff."""

from __future__ import annotations

import argparse
import copy
import fnmatch
import glob
import json
import secrets
import subprocess
import sys
from pathlib import Path

from . import __version__
from .config import Config, Waiver, load_config, load_waivers
from .document import preflight_document
from .engine import analyze_documents, analyze_texts
from .models import AnalysisReport, CONFIDENCE_ORDER, SEVERITY_ORDER
from .privacy import safe_exception_message
from .report import (
    REPORT_SCOPES,
    ReportSelection,
    render_csv,
    render_html,
    render_json,
    render_markdown,
)
from .review import apply_review, load_review
from .review_session import (
    create_session_directory,
    retain_session,
    run_local_reviewer,
    securely_remove_session,
)


def _configure_utf8_console_streams() -> None:
    """Keep Unicode reports usable when Windows inherits a legacy code page."""

    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if not callable(reconfigure):
            continue
        try:
            reconfigure(encoding="utf-8")
        except (OSError, ValueError):
            # Redirected/custom text streams may not be reconfigurable. Their
            # owner remains responsible for the selected encoding.
            pass


def _add_pair_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("old", help="Old PDF, DOCX, HTML, Markdown, or text document")
    parser.add_argument("new", help="New PDF, DOCX, HTML, Markdown, or text document")
    parser.add_argument("--language", choices=("auto", "en", "zh"), default="auto")
    parser.add_argument("--config", help="Path to .governdiff.yml or JSON config")
    parser.add_argument(
        "--format",
        choices=("markdown", "json", "html", "csv"),
        default="markdown",
    )
    parser.add_argument("--output", help="Write the report to a file instead of stdout")
    parser.add_argument(
        "--review",
        help="Import a governdiff-review.json file before rendering the report",
    )
    parser.add_argument(
        "--min-confidence",
        choices=("low", "medium", "high"),
        help="Minimum confidence included by the breaking command",
    )
    _add_selection_arguments(parser)


def _add_selection_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--scope",
        choices=REPORT_SCOPES,
        help="Export all, Breaking, confirmed, unreviewed, or explicitly filtered findings",
    )
    parser.add_argument(
        "--redacted",
        action="store_true",
        help="Remove full block text and limit evidence/value excerpts",
    )
    parser.add_argument("--filter-change-type", action="append", default=[])
    parser.add_argument("--filter-check", action="append", default=[])
    parser.add_argument("--filter-severity", action="append", default=[])
    parser.add_argument(
        "--filter-confidence",
        action="append",
        choices=("low", "medium", "high"),
        default=[],
    )
    parser.add_argument(
        "--filter-review-state",
        action="append",
        choices=("unreviewed", "confirmed", "rejected", "modified", "waived"),
        default=[],
    )
    parser.add_argument("--filter-section", action="append", default=[])
    parser.add_argument("--filter-change", action="append", default=[])
    parser.add_argument("--filter-finding", action="append", default=[])


def _render(
    report: AnalysisReport,
    output_format: str,
    selection: ReportSelection,
    redacted: bool = False,
) -> str:
    renderers = {
        "json": render_json,
        "markdown": render_markdown,
        "html": render_html,
        "csv": render_csv,
    }
    return renderers[output_format](
        report,
        selection=selection,
        redacted=redacted,
    )


def _write(value: str, output: str | None) -> None:
    if output:
        target = Path(output)
        temporary = target.with_name(f".{target.name}.{secrets.token_hex(6)}.tmp")
        try:
            temporary.write_text(value, encoding="utf-8")
            temporary.replace(target)
        finally:
            try:
                temporary.unlink(missing_ok=True)
            except OSError:
                # The primary write/replace error is more actionable than a
                # secondary best-effort cleanup failure.
                pass
    else:
        sys.stdout.write(value)


def _config_context(path: str | None) -> tuple[Config, dict[str, Waiver]]:
    config = load_config(path)
    waiver_path = config.waivers_path
    if path and waiver_path and not Path(waiver_path).is_absolute():
        waiver_path = str(Path(path).resolve().parent / waiver_path)
    return config, load_waivers(waiver_path, config.require_waiver_reason)


def _cli_or_config(values: list[str], configured: tuple[str, ...]) -> tuple[str, ...]:
    return tuple(values) if values else configured


def _report_selection(
    args: argparse.Namespace,
    config: Config,
    report: AnalysisReport | None = None,
) -> ReportSelection:
    scope = args.scope or (
        "breaking"
        if args.command == "breaking"
        else "filtered"
        if args.command == "changelog" and config.report_scope == "all"
        else config.report_scope
    )
    visible_changes = tuple(args.filter_change)
    if (
        scope == "filtered"
        and not visible_changes
        and report is not None
        and report.review_import
    ):
        visible_changes = tuple(
            map(str, report.review_import.get("visible_change_fingerprints", []))
        )
    configured_change_types = config.report_change_types
    if (
        args.command == "changelog"
        and args.scope is None
        and config.report_scope == "all"
        and not args.filter_change_type
        and not configured_change_types
    ):
        configured_change_types = (
            "added", "removed", "modified", "split", "merged", "moved",
        )
    selection = ReportSelection(
        scope=scope,
        min_confidence=(
            args.min_confidence or config.min_confidence
            if scope == "breaking" else "low"
        ),
        change_types=_cli_or_config(args.filter_change_type, configured_change_types),
        checks=_cli_or_config(args.filter_check, config.report_checks),
        severities=_cli_or_config(args.filter_severity, config.report_severities),
        confidence_levels=_cli_or_config(
            args.filter_confidence, config.report_confidence_levels
        ),
        review_states=_cli_or_config(
            args.filter_review_state, config.report_review_states
        ),
        sections=_cli_or_config(args.filter_section, config.report_sections),
        visible_change_fingerprints=visible_changes,
        visible_finding_fingerprints=tuple(args.filter_finding),
    )
    selection.validate()
    return selection


def _pair_command(args: argparse.Namespace) -> int:
    config, waivers = _config_context(args.config)
    report = analyze_documents(
        args.old,
        args.new,
        language=args.language,
        enabled_checks=config.enabled_checks,
        waivers=waivers,
    )
    if args.review:
        apply_review(report, args.review, config.enabled_checks)
    selection = _report_selection(args, config, report)
    _write(
        _render(
            report,
            args.format,
            selection,
            redacted=args.redacted or config.report_redacted,
        ),
        args.output,
    )
    return 0


def _preflight_command(args: argparse.Namespace) -> int:
    result = preflight_document(args.document)
    if args.format == "json":
        value = json.dumps(result.to_dict(), ensure_ascii=False, indent=2) + "\n"
    else:
        lines = [
            "# GovernDiff preflight",
            "",
            f"- Document: `{args.document}`",
            f"- Status: **{result.status.upper()}**",
            f"- Format: `{result.source_format}`",
            f"- Size: {result.file_size_bytes} bytes",
            f"- Pages: {result.page_count if result.page_count is not None else 'n/a'}",
            f"- Paragraphs: {result.paragraph_count}",
            f"- Characters: {result.character_count}",
            f"- Text coverage: {result.text_coverage:.1%}" if result.text_coverage is not None else "- Text coverage: n/a",
            f"- Suspected scanned: {'yes' if result.suspected_scanned else 'no'}",
            "",
            "## Issues",
            "",
        ]
        if not result.issues:
            lines.append("No preflight issues.")
        for issue in result.issues:
            lines.extend([
                f"### `{issue.code}` · {issue.severity.upper()}",
                "",
                f"- Reason: {issue.reason}",
                f"- Impact: {issue.impact}",
                f"- Next step: {issue.next_step}",
                "",
            ])
        value = "\n".join(lines).rstrip() + "\n"
    _write(value, args.output)
    return 1 if result.status == "error" else 0


FINAL_REPORTS = {
    "json": "governdiff-final.json",
    "markdown": "governdiff-final.md",
    "html": "governdiff-final.html",
    "csv": "governdiff-final.csv",
}


def _prepare_output_directory(value: str) -> Path:
    directory = Path(value).resolve()
    collisions = [name for name in FINAL_REPORTS.values() if (directory / name).exists()]
    if collisions:
        raise ValueError(
            "Output directory already contains GovernDiff final reports; "
            "choose another --output-dir"
        )
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def _write_final_reports(
    report: AnalysisReport,
    output_directory: Path,
    *,
    redacted: bool,
) -> None:
    selection = ReportSelection(scope="all")
    for output_format, name in FINAL_REPORTS.items():
        target = output_directory / name
        temporary = output_directory / f".{name}.{secrets.token_hex(6)}.tmp"
        temporary.write_text(
            _render(report, output_format, selection, redacted=redacted),
            encoding="utf-8",
        )
        temporary.replace(target)


def _review_command(args: argparse.Namespace) -> int:
    for source in (args.old, args.new):
        if preflight_document(source).status == "error":
            raise ValueError(
                "Input preflight failed; run governdiff preflight for remediation details"
            )

    config, waivers = _config_context(args.config)
    report = analyze_documents(
        args.old,
        args.new,
        language=args.language,
        enabled_checks=config.enabled_checks,
        waivers=waivers,
    )
    initial_review = load_review(args.review) if args.review else None
    if initial_review is not None:
        identity = initial_review.get("report")
        if not isinstance(identity, dict) or any(
            str(identity.get(key, "")) != expected
            for key, expected in (
                ("old_sha256", report.old_document.sha256),
                ("new_sha256", report.new_document.sha256),
            )
        ):
            raise ValueError("Initial review identity does not match the analyzed documents")
        apply_review(copy.deepcopy(report), initial_review, config.enabled_checks)

    output_directory = _prepare_output_directory(args.output_dir)
    session_directory = create_session_directory()
    retained = False
    retain_requested = bool(args.keep_session)
    try:
        report_payload = json.loads(
            render_json(report, selection=ReportSelection(scope="all"))
        )
        review = run_local_reviewer(
            report_payload,
            session_directory=session_directory,
            initial_review=initial_review,
            port=args.port,
            language=(
                "zh"
                if args.language == "zh" or report.new_document.language == "zh"
                else "en"
            ),
            no_open=args.no_open,
            session_timeout_seconds=args.session_timeout,
        )
        apply_review(report, review, config.enabled_checks)
        _write_final_reports(
            report,
            output_directory,
            redacted=args.redacted or config.report_redacted,
        )
        print("Final reviewed reports generated: JSON, Markdown, HTML, and CSV.")

        if not retain_requested and sys.stdin.isatty():
            answer = input("Remove the temporary local review session? [Y/n] ").strip()
            retain_requested = answer.casefold() in {"n", "no"}
        if retain_requested:
            retained_name = retain_session(session_directory, output_directory)
            retained = True
            print(f"Temporary session retained as {retained_name} inside the output directory.")
        else:
            securely_remove_session(session_directory)
        return 0
    finally:
        if session_directory.exists() and not retained:
            if args.keep_session:
                retained_name = retain_session(session_directory, output_directory)
                print(
                    f"Temporary session retained as {retained_name} "
                    "inside the output directory."
                )
            else:
                securely_remove_session(session_directory)


def _git_show(base: str, path: str) -> str | None:
    normalized_path = path.replace("\\", "/")
    process = subprocess.run(
        ["git", "show", f"{base}:{normalized_path}"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if process.returncode == 0:
        return process.stdout
    if "does not exist" in process.stderr or "exists on disk" in process.stderr:
        return None
    raise RuntimeError(process.stderr.strip() or f"git show failed for {path}")


def _git_matching_paths(base: str, pattern: str) -> set[str]:
    process = subprocess.run(
        ["git", "ls-tree", "-r", "--name-only", base],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if process.returncode != 0:
        raise RuntimeError(process.stderr.strip() or f"git ls-tree failed for {base}")
    normalized = pattern.replace("\\", "/")
    return {
        path
        for path in process.stdout.splitlines()
        if fnmatch.fnmatchcase(path, normalized)
    }


def _check_base(args: argparse.Namespace) -> int:
    config, waivers = _config_context(args.config)
    if not config.documents:
        raise ValueError("check --base requires at least one document in the config")
    reports: list[AnalysisReport] = []
    for spec in config.documents:
        current_paths = {path.replace("\\", "/") for path in glob.glob(spec.path, recursive=True)}
        base_paths = _git_matching_paths(args.base, spec.path)
        paths = sorted(current_paths | base_paths) or [spec.path]
        for path in paths:
            old_text = _git_show(args.base, path) or ""
            current = Path(path)
            new_text = current.read_text(encoding="utf-8-sig") if current.exists() else ""
            reports.append(analyze_texts(
                old_text,
                new_text,
                f"{args.base}:{path}",
                path,
                spec.language,
                config.enabled_checks,
                waivers,
            ))

    rendered = []
    for report in reports:
        selection = _report_selection(args, config, report)
        rendered.append(_render(
            report,
            args.format,
            selection,
            redacted=args.redacted or config.report_redacted,
        ))
    if args.format == "json" and len(reports) > 1:
        value = json.dumps(
            {
                "reports": [
                    json.loads(_render(
                        report,
                        "json",
                        _report_selection(args, config, report),
                        redacted=args.redacted or config.report_redacted,
                    ))
                    for report in reports
                ]
            },
            ensure_ascii=False,
            indent=2,
        ) + "\n"
    else:
        value = "\n".join(rendered)
    _write(value, args.output)

    threshold = SEVERITY_ORDER.get(config.fail_on, SEVERITY_ORDER["high"])
    confidence_threshold = CONFIDENCE_ORDER.get(
        args.min_confidence or config.min_confidence,
        CONFIDENCE_ORDER["medium"],
    )
    failed = any(
        SEVERITY_ORDER.get(finding.severity, 0) >= threshold
        and CONFIDENCE_ORDER.get(finding.confidence_level, 0) >= confidence_threshold
        and finding.active
        for report in reports
        for change in report.changes
        for finding in change.findings
    )
    return 2 if failed else 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="governdiff",
        description="Policy diff and breaking-change detection for governance documents.",
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    commands = parser.add_subparsers(dest="command", required=True)
    for name, help_text in (
        ("diff", "Show a semantic policy diff"),
        ("changelog", "Generate a reviewer-oriented policy changelog"),
        ("breaking", "Show only unwaived breaking findings"),
    ):
        command = commands.add_parser(name, help=help_text)
        _add_pair_arguments(command)
        command.set_defaults(handler=_pair_command)

    preflight = commands.add_parser("preflight", help="Validate one input and report extraction risks")
    preflight.add_argument("document", help="PDF, DOCX, HTML, Markdown, or text document")
    preflight.add_argument("--format", choices=("markdown", "json"), default="markdown")
    preflight.add_argument("--output")
    preflight.set_defaults(handler=_preflight_command)

    review = commands.add_parser(
        "review",
        help="Compare two documents in a secure local Reviewer session",
    )
    review.add_argument("old", help="Old PDF, DOCX, HTML, Markdown, or text document")
    review.add_argument("new", help="New PDF, DOCX, HTML, Markdown, or text document")
    review.add_argument("--port", type=int, default=0, help="Loopback port; 0 selects an available port")
    review.add_argument("--language", choices=("auto", "en", "zh"), default="auto")
    review.add_argument("--config", help="Path to .governdiff.yml or JSON config")
    review.add_argument("--review", help="Seed the session with a matching review JSON")
    review.add_argument(
        "--output-dir",
        default="governdiff-review-output",
        help="Directory for final JSON, Markdown, HTML, and CSV reports",
    )
    review.add_argument("--no-open", action="store_true", help="Do not open the browser automatically")
    review.add_argument("--redacted", action="store_true", help="Redact evidence in final reports")
    review.add_argument(
        "--keep-session",
        action="store_true",
        help="Retain the temporary session artifacts inside --output-dir",
    )
    review.add_argument(
        "--session-timeout",
        type=int,
        default=43_200,
        help=argparse.SUPPRESS,
    )
    review.set_defaults(handler=_review_command)

    check = commands.add_parser("check", help="Check configured documents against a Git revision")
    check.add_argument("--base", required=True, help="Git revision used as the old policy baseline")
    check.add_argument("--config", default=".governdiff.yml")
    check.add_argument("--format", choices=("markdown", "json"), default="markdown")
    check.add_argument("--output")
    check.add_argument("--min-confidence", choices=("low", "medium", "high"))
    _add_selection_arguments(check)
    check.set_defaults(handler=_check_base)
    return parser


def main(argv: list[str] | None = None) -> int:
    _configure_utf8_console_streams()
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return int(args.handler(args))
    except KeyboardInterrupt:
        parser.exit(130, "governdiff: review interrupted; local session stopped.\n")
    except (OSError, ValueError, RuntimeError) as error:
        parser.exit(1, f"governdiff: error: {safe_exception_message(error)}\n")


if __name__ == "__main__":
    raise SystemExit(main())
