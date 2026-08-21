from __future__ import annotations

import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from pypdf import PdfWriter
from pypdf.generic import ArrayObject, DictionaryObject, NameObject

from governdiff import preflight_document
from governdiff.document import parse_document
from governdiff.formats import MAX_FILE_BYTES, MAX_PAGES
from governdiff.models import DocumentInputError
import governdiff.formats as formats


ROOT = Path(__file__).resolve().parents[1]


def _sparse_file(path: Path, size: int) -> None:
    with path.open("wb") as handle:
        if size:
            handle.seek(size - 1)
            handle.write(b"x")


def _minimal_docx(path: Path, document_xml: str, extras: dict[str, bytes] | None = None) -> None:
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", b"<Types/>")
        archive.writestr("word/document.xml", document_xml.encode("utf-8"))
        for name, value in (extras or {}).items():
            archive.writestr(name, value)


class FileAndPageBoundaryAcceptanceTests(unittest.TestCase):
    def test_299_300_and_301_page_boundaries(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            for pages in (MAX_PAGES - 1, MAX_PAGES, MAX_PAGES + 1):
                with self.subTest(pages=pages):
                    path = Path(directory) / f"pages-{pages}.pdf"
                    writer = PdfWriter()
                    for _ in range(pages):
                        writer.add_blank_page(width=72, height=72)
                    with path.open("wb") as handle:
                        writer.write(handle)
                    result = preflight_document(path)
                    codes = {item.code for item in result.issues}
                    self.assertEqual(result.page_count, pages)
                    self.assertEqual("too-many-pages" in codes, pages > MAX_PAGES)

    def test_24_9_25_0_and_25_1_mb_boundaries(self) -> None:
        sizes = {
            "24.9": MAX_FILE_BYTES - 1024,
            "25.0": MAX_FILE_BYTES,
            "25.1": MAX_FILE_BYTES + 1024,
        }
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            for label, size in sizes.items():
                with self.subTest(size=label):
                    # Unsupported suffix keeps the test focused on the common
                    # size gate without decoding a 25 MB sparse text buffer.
                    path = Path(directory) / f"size-{label}.rtf"
                    _sparse_file(path, size)
                    codes = {item.code for item in preflight_document(path).issues}
                    self.assertEqual("file-too-large" in codes, size > MAX_FILE_BYTES)

    def test_missing_directory_empty_and_unsupported_inputs_are_actionable(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            root = Path(directory)
            inputs = {
                root / "missing.md": "file-not-found",
                root: "not-a-file",
                root / "empty.md": "empty-file",
                root / "policy.rtf": "unsupported-format",
            }
            (root / "empty.md").write_bytes(b"")
            (root / "policy.rtf").write_text("policy", encoding="utf-8")
            for path, expected in inputs.items():
                with self.subTest(path=path):
                    result = preflight_document(path)
                    issue = next(item for item in result.issues if item.code == expected)
                    self.assertTrue(issue.reason and issue.impact and issue.next_step)

    def test_permission_or_network_share_failure_is_actionable_and_path_safe(self) -> None:
        secret = Path(r"\\server\restricted-share\confidential-policy.md")
        with patch.object(Path, "stat", side_effect=PermissionError("access denied")):
            result = preflight_document(secret)
        issue = next(item for item in result.issues if item.code == "file-unavailable")
        self.assertEqual(result.status, "error")
        self.assertTrue(issue.reason and issue.impact and issue.next_step)
        self.assertNotIn("server", issue.reason.casefold())
        self.assertNotIn("confidential-policy", issue.reason.casefold())

    def test_source_modified_during_parse_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "policy.md"
            path.write_text("# Policy\n\nMembers must file.\n", encoding="utf-8")
            real_inspect = formats._inspect

            def mutate(source: Path):
                result = real_inspect(source)
                source.write_text("# Policy\n\nMembers may file a different rule.\n", encoding="utf-8")
                return result

            with patch("governdiff.formats._inspect", side_effect=mutate):
                with self.assertRaises(DocumentInputError) as raised:
                    parse_document(path)
            self.assertEqual(raised.exception.issue.code, "source-modified-during-read")


class TextAndHtmlBoundaryAcceptanceTests(unittest.TestCase):
    def test_utf8_bom_gb18030_crlf_lf_and_mixed_newlines(self) -> None:
        samples = {
            "bom.md": "# Policy\r\n\r\nMembers must file.\r\n".encode("utf-8-sig"),
            "gb.txt": "第一条\r\n成员应当申报。\n".encode("gb18030"),
            "mixed.md": b"# Policy\r\n\nMembers must file.\rSecond line.\n",
        }
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            for name, raw in samples.items():
                with self.subTest(name=name):
                    path = Path(directory) / name
                    path.write_bytes(raw)
                    document = parse_document(path)
                    self.assertTrue(document.blocks)
                    self.assertNotEqual(document.language, "unknown")

    def test_nul_and_invalid_utf8_are_reported_instead_of_silently_cleaned(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            for name, raw in {
                "nul.txt": b"Policy\x00\x00\x00 text",
                "invalid.txt": b"Policy " + (b"\xff" * 20),
            }.items():
                with self.subTest(name=name):
                    path = Path(directory) / name
                    path.write_bytes(raw)
                    result = preflight_document(path)
                    self.assertIn("garbled-text", {item.code for item in result.issues})
                    with self.assertRaises(DocumentInputError):
                        parse_document(path)

    def test_markdown_policy_for_frontmatter_links_references_and_fenced_code_is_stable(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "policy.md"
            path.write_text(
                "---\ntitle: Hidden metadata\n---\n# Policy\n"
                "Members [must](https://example.invalid) file.\n\n"
                "[source]: https://example.invalid/source\n"
                "```text\nAudit records must remain available.\n```\n",
                encoding="utf-8",
            )
            first = parse_document(path)
            second = parse_document(path)
        text = "\n".join(block.text for block in first.blocks)
        self.assertNotIn("Hidden metadata", text)
        self.assertNotIn("[source]", text)
        self.assertIn("Audit records must remain available.", text)
        self.assertEqual([block.block_id for block in first.blocks], [block.block_id for block in second.blocks])

    def test_html_ignores_executable_template_and_explicitly_hidden_content(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "policy.html"
            path.write_text(
                "<main><h1>Policy</h1><p>Visible rule must apply.</p>"
                "<script>script secret</script><style>.x{display:none}</style>"
                "<noscript>noscript secret</noscript><template>template secret</template>"
                "<p hidden>hidden attribute secret</p>"
                "<p aria-hidden='true'>aria secret</p>"
                "<p style='display: none'>display secret</p>"
                "<p style='visibility:hidden'>visibility secret</p>"
                "<div class='cookie-banner'><p>cookie banner secret</p></div>"
                "<svg><text>svg secret</text></svg></main>",
                encoding="utf-8",
            )
            document = parse_document(path)
        text = "\n".join(block.text for block in document.blocks)
        self.assertIn("Visible rule must apply.", text)
        for secret in ("script", "noscript", "template", "attribute", "aria", "display", "visibility", "cookie banner", "svg"):
            self.assertNotIn(f"{secret} secret", text)


class StructuredFormatWarningAcceptanceTests(unittest.TestCase):
    def test_docx_non_body_features_emit_actionable_warnings(self) -> None:
        document_xml = """<?xml version='1.0' encoding='UTF-8'?>
        <w:document xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
                    xmlns:v='urn:schemas-microsoft-com:vml'>
          <w:body><w:p><w:r><w:t>Visible policy rule.</w:t></w:r>
            <w:commentRangeStart w:id='0'/><w:footnoteReference w:id='1'/>
            <w:instrText>DATE</w:instrText><w:rPr><w:vanish/></w:rPr>
            <w:txbxContent><w:p><w:r><w:t>Box rule.</w:t></w:r></w:p></w:txbxContent>
          </w:p><w:ins><w:r><w:t>Inserted.</w:t></w:r></w:ins></w:body>
        </w:document>"""
        extras = {
            "word/comments.xml": b"<comments/>",
            "word/footnotes.xml": b"<footnotes/>",
            "word/media/image1.png": b"not-a-real-image",
            "word/settings.xml": b"<w:settings xmlns:w='x'><w:documentProtection/></w:settings>",
            "_xmlsignatures/sig1.xml": b"<Signature/>",
        }
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "features.docx"
            _minimal_docx(path, document_xml, extras)
            result = preflight_document(path)
        codes = {item.code for item in result.issues}
        expected = {
            "docx-tracked-changes-present", "docx-comments-ignored", "docx-notes-ignored",
            "docx-fields-not-evaluated", "docx-hidden-text-present", "docx-text-box-present",
            "docx-images-not-ocr", "docx-protection-not-enforced", "docx-signature-not-validated",
        }
        self.assertTrue(expected.issubset(codes))
        self.assertTrue(all(item.reason and item.impact and item.next_step for item in result.issues))

    def test_docx_instr_text_does_not_create_false_tracked_change_warning(self) -> None:
        document_xml = """<w:document xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'>
          <w:body><w:p><w:instrText>DATE</w:instrText><w:r><w:t>Visible value.</w:t></w:r></w:p></w:body>
        </w:document>"""
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "field.docx"
            _minimal_docx(path, document_xml)
            codes = {item.code for item in preflight_document(path).issues}
        self.assertIn("docx-fields-not-evaluated", codes)
        self.assertNotIn("docx-tracked-changes-present", codes)

    def test_nested_docx_table_emits_flattening_warning(self) -> None:
        document_xml = """<w:document xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'>
          <w:body><w:tbl><w:tr><w:tc><w:p><w:r><w:t>Outer.</w:t></w:r></w:p>
            <w:tbl><w:tr><w:tc><w:p><w:r><w:t>Inner.</w:t></w:r></w:p></w:tc></w:tr></w:tbl>
          </w:tc></w:tr></w:tbl></w:body></w:document>"""
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "nested.docx"
            _minimal_docx(path, document_xml)
            result = preflight_document(path)
        self.assertIn("docx-nested-table-flattened", {item.code for item in result.issues})

    def test_pdf_forms_annotations_attachments_and_signatures_emit_warnings(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            path = Path(directory) / "features.pdf"
            writer = PdfWriter()
            page = writer.add_blank_page(width=72, height=72)
            page[NameObject("/Annots")] = ArrayObject([DictionaryObject()])
            writer.root_object[NameObject("/AcroForm")] = DictionaryObject()
            writer.root_object[NameObject("/Names")] = DictionaryObject({
                NameObject("/EmbeddedFiles"): DictionaryObject()
            })
            writer.root_object[NameObject("/Perms")] = DictionaryObject()
            with path.open("wb") as handle:
                writer.write(handle)
            result = preflight_document(path)
        codes = {item.code for item in result.issues}
        self.assertTrue({
            "pdf-form-fields-ignored", "pdf-attachments-ignored",
            "pdf-signature-not-validated", "pdf-annotations-ignored",
        }.issubset(codes))


if __name__ == "__main__":
    unittest.main()
