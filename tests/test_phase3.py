from __future__ import annotations

import unittest

from governdiff import analyze_texts
from governdiff.worddiff import word_diff


class SplitMergeAndWordDiffTests(unittest.TestCase):
    def test_one_old_clause_can_split_into_two_new_clauses(self) -> None:
        report = analyze_texts(
            "# Rules\n\nMembers must submit annual reports within 30 days. They must notify the Secretariat.\n",
            "# Rules\n\nMembers must submit annual reports within 30 days.\n\nThey must notify the Secretariat.\n",
        )
        change = next(item for item in report.changes if item.change_type == "split")
        self.assertEqual(len(change.old_blocks), 1)
        self.assertEqual(len(change.new_blocks), 2)
        self.assertGreaterEqual(change.similarity, 0.90)
        data = change.to_dict()
        self.assertEqual(len(data["old_blocks"]), 1)
        self.assertEqual(len(data["new_blocks"]), 2)

    def test_two_old_clauses_can_merge_into_one_new_clause(self) -> None:
        report = analyze_texts(
            "# Rules\n\nMembers must submit annual reports within 30 days.\n\nThey must notify the Secretariat.\n",
            "# Rules\n\nMembers must submit annual reports within 30 days. They must notify the Secretariat.\n",
        )
        change = next(item for item in report.changes if item.change_type == "merged")
        self.assertEqual(len(change.old_blocks), 2)
        self.assertEqual(len(change.new_blocks), 1)

    def test_word_diff_exposes_equal_and_replace_spans(self) -> None:
        report = analyze_texts(
            "# Rule\n\nMembers may submit a response within 20 days.\n",
            "# Rule\n\nMembers must submit a response within 10 days.\n",
        )
        change = next(item for item in report.changes if item.change_type == "modified")
        operations = {item.operation for item in change.word_diff}
        self.assertIn("equal", operations)
        self.assertIn("replace", operations)
        replaced = [(item.old_text, item.new_text) for item in change.word_diff if item.operation == "replace"]
        self.assertIn(("may", "must"), replaced)
        self.assertIn(("20", "10"), replaced)
        insert_delete = word_diff(
            "Members must submit paper reports.",
            "Members must promptly submit reports.",
        )
        self.assertIn("insert", {item.operation for item in insert_delete})
        self.assertIn("delete", {item.operation for item in insert_delete})


class MappingConflictTests(unittest.TestCase):
    def test_competing_article_targets_are_retained_as_ambiguous(self) -> None:
        report = analyze_texts(
            "# Policy\n\n## Article 1\n\nAlpha governance clause remains unchanged.\n\nBeta governance clause remains unchanged.\n",
            "# Policy\n\n## Article 2\n\nAlpha governance clause remains unchanged.\n\n## Article 3\n\nBeta governance clause remains unchanged.\n",
        )
        mapping = next(item for item in report.article_mappings if item.old_key == "article:1")
        self.assertEqual(mapping.status, "ambiguous")
        self.assertEqual(len(mapping.candidates), 2)
        self.assertAlmostEqual(mapping.candidates[0].competition_score, 0.5)
        self.assertFalse(any(candidate.selected for candidate in mapping.candidates))
        self.assertEqual(report.summary()["article_mapping_conflicts"], 1)


class StructuredRuleAndSectionTests(unittest.TestCase):
    def test_english_and_chinese_cross_reference_changes(self) -> None:
        english = analyze_texts(
            "# Rule\n\nThe committee must act pursuant to Article 5.\n",
            "# Rule\n\nThe committee must act pursuant to Article 6.\n",
        )
        chinese = analyze_texts(
            "# 规则\n\n委员会应当依照第五条作出决定。\n",
            "# 规则\n\n委员会应当依照第六条作出决定。\n",
            language="zh",
        )
        for report in (english, chinese):
            checks = {finding.check_id for change in report.changes for finding in change.findings}
            self.assertIn("reference-retargeted", checks)

    def test_effective_date_is_structured_separately_from_deadline(self) -> None:
        report = analyze_texts(
            "# Dates\n\nThis policy takes effect on 2026-01-01.\n",
            "# Dates\n\nThis policy takes effect on 2026-02-01.\n",
        )
        change = next(item for item in report.changes if item.change_type == "modified")
        self.assertEqual(len(change.temporal_changes), 1)
        temporal = change.temporal_changes[0]
        self.assertEqual(temporal.kind, "effective_date")
        self.assertEqual(temporal.old_normalized, "2026-01-01")
        self.assertEqual(temporal.new_normalized, "2026-02-01")
        checks = {finding.check_id for finding in change.findings}
        self.assertIn("effective-date-shifted", checks)
        self.assertNotIn("deadline-shortened", checks)
        self.assertNotIn("deadline-extended", checks)
        chinese = analyze_texts(
            "# 生效日期\n\n本办法自2026年1月1日起施行。\n",
            "# 生效日期\n\n本办法自2026年2月1日起施行。\n",
            language="zh",
        )
        chinese_change = next(item for item in chinese.changes if item.change_type == "modified")
        self.assertEqual(chinese_change.temporal_changes[0].kind, "effective_date")
        self.assertEqual(chinese_change.temporal_changes[0].new_normalized, "2026-02-01")

    def test_relative_duration_remains_a_deadline(self) -> None:
        report = analyze_texts(
            "# Dates\n\nThe agency must respond within 30 days after receipt.\n",
            "# Dates\n\nThe agency must respond within 10 days after receipt.\n",
        )
        change = next(item for item in report.changes if item.change_type == "modified")
        self.assertEqual(change.temporal_changes[0].kind, "deadline")
        self.assertEqual(change.temporal_changes[0].direction, "shortened")

    def test_report_contains_nested_section_tree_and_counts(self) -> None:
        report = analyze_texts(
            "# Governance\n\n## Appeals\n\nMembers may appeal.\n",
            "# Governance\n\n## Appeals\n\nMembers must appeal within 10 days.\n",
        )
        data = report.to_dict()
        self.assertEqual(data["schema_version"], "1.5")
        root = data["section_tree"][0]
        self.assertEqual(root["title"], "Governance")
        self.assertEqual(root["change_count"], 1)
        self.assertEqual(root["children"][0]["title"], "Appeals")
        self.assertEqual(root["children"][0]["change_count"], 1)
        self.assertTrue(data["changes"][0]["old_blocks"])


if __name__ == "__main__":
    unittest.main()
