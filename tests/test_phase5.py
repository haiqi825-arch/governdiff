from __future__ import annotations

import csv
import json
import re
import tempfile
import unittest
from io import StringIO
from pathlib import Path

from governdiff import analyze_texts
from governdiff.cli import main
from governdiff.config import load_config, load_waivers
from governdiff.report import (
    REDACTED_EVIDENCE_LIMIT,
    ReportSelection,
    render_csv,
    render_html,
    render_json,
    render_markdown,
)
from scripts.validate_schemas import validate_published_artifacts


OLD = """# Rules

Members may submit a request within 30 days.

Contractors may inspect the register.
"""
NEW = """# Rules

Members must submit a request within 10 days.

Contractors must not inspect the register.
"""


def finding_ids_json(value: str) -> set[str]:
    data = json.loads(value)
    return {
        finding["fingerprint"]
        for change in data["changes"]
        for finding in change["findings"]
    }


def finding_ids_csv(value: str) -> set[str]:
    return {
        row["finding_fingerprint"]
        for row in csv.DictReader(StringIO(value))
    }


def finding_ids_html(value: str) -> set[str]:
    return set(re.findall(r'data-finding-fingerprint="([A-Z0-9-]+)"', value))


def finding_ids_markdown(value: str) -> set[str]:
    return set(re.findall(r"^### `([A-Z0-9-]+)`", value, flags=re.MULTILINE))


class PhaseFiveReportContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.report = analyze_texts(OLD, NEW)
        findings = [
            finding
            for change in self.report.changes
            for finding in change.findings
        ]
        self.assertGreaterEqual(len(findings), 3)
        findings[0].review_state = "confirmed"
        self.report.changes[0].review_state = "confirmed"

    def assert_four_formats_agree(self, selection: ReportSelection) -> set[str]:
        values = {
            "json": finding_ids_json(render_json(self.report, selection=selection)),
            "markdown": finding_ids_markdown(
                render_markdown(self.report, selection=selection)
            ),
            "html": finding_ids_html(render_html(self.report, selection=selection)),
            "csv": finding_ids_csv(render_csv(self.report, selection=selection)),
        }
        baseline = values["json"]
        self.assertTrue(all(value == baseline for value in values.values()), values)
        data = json.loads(render_json(self.report, selection=selection))
        self.assertEqual(data["summary"]["findings"], len(baseline))
        self.assertEqual(len(list(csv.DictReader(StringIO(
            render_csv(self.report, selection=selection)
        )))), len(baseline))
        return baseline

    def test_all_public_scopes_share_one_selection_result(self) -> None:
        all_ids = self.assert_four_formats_agree(ReportSelection(scope="all"))
        breaking_ids = self.assert_four_formats_agree(
            ReportSelection(scope="breaking")
        )
        confirmed_ids = self.assert_four_formats_agree(
            ReportSelection(scope="confirmed")
        )
        unreviewed_ids = self.assert_four_formats_agree(
            ReportSelection(scope="unreviewed")
        )
        check_id = next(
            finding.check_id
            for change in self.report.changes
            for finding in change.findings
        )
        filtered_ids = self.assert_four_formats_agree(
            ReportSelection(scope="filtered", checks=(check_id,))
        )
        self.assertTrue(breaking_ids.issubset(all_ids))
        self.assertTrue(confirmed_ids)
        self.assertTrue(unreviewed_ids)
        self.assertTrue(filtered_ids)
        self.assertTrue(confirmed_ids.isdisjoint(unreviewed_ids))

    def test_html_is_self_contained_and_has_overview_cards_and_evidence(self) -> None:
        value = render_html(self.report)
        lowered = value.casefold()
        self.assertTrue(lowered.startswith("<!doctype html>"))
        self.assertNotIn("http://", lowered)
        self.assertNotIn("https://", lowered)
        self.assertNotIn("<script", lowered)
        self.assertIn("Overview", value)
        self.assertIn("Changes and evidence", value)
        self.assertIn("Before", value)
        self.assertIn("After", value)
        self.assertIn(self.report.old_document.sha256, value)
        self.assertIn("does not constitute legal advice", value)

    def test_redacted_outputs_remove_full_blocks_tables_and_long_evidence(self) -> None:
        secret = "PRIVATE-CELL-" + "sensitive evidence " * 30
        report = analyze_texts(
            f"# Confidential\n\nMembers may disclose {secret}.\n",
            f"# Confidential\n\nMembers must disclose {secret}.\n",
        )
        raw = render_json(report, redacted=True)
        data = json.loads(raw)
        self.assertTrue(data["redacted"])
        self.assertNotIn(secret, raw)
        self.assertNotIn("tables", data["old_document"])
        for change in data["changes"]:
            if change["old_block"]:
                self.assertNotIn("text", change["old_block"])
            self.assertEqual(change["word_diff"], [])
            for finding in change["findings"]:
                for key in ("old_evidence", "new_evidence"):
                    if finding[key]:
                        self.assertLessEqual(len(finding[key]), REDACTED_EVIDENCE_LIMIT)

    def test_cli_writes_html_csv_and_filtered_scope(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            old_path = root / "old.md"
            new_path = root / "new.md"
            html_path = root / "report.html"
            csv_path = root / "report.csv"
            old_path.write_text(OLD, encoding="utf-8")
            new_path.write_text(NEW, encoding="utf-8")
            self.assertEqual(main([
                "breaking", str(old_path), str(new_path), "--format", "html",
                "--output", str(html_path),
            ]), 0)
            self.assertEqual(main([
                "diff", str(old_path), str(new_path), "--format", "csv",
                "--scope", "filtered", "--filter-check", "deadline-shortened",
                "--output", str(csv_path),
            ]), 0)
            self.assertIn("<!doctype html>", html_path.read_text(encoding="utf-8"))
            rows = list(csv.DictReader(StringIO(csv_path.read_text(encoding="utf-8"))))
            self.assertTrue(rows)
            self.assertEqual({row["check_id"] for row in rows}, {"deadline-shortened"})

    def test_disclaimer_version_time_and_hashes_exist_in_every_format(self) -> None:
        rendered = (
            render_json(self.report),
            render_markdown(self.report),
            render_html(self.report),
            render_csv(self.report),
        )
        for value in rendered:
            self.assertIn("governdiff/0.6.0", value)
            self.assertIn(self.report.generated_at, value)
            self.assertIn(self.report.old_document.sha256, value)
            self.assertIn(self.report.new_document.sha256, value)
            self.assertIn("does not constitute legal advice", value)

    def test_published_schemas_validate_examples_and_live_output(self) -> None:
        validated = validate_published_artifacts()
        self.assertEqual(len(validated), 5)

    def test_report_config_can_fix_scope_filters_and_redaction(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".governdiff.yml"
            path.write_text(
                "version: 1\nreport:\n  scope: filtered\n  redacted: true\n"
                "  checks:\n    - deadline-shortened\n"
                "  review_states:\n    - unreviewed\n",
                encoding="utf-8",
            )
            config = load_config(path)
            self.assertEqual(config.report_scope, "filtered")
            self.assertTrue(config.report_redacted)
            self.assertEqual(config.report_checks, ("deadline-shortened",))
            self.assertEqual(config.report_review_states, ("unreviewed",))

    def test_complete_waiver_metadata_and_expiry_diagnostic(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "waivers.json"
            path.write_text(json.dumps({
                "schema_version": "governdiff-waiver/1.0",
                "waivers": [
                    {
                        "fingerprint": "GVD-EXPIRED01",
                        "reason": "old decision",
                        "approved_by": "board",
                        "created_at": "1999-01-01",
                        "expires_at": "2000-01-01",
                    },
                    {
                        "fingerprint": "GVD-LIVE01",
                        "reason": "current decision",
                        "approved_by": "board",
                        "created_at": "2026-08-11",
                        "expires_at": "2999-01-01",
                    },
                ],
            }), encoding="utf-8")
            waivers = load_waivers(path)
            self.assertNotIn("GVD-EXPIRED01", waivers)
            self.assertIn("GVD-LIVE01", waivers)
            self.assertEqual(waivers["GVD-LIVE01"].approver, "board")
            self.assertEqual(waivers.diagnostics[0]["code"], "waiver-expired")
            report = analyze_texts(OLD, NEW, waivers=waivers)
            self.assertIn("expired", render_json(report))

    def test_waiver_requires_approver_creation_and_expiry(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "waivers.json"
            path.write_text(json.dumps({
                "schema_version": "governdiff-waiver/1.0",
                "waivers": [{"fingerprint": "GVD-BAD01", "reason": "missing metadata"}],
            }), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "approved_by"):
                load_waivers(path)


if __name__ == "__main__":
    unittest.main()
