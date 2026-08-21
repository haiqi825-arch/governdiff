"""Production GitHub Actions adapter for GovernDiff's deterministic engine."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from typing import Iterable

from governdiff.config import Config, DocumentSpec, Waiver, load_config, load_waivers
from governdiff.engine import analyze_document_versions, analyze_documents
from governdiff.models import (
    CONFIDENCE_ORDER,
    SEVERITY_ORDER,
    AnalysisReport,
    Finding,
)
from governdiff.privacy import redact_log_message, safe_exception_message
from governdiff.report import render_csv, render_html, render_json, render_markdown


ACTION_SCHEMA_VERSION = "governdiff-action/1.0"
ACTION_RELEASE_CHANNEL = "v1"
ARTIFACT_LINK_TOKEN = "{{GOVERNDIFF_ARTIFACT_URL}}"
SUPPORTED_SUFFIXES = {".md", ".markdown", ".txt", ".pdf", ".docx", ".html", ".htm"}
STATUS_LABELS = {
    "A": "added",
    "C": "copied",
    "D": "deleted",
    "M": "modified",
    "R": "renamed",
    "T": "type_changed",
    "U": "unmerged",
    "X": "unknown",
    "B": "broken_pairing",
}


@dataclass(frozen=True, slots=True)
class GitDocumentChange:
    status: str
    old_path: str | None
    new_path: str | None
    language: str = "auto"

    @property
    def display_path(self) -> str:
        if self.old_path and self.new_path and self.old_path != self.new_path:
            return f"{self.old_path} → {self.new_path}"
        return self.new_path or self.old_path or "(unknown)"


@dataclass(slots=True)
class FileAudit:
    change: GitDocumentChange
    report: AnalysisReport
    report_paths: dict[str, str]
    breaking: list[tuple[Finding, object]]
    gated: list[tuple[Finding, object]]


def _boolean(value: str) -> bool:
    normalized = value.strip().casefold()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    raise argparse.ArgumentTypeError(f"expected a boolean, received {value!r}")


def _config_context(path: str) -> tuple[Config, dict[str, Waiver]]:
    config_path = path.strip()
    config = load_config(config_path or None)
    waiver_path = config.waivers_path
    if config_path and waiver_path and not Path(waiver_path).is_absolute():
        waiver_path = str(Path(config_path).resolve().parent / waiver_path)
    return config, load_waivers(waiver_path, config.require_waiver_reason)


def _escape_command(value: str) -> str:
    return (
        value.replace("%", "%25")
        .replace("\r", "%0D")
        .replace("\n", "%0A")
        .replace(":", "%3A")
        .replace(",", "%2C")
    )


def _write_github_values(path: str | None, values: dict[str, str]) -> None:
    if not path:
        return
    with Path(path).open("a", encoding="utf-8") as handle:
        for key, value in values.items():
            if "\n" in value or "\r" in value:
                delimiter = f"GVD_{hashlib.sha256(value.encode('utf-8')).hexdigest()[:12]}"
                handle.write(f"{key}<<{delimiter}\n{value}\n{delimiter}\n")
            else:
                handle.write(f"{key}={value}\n")


def _active_findings(report: AnalysisReport) -> list[tuple[Finding, object]]:
    return [
        (finding, change)
        for change in report.changes
        for finding in change.findings
        if finding.active
    ]


def _run_git(repository: Path, *arguments: str, text: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", "-C", str(repository), *arguments],
        capture_output=True,
        text=text,
        encoding="utf-8" if text else None,
        errors="replace" if text else None,
        check=False,
    )


def _repository_root() -> Path:
    process = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    if process.returncode != 0:
        raise RuntimeError(process.stderr.strip() or "not inside a Git repository")
    return Path(process.stdout.strip()).resolve()


def _event_base_sha() -> str:
    event_path = os.environ.get("GITHUB_EVENT_PATH", "").strip()
    if not event_path or not Path(event_path).is_file():
        return ""
    try:
        data = json.loads(Path(event_path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return ""
    pull_request = data.get("pull_request") if isinstance(data, dict) else None
    base = pull_request.get("base") if isinstance(pull_request, dict) else None
    return str(base.get("sha", "")).strip() if isinstance(base, dict) else ""


def _verify_commit(repository: Path, revision: str) -> str | None:
    process = _run_git(repository, "rev-parse", "--verify", f"{revision}^{{commit}}")
    return process.stdout.strip() if process.returncode == 0 else None


def _resolve_base(repository: Path, requested: str) -> tuple[str, str]:
    base = (
        requested.strip()
        or os.environ.get("GOVERNDIFF_PR_BASE_SHA", "").strip()
        or _event_base_sha()
    )
    if not base:
        base_ref = os.environ.get("GITHUB_BASE_REF", "").strip()
        if base_ref:
            base = f"origin/{base_ref}"
    if not base:
        raise ValueError(
            "PR-base mode requires --base or a pull_request base SHA/ref from GitHub"
        )

    commit = _verify_commit(repository, base)
    if commit:
        return base, commit

    fetch_target = base.removeprefix("origin/")
    process = _run_git(
        repository,
        "fetch",
        "--no-tags",
        "--depth=1",
        "origin",
        fetch_target,
    )
    if process.returncode != 0:
        raise RuntimeError(
            f"Git base {base!r} is unavailable and could not be fetched: "
            f"{process.stderr.strip() or 'git fetch failed'}"
        )
    commit = _verify_commit(repository, base) or _verify_commit(repository, "FETCH_HEAD")
    if not commit:
        raise RuntimeError(f"Fetched Git base {base!r} did not resolve to a commit")
    return base, commit


def _split_patterns(value: str) -> list[str]:
    return [
        item.replace("\\", "/").removeprefix("./").strip()
        for item in re.split(r"[,\r\n]+", value)
        if item.strip()
    ]


def _glob_expression(pattern: str) -> re.Pattern[str]:
    """Compile a repository-relative glob where * never crosses a slash."""

    normalized = pattern.replace("\\", "/").removeprefix("./")
    pieces: list[str] = ["^"]
    index = 0
    while index < len(normalized):
        char = normalized[index]
        if char == "*" and index + 1 < len(normalized) and normalized[index + 1] == "*":
            index += 2
            if index < len(normalized) and normalized[index] == "/":
                pieces.append("(?:.*/)?")
                index += 1
            else:
                pieces.append(".*")
            continue
        if char == "*":
            pieces.append("[^/]*")
        elif char == "?":
            pieces.append("[^/]")
        else:
            pieces.append(re.escape(char))
        index += 1
    pieces.append("$")
    return re.compile("".join(pieces))


def _matches(path: str, pattern: str) -> bool:
    return bool(_glob_expression(pattern).fullmatch(path.replace("\\", "/")))


def _document_specs(paths: str, config: Config) -> list[DocumentSpec]:
    patterns = _split_patterns(paths)
    if patterns:
        return [
            DocumentSpec(
                pattern,
                next(
                    (
                        spec.language
                        for spec in config.documents
                        if spec.path.replace("\\", "/") == pattern
                    ),
                    "auto",
                ),
            )
            for pattern in patterns
        ]
    if config.documents:
        return config.documents
    raise ValueError(
        "PR-base mode requires the paths input or at least one documents entry in config"
    )


def _parse_name_status(raw: bytes) -> list[tuple[str, str, str | None]]:
    fields = raw.split(b"\0")
    if fields and fields[-1] == b"":
        fields.pop()
    values: list[tuple[str, str, str | None]] = []
    index = 0
    while index < len(fields):
        status = fields[index].decode("utf-8", errors="surrogateescape")
        index += 1
        if index >= len(fields):
            raise RuntimeError("git diff returned an incomplete name-status record")
        first = fields[index].decode("utf-8", errors="surrogateescape").replace("\\", "/")
        index += 1
        second = None
        if status[:1] in {"R", "C"}:
            if index >= len(fields):
                raise RuntimeError("git diff returned an incomplete rename/copy record")
            second = fields[index].decode("utf-8", errors="surrogateescape").replace("\\", "/")
            index += 1
        values.append((status, first, second))
    return values


def _changed_documents(
    repository: Path,
    base_commit: str,
    specs: list[DocumentSpec],
) -> list[GitDocumentChange]:
    process = _run_git(
        repository,
        "diff",
        "--name-status",
        "-z",
        "--find-renames",
        "--diff-filter=ACDMRTUXB",
        base_commit,
        "--",
        text=False,
    )
    if process.returncode != 0:
        stderr = process.stderr.decode("utf-8", errors="replace")
        raise RuntimeError(stderr.strip() or "git diff failed")

    changes: list[GitDocumentChange] = []
    for raw_status, first, second in _parse_name_status(process.stdout):
        code = raw_status[:1]
        if code in {"R", "C"}:
            old_path, new_path = first, second
        elif code == "A":
            old_path, new_path = None, first
        elif code == "D":
            old_path, new_path = first, None
        else:
            old_path = new_path = first
        candidates = [path for path in (old_path, new_path) if path]
        matched = next(
            (spec for spec in specs if any(_matches(path, spec.path) for path in candidates)),
            None,
        )
        if not matched:
            continue
        suffix_path = new_path or old_path or ""
        if PurePosixPath(suffix_path).suffix.casefold() not in SUPPORTED_SUFFIXES:
            raise ValueError(
                f"Matched path {suffix_path!r} has an unsupported document format"
            )
        changes.append(
            GitDocumentChange(
                status=STATUS_LABELS.get(code, "unknown"),
                old_path=old_path,
                new_path=new_path,
                language=matched.language,
            )
        )
    return sorted(changes, key=lambda item: (item.new_path or item.old_path or "", item.status))


def _safe_repository_path(repository: Path, path: str) -> Path:
    candidate = (repository / Path(*PurePosixPath(path).parts)).resolve()
    try:
        candidate.relative_to(repository)
    except ValueError as error:
        raise ValueError(f"Git path escapes the repository: {path!r}") from error
    return candidate


def _materialize_blob(repository: Path, base_commit: str, path: str, destination: Path) -> Path:
    process = _run_git(repository, "show", f"{base_commit}:{path}", text=False)
    if process.returncode != 0:
        stderr = process.stderr.decode("utf-8", errors="replace")
        raise RuntimeError(stderr.strip() or f"could not read {path!r} from Git base")
    relative = PurePosixPath(path)
    if relative.is_absolute() or ".." in relative.parts:
        raise ValueError(f"Git path escapes the temporary base directory: {path!r}")
    target = destination.joinpath(*relative.parts).resolve()
    try:
        target.relative_to(destination.resolve())
    except ValueError as error:
        raise ValueError(f"Git path escapes the temporary base directory: {path!r}") from error
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(process.stdout)
    return target


def _slug(index: int, change: GitDocumentChange) -> str:
    path = change.new_path or change.old_path or "document"
    safe = re.sub(r"[^A-Za-z0-9._-]+", "-", path).strip("-.") or "document"
    digest = hashlib.sha256(change.display_path.encode("utf-8")).hexdigest()[:8]
    return f"{index:03d}-{safe[:72]}-{digest}"


def _write_report_bundle(
    report: AnalysisReport,
    directory: Path,
    output_root: Path,
) -> dict[str, str]:
    directory.mkdir(parents=True, exist_ok=True)
    paths = {
        "json": directory / "report.json",
        "markdown": directory / "report.md",
        "html": directory / "report.html",
        "csv": directory / "report.csv",
    }
    paths["json"].write_text(render_json(report), encoding="utf-8")
    paths["markdown"].write_text(render_markdown(report), encoding="utf-8")
    paths["html"].write_text(render_html(report), encoding="utf-8")
    paths["csv"].write_text(render_csv(report), encoding="utf-8")
    return {
        key: path.relative_to(output_root).as_posix()
        for key, path in paths.items()
    }


def _threshold_findings(
    report: AnalysisReport,
    min_confidence: str,
    fail_on_severity: str,
) -> tuple[list[tuple[Finding, object]], list[tuple[Finding, object]]]:
    confidence_threshold = CONFIDENCE_ORDER[min_confidence]
    severity_threshold = SEVERITY_ORDER[fail_on_severity]
    breaking = [
        (finding, change)
        for finding, change in _active_findings(report)
        if finding.breaking
        and CONFIDENCE_ORDER[finding.confidence_level] >= confidence_threshold
    ]
    gated = [
        (finding, change)
        for finding, change in breaking
        if SEVERITY_ORDER[finding.severity] >= severity_threshold
    ]
    return breaking, gated


def _markdown_text(value: str) -> str:
    return value.replace("|", "\\|").replace("\n", " ")


def _compact_summary(
    audits: list[FileAudit],
    *,
    gate_enabled: bool,
    gate_failed: bool,
    min_confidence: str,
    fail_on_severity: str,
    artifact_name: str,
) -> str:
    total_changes = sum(item.report.summary()["total_changes"] for item in audits)
    active_findings = sum(item.report.summary()["active_findings"] for item in audits)
    breaking = sum(len(item.breaking) for item in audits)
    gated = sum(len(item.gated) for item in audits)
    waived = sum(
        finding.waived
        for item in audits
        for change in item.report.changes
        for finding in change.findings
    )
    if not gate_enabled:
        gate_reason = (
            f"Advisory mode is enabled; {gated} finding(s) would cross severity "
            f"`{fail_on_severity}` and confidence `{min_confidence}`."
        )
    elif gate_failed:
        gate_reason = (
            f"{gated} active breaking finding(s) reached severity `{fail_on_severity}` "
            f"and confidence `{min_confidence}`."
        )
    else:
        gate_reason = (
            f"No active breaking finding reached both `{fail_on_severity}` severity "
            f"and `{min_confidence}` confidence."
        )
    lines = [
        "## GovernDiff policy audit",
        "",
        f"**Gate: {'FAILED' if gate_failed else 'PASSED'}** — {gate_reason}",
        "",
        f"- Files audited: **{len(audits)}**; changes: **{total_changes}**; active findings: **{active_findings}**",
        f"- Breaking at confidence threshold: **{breaking}**; gate findings: **{gated}**; matched waivers: **{waived}**",
        f"- Full JSON, HTML, CSV, and Markdown evidence: [{artifact_name}]({ARTIFACT_LINK_TOKEN})",
        "",
        "| File status | Policy file | Changes | Active findings | Breaking | Gate findings |",
        "|---|---|---:|---:|---:|---:|",
    ]
    for item in audits[:20]:
        summary = item.report.summary()
        lines.append(
            f"| {item.change.status} | `{_markdown_text(item.change.display_path)}` | "
            f"{summary['total_changes']} | {summary['active_findings']} | "
            f"{len(item.breaking)} | {len(item.gated)} |"
        )
    if len(audits) > 20:
        lines.append(f"| … | {len(audits) - 20} additional file(s) in the artifact | — | — | — | — |")

    priority = sorted(
        (
            (finding, change, audit)
            for audit in audits
            for finding, change in audit.gated
        ),
        key=lambda item: (
            -SEVERITY_ORDER[item[0].severity],
            -CONFIDENCE_ORDER[item[0].confidence_level],
            item[0].fingerprint,
        ),
    )
    if priority:
        lines.extend(["", "### Highest-priority findings", ""])
        for finding, change, audit in priority[:10]:
            block = change.new_block or change.old_block
            evidence = block.evidence_label if block else "location unavailable"
            lines.append(
                f"- `{finding.fingerprint}` · **{finding.severity}** · "
                f"`{finding.check_id}` · {finding.confidence_level} "
                f"`{finding.confidence_score:.2f}` — {_markdown_text(finding.summary)} "
                f"(`{_markdown_text(audit.change.display_path)}`, {evidence})"
            )
        if len(priority) > 10:
            lines.append(f"- … {len(priority) - 10} additional gate finding(s) are in the artifact.")
    return "\n".join(lines).rstrip() + "\n"


def _emit_annotations(
    audits: Iterable[FileAudit],
    limit: int,
    *,
    include_details: bool = False,
) -> None:
    emitted = 0
    for audit in audits:
        for finding, change in audit.gated:
            if emitted >= limit:
                return
            block = change.new_block or change.old_block
            source = audit.change.new_path or audit.change.old_path or "policy"
            line = max(1, block.line_start) if block else 1
            message = (
                f"GovernDiff gate finding [{finding.check_id}; "
                f"{finding.confidence_level} {finding.confidence_score:.2f}; "
                f"{finding.fingerprint}]. Full evidence is available in the report artifact."
            )
            if include_details:
                message = (
                    f"{finding.summary} [{finding.check_id}; "
                    f"{finding.confidence_level} {finding.confidence_score:.2f}; "
                    f"{finding.fingerprint}; "
                    f"{block.evidence_label if block else 'location unavailable'}]"
                )
                print(
                    f"::warning file={_escape_command(source)},line={line},"
                    f"title=GovernDiff {_escape_command(finding.severity.upper())}::"
                    f"{_escape_command(message)}"
                )
            else:
                print(
                    f"::warning title=GovernDiff {_escape_command(finding.severity.upper())}::"
                    f"{_escape_command(redact_log_message(message))}"
                )
            emitted += 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run GovernDiff as a GitHub Action")
    parser.add_argument("--old", default="")
    parser.add_argument("--new", default="")
    parser.add_argument("--base", default="")
    parser.add_argument("--paths", default="")
    parser.add_argument("--config", default="")
    parser.add_argument("--min-confidence", choices=("low", "medium", "high"), default="medium")
    parser.add_argument(
        "--fail-on-severity",
        choices=("info", "low", "medium", "high", "critical"),
        default="high",
    )
    parser.add_argument("--fail-on-breaking", type=_boolean, default=True)
    parser.add_argument("--report-dir", default="governdiff-report")
    parser.add_argument("--artifact-name", default="governdiff-report")
    parser.add_argument("--annotation-limit", type=int, default=20)
    parser.add_argument("--include-annotation-details", type=_boolean, default=False)
    parser.add_argument("--defer-failure", action="store_true")
    return parser


def _pair_audit(args: argparse.Namespace, config: Config, waivers: dict[str, Waiver]) -> tuple[list[FileAudit], str | None, str | None]:
    if not (args.old and args.new):
        raise ValueError("old and new must either both be set or both be omitted")
    report = analyze_documents(
        args.old,
        args.new,
        enabled_checks=config.enabled_checks,
        waivers=waivers,
    )
    breaking, gated = _threshold_findings(
        report, args.min_confidence, args.fail_on_severity
    )
    change = GitDocumentChange("modified", args.old, args.new)
    return [FileAudit(change, report, {}, breaking, gated)], None, None


def _git_audits(
    args: argparse.Namespace,
    config: Config,
    waivers: dict[str, Waiver],
    temporary: Path,
) -> tuple[list[FileAudit], str, str]:
    repository = _repository_root()
    base_ref, base_commit = _resolve_base(repository, args.base)
    specs = _document_specs(args.paths, config)
    changes = _changed_documents(repository, base_commit, specs)
    audits: list[FileAudit] = []
    old_root = temporary / "base"
    for change in changes:
        old_file = (
            _materialize_blob(repository, base_commit, change.old_path, old_root)
            if change.old_path
            else None
        )
        new_file = (
            _safe_repository_path(repository, change.new_path)
            if change.new_path
            else None
        )
        if new_file is not None and not new_file.is_file():
            raise RuntimeError(f"Changed Git path is not a file in the working tree: {change.new_path}")
        report = analyze_document_versions(
            old_file,
            new_file,
            old_logical_path=(f"{base_ref}:{change.old_path}" if change.old_path else change.new_path),
            new_logical_path=(change.new_path or change.old_path),
            language=change.language,
            enabled_checks=config.enabled_checks,
            waivers=waivers,
        )
        breaking, gated = _threshold_findings(
            report, args.min_confidence, args.fail_on_severity
        )
        audits.append(FileAudit(change, report, {}, breaking, gated))
    return audits, base_ref, base_commit


def run(args: argparse.Namespace) -> tuple[bool, dict[str, str]]:
    if args.annotation_limit < 0:
        raise ValueError("annotation-limit must be zero or greater")
    config, waivers = _config_context(args.config)
    output_dir = Path(args.report_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="governdiff-action-") as temporary:
        if args.old or args.new:
            audits, base_ref, base_commit = _pair_audit(args, config, waivers)
            mode = "pair"
            patterns: list[str] = []
        else:
            audits, base_ref, base_commit = _git_audits(
                args, config, waivers, Path(temporary)
            )
            mode = "git-base"
            patterns = [spec.path for spec in _document_specs(args.paths, config)]

        reports_root = output_dir / "reports"
        for index, audit in enumerate(audits, start=1):
            audit.report_paths = _write_report_bundle(
                audit.report,
                reports_root / _slug(index, audit.change),
                output_dir,
            )

    all_gated = [item for audit in audits for item in audit.gated]
    gate_failed = args.fail_on_breaking and bool(all_gated)
    _emit_annotations(
        audits,
        args.annotation_limit,
        include_details=args.include_annotation_details,
    )

    summary = _compact_summary(
        audits,
        gate_enabled=args.fail_on_breaking,
        gate_failed=gate_failed,
        min_confidence=args.min_confidence,
        fail_on_severity=args.fail_on_severity,
        artifact_name=args.artifact_name,
    )
    summary_path = output_dir / "summary.md"
    summary_path.write_text(summary, encoding="utf-8")

    aggregate = {
        "schema_version": ACTION_SCHEMA_VERSION,
        "release_channel": ACTION_RELEASE_CHANNEL,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "mode": mode,
        "base_ref": base_ref,
        "base_commit": base_commit,
        "patterns": patterns,
        "gate": {
            "enabled": args.fail_on_breaking,
            "failed": gate_failed,
            "minimum_confidence": args.min_confidence,
            "minimum_severity": args.fail_on_severity,
            "finding_count": len(all_gated),
            "reason": (
                f"Advisory mode: {len(all_gated)} finding(s) would cross both thresholds."
                if not args.fail_on_breaking
                else f"{len(all_gated)} active breaking finding(s) crossed both thresholds."
                if gate_failed
                else "No active breaking finding crossed both thresholds."
            ),
        },
        "summary": {
            "files": len(audits),
            "changes": sum(item.report.summary()["total_changes"] for item in audits),
            "active_findings": sum(item.report.summary()["active_findings"] for item in audits),
            "breaking_at_confidence_threshold": sum(len(item.breaking) for item in audits),
            "high_confidence_breaking_findings": sum(
                finding.breaking and finding.confidence_level == "high"
                for item in audits
                for finding, _ in _active_findings(item.report)
            ),
            "matched_waivers": sum(
                finding.waived
                for item in audits
                for change in item.report.changes
                for finding in change.findings
            ),
            "statuses": {
                label: sum(item.change.status == label for item in audits)
                for label in sorted(set(STATUS_LABELS.values()))
            },
        },
        "files": [
            {
                "status": item.change.status,
                "old_path": item.change.old_path,
                "new_path": item.change.new_path,
                "display_path": item.change.display_path,
                "old_sha256": item.report.old_document.sha256,
                "new_sha256": item.report.new_document.sha256,
                "summary": item.report.summary(),
                "breaking_at_confidence_threshold": len(item.breaking),
                "gate_finding_fingerprints": [finding.fingerprint for finding, _ in item.gated],
                "reports": item.report_paths,
            }
            for item in audits
        ],
    }
    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(
        json.dumps(aggregate, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    legacy_paths = {"json": "", "markdown": "", "html": "", "csv": ""}
    if len(audits) == 1:
        legacy_paths = {
            key: (output_dir / relative).as_posix()
            for key, relative in audits[0].report_paths.items()
        }
    values = {
        "action-schema": ACTION_SCHEMA_VERSION,
        "release-channel": ACTION_RELEASE_CHANNEL,
        "gate-failed": str(gate_failed).lower(),
        "files-audited": str(len(audits)),
        "breaking-count": str(sum(len(item.breaking) for item in audits)),
        "high-confidence-breaking-count": str(
            aggregate["summary"]["high_confidence_breaking_findings"]
        ),
        "report-dir": output_dir.as_posix(),
        "report-manifest": manifest_path.as_posix(),
        "report-summary": summary_path.as_posix(),
        "report-json": legacy_paths["json"],
        "report-markdown": legacy_paths["markdown"],
        "report-html": legacy_paths["html"],
        "report-csv": legacy_paths["csv"],
    }
    _write_github_values(os.environ.get("GITHUB_OUTPUT"), values)
    print(
        f"GovernDiff: {'failed' if gate_failed else 'passed'}; "
        f"{len(audits)} file(s), {values['breaking-count']} breaking finding(s)."
    )
    return gate_failed, values


def _publish_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Publish the compact GovernDiff Job Summary")
    parser.add_argument("--summary-file", required=True)
    parser.add_argument("--artifact-url", default="")
    parser.add_argument("--artifact-name", default="governdiff-report")
    parser.add_argument("--upload-artifact", type=_boolean, default=True)
    return parser


def publish_summary(args: argparse.Namespace) -> str:
    summary = Path(args.summary_file).read_text(encoding="utf-8")
    artifact_url = args.artifact_url.strip()
    if not artifact_url and args.upload_artifact:
        server = os.environ.get("GITHUB_SERVER_URL", "https://github.com").rstrip("/")
        repository = os.environ.get("GITHUB_REPOSITORY", "").strip()
        run_id = os.environ.get("GITHUB_RUN_ID", "").strip()
        if repository and run_id:
            artifact_url = f"{server}/{repository}/actions/runs/{run_id}#artifacts"
    replacement = artifact_url or f"artifact upload disabled ({args.artifact_name})"
    if not artifact_url:
        summary = summary.replace(
            f"[{args.artifact_name}]({ARTIFACT_LINK_TOKEN})",
            replacement,
        )
    else:
        summary = summary.replace(ARTIFACT_LINK_TOKEN, artifact_url)
    github_summary = os.environ.get("GITHUB_STEP_SUMMARY", "").strip()
    if github_summary:
        with Path(github_summary).open("a", encoding="utf-8") as handle:
            handle.write(summary)
    print(f"GovernDiff: compact Job Summary published for {args.artifact_name}.")
    return summary


def main(argv: list[str] | None = None) -> int:
    values = list(sys.argv[1:] if argv is None else argv)
    try:
        if values[:1] == ["publish-summary"]:
            publish_summary(_publish_parser().parse_args(values[1:]))
            return 0
        args = build_parser().parse_args(values)
        gate_failed, _ = run(args)
        return 0 if args.defer_failure or not gate_failed else 2
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        message = safe_exception_message(error)
        print(f"::error title=GovernDiff configuration or runtime error::{_escape_command(message)}")
        print(f"GovernDiff: error: {message}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
