from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from governdiff import analyze_documents, analyze_texts, apply_review
from governdiff.cli import main
from governdiff.config import load_waivers
from governdiff.report import render_json


OLD = "# Rules\n\nMembers may submit within 30 days.\n"
NEW = "# Rules\n\nMembers must submit within 10 days.\n"


def review_payload(report, state="modified"):
    change = report.changes[0]
    finding = next(item for item in change.findings if item.field == "deadline")
    return {
        "schema_version": "governdiff-review/1.1",
        "report": {
            "old_sha256": report.old_document.sha256,
            "new_sha256": report.new_document.sha256,
            "generated_at": report.generated_at,
        },
        "exported_at": "2026-08-09T08:15:00+00:00",
        "decisions": [{
            "change_fingerprint": change.fingerprint,
            "state": state,
            "note": "Reviewed against the signed policy.",
            "updated_at": "2026-08-09T08:14:00+00:00",
        }],
        "field_edits": [{
            "change_fingerprint": change.fingerprint,
            "finding_fingerprint": finding.fingerprint,
            "field": finding.field,
            "machine_old_value": finding.old_value,
            "machine_new_value": finding.new_value,
            "reviewed_old_value": "30 calendar days",
            "reviewed_new_value": "10 business days",
            "updated_at": "2026-08-09T08:14:00+00:00",
        }],
        "alignment_overrides": [],
    }


class PhaseFourReviewLoopTests(unittest.TestCase):
    def test_review_schema_and_example_publish_the_five_state_contract(self) -> None:
        root = Path(__file__).resolve().parents[1]
        schema = json.loads((root / "schema" / "review.schema.json").read_text(encoding="utf-8"))
        example = json.loads((root / "schema" / "examples" / "review.example.json").read_text(encoding="utf-8"))
        self.assertEqual(schema["properties"]["schema_version"]["const"], "governdiff-review/1.1")
        self.assertEqual(
            schema["$defs"]["reviewState"]["enum"],
            ["unreviewed", "confirmed", "rejected", "modified", "waived"],
        )
        self.assertEqual(example["schema_version"], "governdiff-review/1.1")

    def test_public_report_exposes_all_review_states_and_machine_values(self) -> None:
        report = analyze_texts(OLD, NEW)
        data = json.loads(render_json(report))
        self.assertEqual(data["schema_version"], "1.5")
        self.assertEqual(
            set(data["summary"]["review_states"]),
            {"unreviewed", "confirmed", "rejected", "modified", "waived"},
        )
        finding = next(item for item in data["changes"][0]["findings"] if item["field"] == "deadline")
        self.assertEqual(finding["machine_values"], {"old": "30 days", "new": "10 days"})
        self.assertEqual(finding["effective_values"], finding["machine_values"])

    def test_review_import_changes_state_and_effective_field_without_losing_machine_value(self) -> None:
        report = analyze_texts(OLD, NEW)
        payload = review_payload(report)
        apply_review(report, payload)
        deadline = next(item for item in report.changes[0].findings if item.field == "deadline")
        self.assertEqual(report.changes[0].review_state, "modified")
        self.assertEqual(deadline.old_value, "30 days")
        self.assertEqual(deadline.new_value, "10 days")
        self.assertEqual(deadline.effective_old_value, "30 calendar days")
        self.assertEqual(deadline.effective_new_value, "10 business days")
        self.assertTrue(deadline.field_modified)
        self.assertEqual(report.review_import["field_edits_applied"], 1)

    def test_rejected_review_is_removed_from_active_findings(self) -> None:
        report = analyze_texts(OLD, NEW)
        payload = review_payload(report, state="rejected")
        before = report.summary()["active_findings"]
        apply_review(report, payload)
        self.assertGreater(before, 0)
        self.assertEqual(report.summary()["active_findings"], 0)
        self.assertEqual(report.changes[0].review_state, "rejected")
        self.assertTrue(next(item for item in report.changes[0].findings if item.field == "deadline").field_modified)

    def test_legacy_reviewer_states_are_migrated(self) -> None:
        report = analyze_texts(OLD, NEW)
        payload = review_payload(report)
        payload["schema_version"] = "governdiff-review/1.0"
        payload["field_edits"] = []
        payload["decisions"] = {
            report.changes[0].fingerprint: {
                "state": "accepted",
                "note": "legacy",
                "updatedAt": "2026-08-09T08:14:00+00:00",
            }
        }
        apply_review(report, payload)
        self.assertEqual(report.changes[0].review_state, "confirmed")

    def test_cli_review_round_trip_affects_json_report(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            old_path, new_path = root / "old.md", root / "new.md"
            review_path, output_path = root / "review.json", root / "report.json"
            old_path.write_text(OLD, encoding="utf-8")
            new_path.write_text(NEW, encoding="utf-8")
            report = analyze_documents(old_path, new_path)
            review_path.write_text(json.dumps(review_payload(report)), encoding="utf-8")
            code = main([
                "diff", str(old_path), str(new_path), "--format", "json",
                "--review", str(review_path), "--output", str(output_path),
            ])
            self.assertEqual(code, 0)
            data = json.loads(output_path.read_text(encoding="utf-8"))
            self.assertEqual(data["changes"][0]["review"]["state"], "modified")
            self.assertEqual(data["review_import"]["field_edits_applied"], 1)

    def test_manual_unlink_is_recomputed_and_audited(self) -> None:
        report = analyze_texts(OLD, NEW)
        change = report.changes[0]
        payload = review_payload(report, state="confirmed")
        payload["field_edits"] = []
        payload["alignment_overrides"] = [{
            "action": "unlink",
            "original_change_fingerprint": change.fingerprint,
            "old_block_ids": [change.old_block.block_id],
            "new_block_ids": [change.new_block.block_id],
            "updated_at": "2026-08-09T08:14:00+00:00",
        }]
        apply_review(report, payload)
        self.assertNotIn(change.fingerprint, [item.fingerprint for item in report.changes])
        self.assertEqual({item.change_type for item in report.changes}, {"added", "removed"})
        self.assertTrue(all(item.alignment_status == "human-corrected" for item in report.changes))
        self.assertEqual(report.review_import["alignment_overrides_applied"], 1)

    def test_expired_waiver_is_ignored_and_current_metadata_is_retained(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".governdiff-waivers.yml"
            path.write_text(
                "version: 1\nwaivers:\n"
                "  - fingerprint: GVD-OLD\n    reason: old\n    approver: board\n    created_at: 1999-01-01\n    expires_at: 2000-01-01\n"
                "  - fingerprint: GVD-LIVE\n    reason: approved\n    approver: board\n    created_at: 2026-08-09\n    expires_at: 2999-01-01\n",
                encoding="utf-8",
            )
            waivers = load_waivers(path)
            self.assertNotIn("GVD-OLD", waivers)
            self.assertEqual(waivers["GVD-LIVE"].approver, "board")
            self.assertEqual(waivers["GVD-LIVE"].expires_at, "2999-01-01")


if __name__ == "__main__":
    unittest.main()
