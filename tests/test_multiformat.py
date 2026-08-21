from __future__ import annotations

import io
import json
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

from pypdf import PdfWriter

from governdiff import analyze_documents, preflight_document
from governdiff.cli import main as cli_main
from governdiff.document import parse_document
from governdiff.formats import MAX_FILE_BYTES, MAX_PAGES
from governdiff.models import DocumentInputError
from governdiff.report import render_json


ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / "tests" / "format_fixtures"


class MultiFormatInputTests(unittest.TestCase):
    def test_digital_pdf_preserves_pages_and_suppresses_repeated_furniture(self) -> None:
        document = parse_document(FIXTURES / "digital_policy_old.pdf")
        self.assertEqual(document.source_format, "pdf")
        self.assertEqual(document.preflight.page_count, 3)
        self.assertEqual({block.page_start for block in document.blocks}, {1, 2, 3})
        self.assertTrue(all(block.char_start is not None for block in document.blocks))
        text = "\n".join(block.text for block in document.blocks)
        self.assertNotIn("running header", text)
        self.assertNotIn("Page 1 of 3", text)
        toc = [block for block in document.blocks if block.block_type == "toc"]
        self.assertGreaterEqual(len(toc), 3)
        self.assertTrue(all(block.is_noise for block in toc))

    def test_pdf_comparison_detects_normative_and_deadline_changes(self) -> None:
        report = analyze_documents(
            FIXTURES / "digital_policy_old.pdf",
            FIXTURES / "digital_policy_new.pdf",
        )
        checks = {finding.check_id for change in report.changes for finding in change.findings}
        self.assertIn("modality-strengthened", checks)
        self.assertIn("deadline-shortened", checks)
        changed = next(change for change in report.changes if change.change_type == "modified")
        self.assertEqual(changed.new_block.page_start, 3)

    def test_docx_preserves_headings_lists_paragraph_indices_and_tables(self) -> None:
        document = parse_document(FIXTURES / "policy_old.docx")
        self.assertEqual(document.source_format, "docx")
        self.assertEqual(len([block for block in document.blocks if block.block_type == "list_item"]), 2)
        self.assertTrue(all(block.paragraph_start is not None for block in document.blocks))
        self.assertEqual(len(document.tables), 1)
        table = document.tables[0]
        self.assertEqual((table.row_count, table.column_count), (3, 3))
        self.assertEqual(len(table.cells), 9)
        self.assertTrue(table.cells[0].is_header)
        cell_blocks = [block for block in document.blocks if block.block_type == "table_cell"]
        self.assertEqual(len(cell_blocks), 9)
        self.assertTrue(all(block.table_id and block.table_row is not None for block in cell_blocks))
        text = "\n".join(block.text for block in document.blocks)
        self.assertNotIn("running header", text)
        self.assertNotIn("Page 1", text)

    def test_docx_table_cells_participate_in_comparison(self) -> None:
        report = analyze_documents(FIXTURES / "policy_old.docx", FIXTURES / "policy_new.docx")
        table_changes = [
            change for change in report.changes
            if (change.new_block or change.old_block).block_type == "table_cell"
            and change.change_type != "unchanged"
        ]
        self.assertEqual(len(table_changes), 1)
        self.assertEqual(table_changes[0].new_block.table_row, 1)
        self.assertEqual(table_changes[0].new_block.table_column, 2)
        self.assertIn("deadline-shortened", {item.check_id for item in table_changes[0].findings})

    def test_html_restores_structure_and_removes_site_noise(self) -> None:
        document = parse_document(FIXTURES / "policy_old.html")
        self.assertEqual(document.source_format, "html")
        self.assertEqual(len(document.tables), 1)
        self.assertEqual(len([block for block in document.blocks if block.block_type == "list_item"]), 2)
        text = "\n".join(block.text for block in document.blocks)
        for noise in ("Site masthead", "Home", "window.noise", "Footer navigation"):
            self.assertNotIn(noise, text)
        self.assertTrue(any(block.is_noise and block.block_type == "toc" for block in document.blocks))
        body = next(block for block in document.blocks if block.text.startswith("This policy"))
        self.assertEqual(body.section[-1], "1. Scope")

    def test_html_recovers_article_nested_under_malformed_header(self) -> None:
        # Some government CMS pages leave <header> open around the article.
        # The parser must select the inner content container before dropping
        # header/navigation noise.
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "government-policy.html"
            path.write_text(
                "<html><body><header>Navigation"
                "<div class='my_doccontent'><h1>Policy</h1>"
                "<p><span>Article 1 Members must file a report.</span></p>"
                "<p><span>Article 2 Reports remain confidential.</span></p>"
                "</div></body></html>",
                encoding="utf-8",
            )
            document = parse_document(path)
        text = "\n".join(block.text for block in document.blocks)
        self.assertNotIn("Navigation", text)
        self.assertIn("Article 1 Members must file a report.", text)
        self.assertIn("Article 2 Reports remain confidential.", text)

    def test_toc_change_is_a_non_breaking_information_finding(self) -> None:
        report = analyze_documents(FIXTURES / "toc_noise_old.html", FIXTURES / "toc_noise_new.html")
        findings = [finding for change in report.changes for finding in change.findings]
        self.assertEqual({finding.check_id for finding in findings}, {"document-noise-changed"})
        self.assertTrue(all(finding.severity == "info" and not finding.breaking for finding in findings))

    def test_json_exposes_preflight_tables_and_cell_evidence(self) -> None:
        report = analyze_documents(FIXTURES / "policy_old.html", FIXTURES / "policy_new.html")
        data = json.loads(render_json(report))
        self.assertEqual(data["old_document"]["format"], "html")
        self.assertEqual(data["old_document"]["preflight"]["status"], "ok")
        self.assertEqual(data["old_document"]["tables"][0]["row_count"], 3)
        table_change = next(
            change for change in data["changes"]
            if change["new_block"] and change["new_block"]["block_type"] == "table_cell"
            and change["change_type"] != "unchanged"
        )
        self.assertIn("TBL-0001", table_change["new_block"]["evidence_label"])


class PreflightAcceptanceTests(unittest.TestCase):
    def test_actionable_error_classes(self) -> None:
        expectations = {
            "scanned_like.pdf": "suspected-scanned-pdf",
            "encrypted.pdf": "encrypted-pdf",
            "corrupt.pdf": "invalid-pdf",
            "corrupt.docx": "invalid-docx",
            "empty.txt": "empty-file",
            "garbled.txt": "garbled-text",
        }
        for filename, code in expectations.items():
            with self.subTest(filename=filename):
                result = preflight_document(FIXTURES / filename)
                self.assertEqual(result.status, "error")
                issue = next(item for item in result.issues if item.code == code)
                self.assertTrue(issue.reason)
                self.assertTrue(issue.impact)
                self.assertTrue(issue.next_step)
                with self.assertRaises(DocumentInputError) as raised:
                    parse_document(FIXTURES / filename)
                message = str(raised.exception)
                self.assertIn("Impact:", message)
                self.assertIn("Next step:", message)

    def test_scanned_pdf_does_not_invoke_ocr(self) -> None:
        result = preflight_document(FIXTURES / "scanned_like.pdf")
        self.assertTrue(result.suspected_scanned)
        issue = next(item for item in result.issues if item.code == "suspected-scanned-pdf")
        self.assertIn("OCR is not enabled", issue.impact)
        self.assertIn("outside GovernDiff", issue.next_step)

    def test_low_pdf_text_coverage_is_warning_with_blank_pages(self) -> None:
        result = preflight_document(FIXTURES / "mixed_text_coverage.pdf")
        self.assertEqual(result.status, "warning")
        self.assertLess(result.text_coverage, 0.60)
        self.assertEqual(result.blank_pages, [2, 3])
        self.assertIn("low-text-coverage", {item.code for item in result.issues})

    def test_25_mb_limit_is_enforced_before_text_loading(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "oversize.txt"
            with path.open("wb") as handle:
                handle.seek(MAX_FILE_BYTES)
                handle.write(b"x")
            result = preflight_document(path)
            self.assertEqual(result.status, "error")
            self.assertIn("file-too-large", {item.code for item in result.issues})

    def test_unsupported_format_has_conversion_guidance(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "policy.rtf"
            path.write_text("{\\rtf1 policy}", encoding="utf-8")
            result = preflight_document(path)
            issue = next(item for item in result.issues if item.code == "unsupported-format")
            self.assertIn("Convert", issue.next_step)

    def test_300_page_limit_is_enforced(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "too_many_pages.pdf"
            writer = PdfWriter()
            for _ in range(MAX_PAGES + 1):
                writer.add_blank_page(width=72, height=72)
            with path.open("wb") as handle:
                writer.write(handle)
            result = preflight_document(path)
            self.assertEqual(result.page_count, MAX_PAGES + 1)
            self.assertIn("too-many-pages", {item.code for item in result.issues})

    def test_preflight_cli_outputs_machine_readable_status(self) -> None:
        output = io.StringIO()
        with redirect_stdout(output):
            code = cli_main([
                "preflight",
                str(FIXTURES / "policy_old.docx"),
                "--format",
                "json",
            ])
        self.assertEqual(code, 0)
        data = json.loads(output.getvalue())
        self.assertEqual(data["source_format"], "docx")
        self.assertEqual(data["status"], "ok")


if __name__ == "__main__":
    unittest.main()
