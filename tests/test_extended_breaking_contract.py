from __future__ import annotations

import unittest

from governdiff import analyze_texts
from governdiff.config import Waiver


CASES = {
    "modality-strengthened": {
        "severity": "high",
        "en": ("Members may submit a disclosure.", "Members must submit a disclosure."),
        "zh": ("成员可以提交说明。", "成员必须提交说明。"),
        "negative": [
            ("Members must submit a disclosure.", "Members may submit a disclosure."),
            ("Members may submit a disclosure.", "Members can submit a disclosure."),
        ],
    },
    "modality-weakened": {
        "severity": "high",
        "en": ("Members must submit a disclosure.", "Members may submit a disclosure."),
        "zh": ("成员必须提交说明。", "成员可以提交说明。"),
        "negative": [
            ("Members may submit a disclosure.", "Members must submit a disclosure."),
            ("Members must submit a disclosure.", "Members shall submit a disclosure."),
        ],
    },
    "permission-removed": {
        "severity": "high",
        "en": ("Members may appeal a decision.", "Members submit a written response to a decision."),
        "zh": ("成员有权提出申诉。", "成员提交书面说明。"),
        "negative": [
            ("Members may appeal a decision.", "Members can appeal a decision."),
            ("Members submit a response.", "Members submit a written response."),
            ("Members may submit a response.", "Members must submit a response."),
        ],
    },
    "prohibition-added": {
        "severity": "high",
        "en": ("Members may disclose records.", "Members must not disclose records."),
        "zh": ("成员可以披露记录。", "成员不得披露记录。"),
        "negative": [
            ("Members must not disclose records.", "Members may disclose records."),
            ("Members must disclose records.", "Members shall disclose records."),
        ],
    },
    "scope-expanded": {
        "severity": "high",
        "en": ("Only employees must file reports.", "All employees must file reports."),
        "zh": ("仅正式员工应当提交报告。", "所有员工应当提交报告。"),
        "negative": [
            ("All employees must file reports.", "Only employees must file reports."),
            ("Employees must file reports.", "Employees shall file reports."),
        ],
    },
    "scope-narrowed": {
        "severity": "medium",
        "en": ("All employees must file reports.", "Only employees must file reports."),
        "zh": ("所有员工应当提交报告。", "仅正式员工应当提交报告。"),
        "negative": [
            ("Only employees must file reports.", "All employees must file reports."),
            ("Employees must file reports.", "Employees shall file reports."),
        ],
    },
    "authority-shifted": {
        "severity": "high",
        "en": ("The Chair must approve exceptions.", "The Board must approve exceptions."),
        "zh": ("委员会应当批准例外。", "主席应当批准例外。"),
        "negative": [
            ("The Chair must approve exceptions.", "The Chair shall approve exceptions."),
            ("The Board may approve exceptions.", "The Board must approve exceptions."),
        ],
    },
    "deadline-shortened": {
        "severity": "high",
        "en": ("The committee must respond within 30 days.", "The committee must respond within 10 days."),
        "zh": ("委员会应当在三十日内答复。", "委员会应当在十日内答复。"),
        "negative": [
            ("Respond within 10 days.", "Respond within 30 days."),
            ("Respond within 10 days.", "Respond within 10 days."),
        ],
    },
    "deadline-extended": {
        "severity": "medium",
        "en": ("The committee must respond within 10 days.", "The committee must respond within 30 days."),
        "zh": ("委员会应当在十日内答复。", "委员会应当在三十日内答复。"),
        "negative": [
            ("Respond within 30 days.", "Respond within 10 days."),
            ("Respond within 30 days.", "Respond within 30 days."),
        ],
    },
    "threshold-changed": {
        "severity": "medium",
        "en": ("Approval requires 5 percent support.", "Approval requires 10 percent support."),
        "zh": ("批准门槛为5%。", "批准门槛为10%。"),
        "negative": [
            ("Approval requires 5 percent support.", "Approval requires 5 percent support."),
            ("The policy takes effect on 5 May 2026.", "The policy takes effect on 10 May 2026."),
        ],
    },
    "exception-added": {
        "severity": "medium",
        "en": ("All members must disclose gifts.", "All members must disclose gifts unless the value is nominal."),
        "zh": ("所有成员应当申报礼品。", "所有成员应当申报礼品，但紧急情况除外。"),
        "negative": [
            ("All members must disclose gifts unless nominal.", "All members must disclose gifts."),
            ("All members must disclose gifts.", "All members shall disclose gifts."),
        ],
    },
    "exception-removed": {
        "severity": "high",
        "en": ("All members must disclose gifts unless the value is nominal.", "All members must disclose gifts."),
        "zh": ("所有成员应当申报礼品，但紧急情况除外。", "所有成员应当申报礼品。"),
        "negative": [
            ("All members must disclose gifts.", "All members must disclose gifts unless nominal."),
            ("All members must disclose gifts.", "All members shall disclose gifts."),
        ],
    },
    "effective-date-shifted": {
        "severity": "high",
        "en": ("This policy takes effect on January 1, 2026.", "This policy takes effect on February 1, 2026."),
        "zh": ("本办法自2026年1月1日起施行。", "本办法自2026年2月1日起施行。"),
        "negative": [
            ("Respond within 10 days.", "Respond within 20 days."),
            ("This policy takes effect on January 1, 2026.", "This policy takes effect on January 1, 2026."),
        ],
    },
    "definition-changed": {
        "severity": "high",
        "en": ("Member means an employee.", "Member means an employee or contractor."),
        "zh": ("成员是指正式员工。", "成员是指正式员工或者承包商。"),
        "negative": [
            ("Member means an employee.", "Member means an employee."),
            ("Member means an employee.", "Contractor means an external supplier."),
        ],
    },
    "reference-retargeted": {
        "severity": "medium",
        "en": ("Act under Article 5 of this policy.", "Act under Article 8 of this policy."),
        "zh": ("依照第五条执行。", "依照第八条执行。"),
        "negative": [
            ("Act under Article 5.", "Act under Article 5."),
            ("Respond within 5 days.", "Respond within 8 days."),
        ],
    },
}


def findings_for(check_id: str, old: str, new: str):
    report = analyze_texts(
        f"# Policy\n\n{old}\n",
        f"# Policy\n\n{new}\n",
        enabled_checks={check_id},
    )
    return [
        finding
        for change in report.changes
        for finding in change.findings
        if finding.check_id == check_id
    ]


class ExtendedBreakingContractTests(unittest.TestCase):
    def test_all_prd_checks_have_bilingual_evidence_contracts(self) -> None:
        self.assertEqual(15, len(CASES))
        for check_id, case in CASES.items():
            for language in ("en", "zh"):
                with self.subTest(check_id=check_id, language=language):
                    matches = findings_for(check_id, *case[language])
                    self.assertTrue(matches)
                    finding = matches[0]
                    self.assertEqual(case["severity"], finding.severity)
                    self.assertTrue(finding.breaking)
                    self.assertTrue(finding.field)
                    self.assertTrue(finding.explanation)
                    self.assertTrue(finding.old_evidence)
                    self.assertTrue(finding.new_evidence)
                    self.assertRegex(finding.fingerprint, r"^GVD-[0-9A-F]{10}$")

    def test_each_prd_check_has_two_directional_negative_examples(self) -> None:
        for check_id, case in CASES.items():
            self.assertGreaterEqual(len(case["negative"]), 2)
            for index, pair in enumerate(case["negative"], start=1):
                with self.subTest(check_id=check_id, negative=index):
                    self.assertEqual([], findings_for(check_id, *pair))

    def test_each_prd_check_can_be_disabled_and_waived_without_deleting_evidence(self) -> None:
        for check_id, case in CASES.items():
            old, new = case["en"]
            with self.subTest(check_id=check_id):
                enabled = analyze_texts(
                    f"# Policy\n\n{old}\n",
                    f"# Policy\n\n{new}\n",
                    enabled_checks={check_id},
                )
                finding = next(
                    finding
                    for change in enabled.changes
                    for finding in change.findings
                    if finding.check_id == check_id
                )
                disabled = analyze_texts(
                    f"# Policy\n\n{old}\n",
                    f"# Policy\n\n{new}\n",
                    enabled_checks=set(),
                )
                self.assertFalse(any(change.findings for change in disabled.changes))
                waived = analyze_texts(
                    f"# Policy\n\n{old}\n",
                    f"# Policy\n\n{new}\n",
                    enabled_checks={check_id},
                    waivers={
                        finding.fingerprint: Waiver(
                            finding.fingerprint,
                            "Accepted for compatibility testing.",
                            "Release reviewer",
                            "2026-08-13",
                            "2027-08-13",
                        )
                    },
                )
                waived_finding = next(
                    item
                    for change in waived.changes
                    for item in change.findings
                    if item.check_id == check_id
                )
                self.assertTrue(waived_finding.waived)
                self.assertFalse(waived_finding.active)
                self.assertTrue(waived_finding.old_evidence)
                self.assertTrue(waived_finding.new_evidence)


if __name__ == "__main__":
    unittest.main()
