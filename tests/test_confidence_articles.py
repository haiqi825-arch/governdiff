from __future__ import annotations

import unittest

from governdiff import analyze_texts
from governdiff.articles import article_ref, chinese_number


class ArticleRemappingTests(unittest.TestCase):
    def test_chinese_number_parser_handles_policy_article_numbers(self) -> None:
        self.assertEqual(chinese_number("十一"), 11)
        self.assertEqual(chinese_number("一百二十"), 120)
        self.assertEqual(chinese_number("一千零二"), 1002)
        self.assertEqual(chinese_number("二〇二"), 202)

    def test_article_ref_supports_chinese_and_english_markers(self) -> None:
        self.assertEqual(article_ref(("第一章", "第二十三条")).key, "article:23")
        self.assertEqual(article_ref(("Part II", "Article 7A Scope")).key, "article:7a")

    def test_inserted_article_remaps_following_article_number(self) -> None:
        old = (
            "# 第一章 总则\n\n"
            "第一条 机构应当保存年度记录。\n\n"
            "第二条 申请人可以在十日内提出申诉。\n"
        )
        new = (
            "# 第一章 总则\n\n"
            "第一条 机构应当保存年度记录。\n\n"
            "第二条 机构应当公开联系人信息。\n\n"
            "第三条 申请人必须在五日内提出申诉。\n"
        )
        report = analyze_texts(old, new, language="zh")
        mapping = next(
            item
            for item in report.article_mappings
            if item.old_key == "article:2" and item.new_key == "article:3"
        )
        self.assertGreaterEqual(mapping.confidence_score, 0.80)
        changed = next(
            change
            for change in report.changes
            if change.old_article == "第二条" and change.new_article == "第三条"
        )
        self.assertIsNotNone(changed.article_mapping)
        self.assertIn(changed.confidence_level, {"high", "medium"})
        self.assertTrue(all(item.confidence_reasons for item in changed.findings))
        remap_finding = next(item for item in changed.findings if item.check_id == "article-remapped")
        self.assertFalse(remap_finding.breaking)
        self.assertEqual(remap_finding.confidence_score, mapping.confidence_score)

    def test_report_exposes_confidence_distributions(self) -> None:
        report = analyze_texts(
            "# Rule\n\nMembers may respond within 10 days.\n",
            "# Rule\n\nMembers must respond within 5 days.\n",
        )
        summary = report.to_dict()["summary"]
        self.assertIn("confidence", summary)
        self.assertGreaterEqual(summary["high_confidence_breaking_findings"], 1)
        finding = report.changes[0].findings[0]
        self.assertGreater(finding.confidence_score, 0.0)
        self.assertIn(finding.confidence_level, {"high", "medium", "low"})


if __name__ == "__main__":
    unittest.main()
