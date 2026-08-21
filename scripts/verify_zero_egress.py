"""Prove that AI-off comparison and rendering make no Python network calls."""

from __future__ import annotations

import json
import argparse
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))


NETWORK_EVENT_PREFIXES = (
    "socket.",
    "http.client.",
    "urllib.",
)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default="")
    args = parser.parse_args(argv)
    attempts: list[str] = []

    def deny_network(event: str, _arguments: tuple[object, ...]) -> None:
        if event.startswith(NETWORK_EVENT_PREFIXES):
            attempts.append(event)
            raise RuntimeError(f"AI-off zero-egress violation: {event}")

    sys.addaudithook(deny_network)

    from governdiff import analyze_documents  # noqa: PLC0415
    from governdiff.report import render_csv, render_html, render_json, render_markdown  # noqa: PLC0415

    fixture = ROOT / "tests" / "format_fixtures"
    pairs = [
        (
            ROOT / "examples" / "public-cases" / "01-incident-deadline" / "old.md",
            ROOT / "examples" / "public-cases" / "01-incident-deadline" / "new.md",
        ),
        (fixture / "digital_policy_old.pdf", fixture / "digital_policy_new.pdf"),
        (fixture / "policy_old.docx", fixture / "policy_new.docx"),
        (fixture / "policy_old.html", fixture / "policy_new.html"),
    ]
    formats: list[str] = []
    report_count = 0
    with tempfile.TemporaryDirectory(prefix="governdiff-zero-egress-") as directory:
        old_text = Path(directory) / "old.txt"
        new_text = Path(directory) / "new.txt"
        old_text.write_text("Members may file a request within 30 days.\n", encoding="utf-8")
        new_text.write_text("Members must file a request within 10 days.\n", encoding="utf-8")
        pairs.append((old_text, new_text))

        for old, new in pairs:
            report = analyze_documents(old, new)
            formats.append(report.old_document.source_format)
            render_json(report)
            render_markdown(report)
            render_html(report)
            render_csv(report)
            report_count += 1

    result = {
        "schema_version": "governdiff-zero-egress/1.0",
        "ai_mode": "off",
        "network_attempts": len(attempts),
        "network_events": attempts,
        "document_pairs": report_count,
        "formats": sorted(formats),
        "passed": not attempts and set(formats) == {"docx", "html", "markdown", "pdf", "text"},
    }
    rendered = json.dumps(result, ensure_ascii=False, sort_keys=True) + "\n"
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
