from __future__ import annotations

import unittest
import json

from governdiff import analyze_texts
from governdiff.report import render_json


def check_ids(old: str, new: str) -> set[str]:
    report = analyze_texts(f"# Policy\n\n{old}\n", f"# Policy\n\n{new}\n")
    return {finding.check_id for change in report.changes for finding in change.findings}


class BreakingCheckTests(unittest.TestCase):
    def test_modality_strengthening(self) -> None:
        self.assertIn("modality-strengthened", check_ids(
            "Members may submit a disclosure.",
            "Members must submit a disclosure.",
        ))

    def test_deadline_shortening(self) -> None:
        self.assertIn("deadline-shortened", check_ids(
            "The committee must respond within 30 days.",
            "The committee must respond within 10 days.",
        ))

    def test_effective_dates_are_not_deadlines(self) -> None:
        ids = check_ids(
            "本办法自2010年10月1日起施行。",
            "本办法自2024年5月1日起施行。",
        )
        self.assertNotIn("deadline-shortened", ids)
        self.assertNotIn("deadline-extended", ids)

    def test_exception_added(self) -> None:
        self.assertIn("exception-added", check_ids(
            "All members must disclose gifts.",
            "All members must disclose gifts unless the value is nominal.",
        ))

    def test_authority_shift(self) -> None:
        self.assertIn("authority-shifted", check_ids(
            "The Chair must approve exceptions.",
            "The Board must approve exceptions.",
        ))

    def test_chinese_modality_strengthening(self) -> None:
        self.assertIn("modality-strengthened", check_ids(
            "成员可以在七日内提交说明。",
            "成员必须在七日内提交说明。",
        ))

    def test_breaking_json_summary_matches_filtered_findings(self) -> None:
        report = analyze_texts(
            "# Policy\n\nMembers may report incidents.\n\nEditorial note.\n",
            "# Policy\n\nMembers must report incidents.\n\nEditorial note updated.\n",
        )
        data = json.loads(render_json(report, lambda finding: finding.breaking and not finding.waived))
        displayed = [finding for change in data["changes"] for finding in change["findings"]]
        self.assertEqual(data["summary"]["findings"], len(displayed))
        self.assertTrue(all(finding["breaking"] for finding in displayed))


if __name__ == "__main__":
    unittest.main()
