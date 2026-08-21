from __future__ import annotations

import unittest

from governdiff.alignment import align_documents, classify_alignment
from governdiff.document import parse_text


class DocumentAlignmentTests(unittest.TestCase):
    def test_front_matter_and_reference_links_are_not_policy_blocks(self) -> None:
        document = parse_text(
            "+++\nversion = \"1\"\n+++\n# Policy\n\nReal clause.\n\n[ref]: https://example.com\n"
        )
        self.assertEqual([block.text for block in document.blocks], ["Real clause."])
        self.assertEqual(document.blocks[0].line_start, 6)

    def test_reordered_clauses_are_moved_not_added_and_removed(self) -> None:
        old = parse_text("# Rules\n\nAlpha rule.\n\nBeta rule.\n")
        new = parse_text("# Rules\n\nBeta rule.\n\nAlpha rule.\n")
        kinds = [classify_alignment(left, right) for left, right, _ in align_documents(old, new)]
        self.assertEqual(kinds.count("moved"), 2)
        self.assertNotIn("added", kinds)
        self.assertNotIn("removed", kinds)

    def test_punctuation_only_change_is_format_only(self) -> None:
        old = parse_text("# Rule\n\nMembers must report incidents.\n")
        new = parse_text("# Rule\n\nMembers must report incidents!\n")
        alignment = align_documents(old, new)
        self.assertEqual(classify_alignment(*alignment[0][:2]), "format_only")

    def test_inline_chinese_articles_are_policy_blocks(self) -> None:
        document = parse_text(
            "第一章 总则\n\n"
            "第一条 为了规范组织行为，制定本办法。\n\n"
            "第二条 组织应当公开年度报告。\n",
            language="zh",
        )
        self.assertEqual(len(document.blocks), 2)
        self.assertEqual(document.blocks[0].text, "第一条 为了规范组织行为，制定本办法。")
        self.assertEqual(document.blocks[0].section[-1], "第一条")
        self.assertEqual(document.blocks[1].section[-1], "第二条")

    def test_chinese_article_marker_on_its_own_labels_following_text(self) -> None:
        document = parse_text(
            "第一章 总则\n\n第一条\n\n组织应当保存记录。\n",
            language="zh",
        )
        self.assertEqual([block.text for block in document.blocks], ["组织应当保存记录。"])
        self.assertEqual(document.blocks[0].section[-1], "第一条")


if __name__ == "__main__":
    unittest.main()
