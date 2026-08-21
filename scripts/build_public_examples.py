"""Regenerate the three deterministic, publication-safe public examples."""

from __future__ import annotations

import json
from pathlib import Path

from governdiff.engine import analyze_documents
from governdiff.report import ReportSelection, render_json


ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "examples" / "public-cases"
FIXED_TIME = "2026-08-13T00:00:00+00:00"


def main() -> int:
    manifest = json.loads((EXAMPLES / "manifest.json").read_text(encoding="utf-8"))
    results: list[dict[str, object]] = []
    for case in manifest["cases"]:
        directory = EXAMPLES / case["id"]
        report = analyze_documents(
            directory / "old.md",
            directory / "new.md",
            language=case["language"],
        )
        report.old_document.path = (directory / "old.md").relative_to(ROOT).as_posix()
        report.new_document.path = (directory / "new.md").relative_to(ROOT).as_posix()
        report.generated_at = FIXED_TIME
        report.old_document.imported_at = FIXED_TIME
        report.new_document.imported_at = FIXED_TIME
        checks = {
            finding.check_id
            for change in report.changes
            for finding in change.findings
        }
        expected = set(case["expected_checks"])
        missing = expected - checks
        if missing:
            raise RuntimeError(f"{case['id']} missing expected checks: {sorted(missing)}")
        (directory / "report.json").write_text(
            render_json(report, selection=ReportSelection(scope="all")),
            encoding="utf-8",
        )
        results.append(
            {
                "id": case["id"],
                "changes": report.summary()["total_changes"],
                "checks": sorted(checks),
                "passed": True,
            }
        )
    print(json.dumps({"cases": results, "passed": True}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
