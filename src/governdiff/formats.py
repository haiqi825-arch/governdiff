"""Multi-format input, preflight, and normalized evidence extraction.

OCR is intentionally out of scope. Image-only PDFs are identified and rejected
with an actionable error instead of silently producing an empty comparison.
"""

from __future__ import annotations

import contextlib
import io
import hashlib
import math
import re
import stat as stat_module
import zipfile
from collections import Counter
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

from .document import comparison_text, detect_language, normalize_text, parse_text, read_text
from .models import (
    Block,
    Document,
    DocumentInputError,
    InputIssue,
    PreflightResult,
    Table,
    TableCell,
)


MAX_FILE_BYTES = 25 * 1024 * 1024
MAX_PAGES = 300
SUPPORTED_SUFFIXES = {".md", ".markdown", ".txt", ".pdf", ".docx", ".html", ".htm"}

_PAGE_NUMBER = re.compile(
    r"^\s*(?:page\s+)?\d+(?:\s+(?:of|/)\s+\d+)?\s*$|"
    r"^\s*[-\u2013\u2014]\s*\d+\s*[-\u2013\u2014]\s*$",
    re.I,
)
_PDF_HEADING = re.compile(
    r"^(?:Article\s+\d+[A-Za-z-]*|Section\s+\d+(?:\.\d+)*|"
    r"\u7b2c[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u767e\u5343\u4e07\u96f6\u30070-9]+"
    r"[\u7ae0\u8282\u7f16\u6761]|"
    r"\d+(?:\.\d+)*[.)]?)\s+\S+",
    re.I,
)
_TOC_TITLE = re.compile(r"^(?:table\s+of\s+contents|contents|目录|目次)$", re.I)
_TOC_ENTRY = re.compile(r".{2,}\.{3,}\s*\d+\s*$|^\s*\d+(?:\.\d+)*\s+.{2,}\s+\d+\s*$")
_LIST_PREFIX = re.compile(
    r"^\s*(?:[-+*\u2022]|\d+[.)]|"
    r"[\(\uff08][\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u53410-9]+[\)\uff09])\s+"
)
_W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
_W = f"{{{_W_NS}}}"


def _issue(
    code: str,
    severity: str,
    reason: str,
    impact: str,
    next_step: str,
    page_number: int | None = None,
) -> InputIssue:
    return InputIssue(code, severity, reason, impact, next_step, page_number)


def _format_for(path: Path) -> str:
    suffix = path.suffix.casefold()
    return {
        ".md": "markdown",
        ".markdown": "markdown",
        ".txt": "text",
        ".pdf": "pdf",
        ".docx": "docx",
        ".html": "html",
        ".htm": "html",
    }.get(suffix, "unsupported")


def _basic_preflight(path: Path) -> PreflightResult:
    source_format = _format_for(path)
    try:
        metadata = path.stat()
    except FileNotFoundError:
        result = PreflightResult(source_format=source_format, file_size_bytes=0)
        result.add(_issue(
            "file-not-found", "error", "The input file [redacted-path] does not exist.",
            "The document cannot be inspected or compared.",
            "Correct the path and run GovernDiff again.",
        ))
        return result
    except OSError as error:
        result = PreflightResult(source_format=source_format, file_size_bytes=0)
        result.add(_issue(
            "file-unavailable", "error",
            f"The input file [redacted-path] cannot be accessed ({error.__class__.__name__}).",
            "The document cannot be read reliably from its current location.",
            "Check local or network-share permissions and availability, copy the file to a stable readable location, and retry.",
        ))
        return result
    size = metadata.st_size
    result = PreflightResult(source_format=source_format, file_size_bytes=size)
    if not stat_module.S_ISREG(metadata.st_mode):
        result.add(_issue(
            "not-a-file", "error", "The input path [redacted-path] is not a regular file.",
            "Directories and special files cannot be compared.",
            "Provide a PDF, DOCX, HTML, Markdown, or TXT file.",
        ))
        return result
    if source_format == "unsupported":
        result.add(_issue(
            "unsupported-format", "error", f"Unsupported document type: {path.suffix or '(none)'}.",
            "No parser is available, so evidence locations would be unreliable.",
            "Convert the file to PDF, DOCX, HTML, Markdown, or TXT.",
        ))
    if size == 0:
        result.add(_issue(
            "empty-file", "error", "The input file is empty.",
            "There is no policy text to compare.",
            "Provide a non-empty source document.",
        ))
    if size > MAX_FILE_BYTES:
        result.add(_issue(
            "file-too-large", "error",
            f"The file is {size} bytes, above the 25 MB limit ({MAX_FILE_BYTES} bytes).",
            "The Beta parser does not guarantee bounded memory or processing time above this limit.",
            "Split the document or provide a file no larger than 25 MB.",
        ))
    return result


def _garbled_ratio(text: str) -> float:
    if not text:
        return 0.0
    suspicious = sum(
        char == "\ufffd"
        or char == "\x00"
        or (ord(char) < 32 and char not in "\n\r\t")
        or 0xE000 <= ord(char) <= 0xF8FF
        for char in text
    )
    return suspicious / len(text)


def _add_text_quality(result: PreflightResult, text: str) -> None:
    result.character_count = len(text)
    result.word_count = len(re.findall(r"[\w\u3400-\u9fff]+", text))
    ratio = _garbled_ratio(text)
    result.has_garbled_text = ratio >= 0.005
    if not text.strip():
        result.add(_issue(
            "empty-document", "error", "The document contains no readable text.",
            "GovernDiff cannot produce evidence-backed changes.",
            "Verify the file or export it again as a text-bearing document.",
        ))
    elif ratio >= 0.10:
        result.add(_issue(
            "garbled-text", "error", f"At least {ratio:.1%} of extracted characters are invalid or private-use glyphs.",
            "Clause text and evidence locations would be unreliable.",
            "Re-export the document with Unicode text or use another source copy.",
        ))
    elif ratio >= 0.005:
        result.add(_issue(
            "garbled-text", "warning", f"About {ratio:.1%} of extracted characters look invalid.",
            "Some clauses may be incomplete or misaligned.",
            "Review the extracted evidence and re-export the source if needed.",
        ))


@dataclass(slots=True)
class _Record:
    text: str
    section: tuple[str, ...] = ()
    block_type: str = "paragraph"
    page: int | None = None
    paragraph_start: int | None = None
    paragraph_end: int | None = None
    char_start: int | None = None
    char_end: int | None = None
    line: int = 1
    list_level: int | None = None
    table_id: str | None = None
    table_row: int | None = None
    table_column: int | None = None
    is_noise: bool = False


def _records_to_blocks(records: list[_Record]) -> list[Block]:
    occurrences: dict[str, int] = {}
    blocks: list[Block] = []
    for ordinal, record in enumerate(record for record in records if normalize_text(record.text)):
        normalized = normalize_text(record.text)
        identity = "\x1f".join((*record.section, record.block_type, normalized))
        occurrence = occurrences.get(identity, 0)
        occurrences[identity] = occurrence + 1
        digest = hashlib.sha256(f"{identity}\x1f{occurrence}".encode("utf-8")).hexdigest()[:12]
        blocks.append(Block(
            block_id=f"BLK-{digest.upper()}",
            section=record.section,
            text=record.text.strip(),
            normalized_text=normalized,
            comparison_text=comparison_text(record.text),
            ordinal=ordinal,
            line_start=max(1, record.line),
            line_end=max(1, record.line),
            block_type=record.block_type,
            page_start=record.page,
            page_end=record.page,
            paragraph_start=record.paragraph_start,
            paragraph_end=record.paragraph_end or record.paragraph_start,
            char_start=record.char_start,
            char_end=record.char_end,
            list_level=record.list_level,
            table_id=record.table_id,
            table_row=record.table_row,
            table_column=record.table_column,
            is_noise=record.is_noise,
        ))
    return blocks


def _raise_first_error(result: PreflightResult) -> None:
    error = next((item for item in result.issues if item.severity == "error"), None)
    if error:
        raise DocumentInputError(error)


def _text_inspection(path: Path, result: PreflightResult) -> tuple[str, None]:
    try:
        text = read_text(path)
    except OSError as error:
        result.add(_issue(
            "read-failed", "error", f"The file could not be read: {error}",
            "No content was imported.", "Check file permissions and retry.",
        ))
        return "", None
    _add_text_quality(result, text)
    result.paragraph_count = len([part for part in re.split(r"\n\s*\n", text) if part.strip()])
    result.text_coverage = 1.0 if text.strip() else 0.0
    return text, None


def _pdf_has_images(page: Any) -> bool:
    try:
        resources = page.get("/Resources") or {}
        xobjects = resources.get("/XObject") or {}
        xobjects = xobjects.get_object() if hasattr(xobjects, "get_object") else xobjects
        for item in xobjects.values():
            obj = item.get_object() if hasattr(item, "get_object") else item
            if obj.get("/Subtype") == "/Image":
                return True
    except Exception:
        return False
    return False


def _pdf_inspection(path: Path, result: PreflightResult) -> tuple[list[str], list[bool]]:
    try:
        from pypdf import PdfReader
        from pypdf.errors import PdfReadError
    except ImportError:
        result.add(_issue(
            "pdf-dependency-missing", "error", "The pypdf runtime dependency is not installed.",
            "Digital PDF text and page evidence cannot be extracted.",
            "Install GovernDiff with its declared dependencies and retry.",
        ))
        return [], []
    try:
        # pypdf writes some parse diagnostics directly to process stderr before
        # raising PdfReadError. Keep CLI stdout/stderr deterministic and expose
        # the failure only through GovernDiff's actionable preflight issue.
        with contextlib.redirect_stderr(io.StringIO()):
            reader = PdfReader(str(path), strict=False)
    except (PdfReadError, OSError, ValueError, TypeError) as error:
        result.add(_issue(
            "invalid-pdf", "error", f"The PDF is damaged or unreadable: {error}",
            "Pages and evidence locations cannot be trusted.",
            "Download or export a valid PDF and retry.",
        ))
        return [], []
    if reader.is_encrypted:
        result.encrypted = True
        result.add(_issue(
            "encrypted-pdf", "error", "The PDF is encrypted or password protected.",
            "GovernDiff cannot extract verifiable page text.",
            "Provide an authorized, unencrypted copy. GovernDiff will not bypass encryption.",
        ))
        return [], []
    root = reader.trailer.get("/Root") or {}
    root = root.get_object() if hasattr(root, "get_object") else root
    try:
        if root.get("/AcroForm") is not None:
            result.add(_issue(
                "pdf-form-fields-ignored", "warning",
                "The PDF contains interactive form fields; only rendered page text is compared.",
                "Values stored only in form controls may be absent from clause evidence.",
                "Flatten the form into a digital-text PDF or verify the form values separately.",
            ))
        names = root.get("/Names") or {}
        names = names.get_object() if hasattr(names, "get_object") else names
        if names.get("/EmbeddedFiles") is not None:
            result.add(_issue(
                "pdf-attachments-ignored", "warning",
                "The PDF contains embedded attachments; attachments are not imported.",
                "Policy text stored only in an attachment will not be compared.",
                "Compare each attachment separately or provide a flattened source document.",
            ))
        if root.get("/Perms") is not None:
            result.add(_issue(
                "pdf-signature-not-validated", "warning",
                "The PDF contains a permissions or digital-signature dictionary.",
                "GovernDiff extracts text but does not validate signature authenticity or integrity.",
                "Validate signatures with an authorized PDF verifier before relying on provenance.",
            ))
    except Exception:
        # Non-standard catalogs must not prevent safe page-text extraction.
        pass
    result.page_count = len(reader.pages)
    if result.page_count > MAX_PAGES:
        result.add(_issue(
            "too-many-pages", "error",
            f"The PDF has {result.page_count} pages, above the 300-page limit.",
            "The Beta parser does not guarantee bounded processing time above this limit.",
            "Split the PDF into documents of at most 300 pages.",
        ))
        return [], []
    page_texts: list[str] = []
    images: list[bool] = []
    for page_number, page in enumerate(reader.pages, start=1):
        try:
            annotations = page.get("/Annots") or []
            if annotations:
                result.add(_issue(
                    "pdf-annotations-ignored", "warning",
                    f"Page {page_number} contains annotations; annotation content is not compared.",
                    "Comments, stamps, or callouts may contain policy-relevant text outside page evidence.",
                    "Flatten relevant annotations into page text or review them separately.",
                    page_number,
                ))
        except Exception:
            pass
        try:
            text = page.extract_text() or ""
        except Exception as error:
            result.add(_issue(
                "pdf-page-extraction-failed", "error",
                f"Text extraction failed on page {page_number}: {error}",
                "Evidence after the failed page may be incomplete.",
                "Re-export the PDF or provide its source DOCX/HTML file.",
                page_number,
            ))
            text = ""
        page_texts.append(text)
        images.append(_pdf_has_images(page))
    result.paragraph_count = sum(
        1 for text in page_texts for line in text.splitlines() if normalize_text(line)
    )
    nonblank = [index + 1 for index, text in enumerate(page_texts) if len(normalize_text(text)) >= 20]
    result.blank_pages = [index + 1 for index, text in enumerate(page_texts) if not normalize_text(text)]
    result.text_coverage = len(nonblank) / max(1, len(page_texts))
    combined = "\n".join(page_texts)
    _add_text_quality(result, combined)
    if page_texts and not normalize_text(combined):
        # Replace generic empty-document with the more useful PDF diagnosis.
        result.issues = [item for item in result.issues if item.code != "empty-document"]
        result.status = "ok"
        result.suspected_scanned = any(images) or bool(page_texts)
        result.add(_issue(
            "suspected-scanned-pdf", "error",
            "The PDF has pages but no extractable digital text; it is blank or likely scanned.",
            "GovernDiff cannot create clause-level evidence without text. OCR is not enabled.",
            "Run OCR outside GovernDiff or provide a digital-text PDF, DOCX, HTML, Markdown, or TXT source.",
        ))
    elif result.text_coverage is not None and result.text_coverage < 0.60:
        result.suspected_scanned = any(
            images[index] and len(normalize_text(page_texts[index])) < 20
            for index in range(len(page_texts))
        )
        result.add(_issue(
            "low-text-coverage", "warning",
            f"Only {result.text_coverage:.1%} of PDF pages contain substantial extractable text.",
            "Some clauses may be missing, especially on blank or image-only pages.",
            "Review the listed blank pages and provide a digital-text export if content is missing.",
        ))
    if result.blank_pages and result.status != "error":
        result.add(_issue(
            "blank-pages", "warning",
            f"No text was extracted from page(s): {', '.join(map(str, result.blank_pages[:20]))}.",
            "Those pages will not contribute clauses to the comparison.",
            "Confirm the pages are intentionally blank or provide a text-bearing export.",
        ))
    return page_texts, images


def _pdf_noise(lines_by_page: list[list[str]]) -> set[str]:
    if len(lines_by_page) < 2:
        return set()
    candidates: Counter[str] = Counter()
    for lines in lines_by_page:
        unique = {normalize_text(line).casefold() for line in (lines[:2] + lines[-2:]) if normalize_text(line)}
        candidates.update(unique)
    threshold = max(2, math.ceil(len(lines_by_page) * 0.60))
    return {line for line, count in candidates.items() if count >= threshold}


def _parse_pdf(path: Path, language: str, result: PreflightResult, page_texts: list[str]) -> Document:
    lines_by_page = [
        [normalize_text(line) for line in text.splitlines() if normalize_text(line)]
        for text in page_texts
    ]
    repeated_noise = _pdf_noise(lines_by_page)
    records: list[_Record] = []
    section: tuple[str, ...] = ()
    paragraph_index = 0
    for page_number, (page_text, lines) in enumerate(zip(page_texts, lines_by_page), start=1):
        toc_page = any(_TOC_TITLE.fullmatch(line) for line in lines) or sum(bool(_TOC_ENTRY.search(line)) for line in lines) >= 2
        char_cursor = 0
        for line_number, line in enumerate(lines, start=1):
            normalized_key = normalize_text(line).casefold()
            start = page_text.find(line, char_cursor)
            if start < 0:
                start = char_cursor
            end = start + len(line)
            char_cursor = end
            if normalized_key in repeated_noise or _PAGE_NUMBER.fullmatch(line):
                continue
            if _PDF_HEADING.match(line) and len(line) <= 140 and not toc_page:
                section = (line,)
                continue
            paragraph_index += 1
            records.append(_Record(
                text=line,
                section=section,
                block_type="toc" if toc_page else ("list_item" if _LIST_PREFIX.match(line) else "paragraph"),
                page=page_number,
                paragraph_start=paragraph_index,
                paragraph_end=paragraph_index,
                char_start=start,
                char_end=end,
                line=line_number,
                list_level=0 if _LIST_PREFIX.match(line) else None,
                is_noise=toc_page,
            ))
    blocks = _records_to_blocks(records)
    result.paragraph_count = len(blocks)
    selected_language = detect_language("\n".join(page_texts)) if language == "auto" else language
    return Document(
        path=str(path).replace("\\", "/"),
        sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
        language=selected_language,
        blocks=blocks,
        source_format="pdf",
        preflight=result,
    )


def _docx_text(element: ET.Element) -> str:
    parts: list[str] = []
    for node in element.iter():
        if node.tag == f"{_W}t":
            parts.append(node.text or "")
        elif node.tag == f"{_W}tab":
            parts.append("\t")
        elif node.tag in {f"{_W}br", f"{_W}cr"}:
            parts.append("\n")
    return normalize_text("".join(parts))


def _docx_style(paragraph: ET.Element) -> str:
    style = paragraph.find(f"./{_W}pPr/{_W}pStyle")
    return style.get(f"{_W}val", "") if style is not None else ""


def _docx_heading_level(paragraph: ET.Element) -> int | None:
    style = _docx_style(paragraph)
    match = re.search(r"heading\s*([1-9])", style, re.I)
    if match:
        return int(match.group(1))
    outline = paragraph.find(f"./{_W}pPr/{_W}outlineLvl")
    if outline is not None:
        return min(9, int(outline.get(f"{_W}val", "0")) + 1)
    return 1 if style.casefold() == "title" else None


def _docx_list_level(paragraph: ET.Element) -> int | None:
    num = paragraph.find(f"./{_W}pPr/{_W}numPr")
    if num is None:
        style = _docx_style(paragraph)
        if style.casefold().startswith("list"):
            match = re.search(r"(\d+)$", style)
            return max(0, int(match.group(1)) - 1) if match else 0
        return None
    level = num.find(f"{_W}ilvl")
    return int(level.get(f"{_W}val", "0")) if level is not None else 0


def _docx_payload(path: Path, result: PreflightResult) -> tuple[bytes, ET.Element | None]:
    raw = path.read_bytes()
    try:
        with zipfile.ZipFile(path) as archive:
            names = set(archive.namelist())
            if "word/document.xml" not in names:
                raise KeyError("word/document.xml is missing")
            document_xml = archive.read("word/document.xml")
            root = ET.fromstring(document_xml)
            if re.search(rb"<w:(?:ins|del)(?:\s|>)", document_xml):
                result.add(_issue(
                    "docx-tracked-changes-present", "warning",
                    "The DOCX contains tracked revisions; inserted visible text may be imported, while deleted revision text is not compared.",
                    "Unaccepted revisions can make the compared text differ from the author's intended final version.",
                    "Accept or reject all revisions in Word, save a review copy, and compare that copy.",
                ))
            structure_checks = (
                (b"<w:commentRangeStart", b"<w:commentReference", "docx-comments-ignored",
                 "The DOCX contains comments; comment bodies are not compared.",
                 "Policy-relevant instructions stored only in comments will be absent from evidence.",
                 "Resolve comments or move required content into the document body before comparison."),
                (b"<w:footnoteReference", b"<w:endnoteReference", "docx-notes-ignored",
                 "The DOCX references footnotes or endnotes; note bodies are not compared.",
                 "Requirements expressed only in notes may be omitted from the result.",
                 "Move operative notes into the body or compare an exported digital-text PDF."),
                (b"<w:instrText", b"<w:fldSimple", "docx-fields-not-evaluated",
                 "The DOCX contains dynamic fields; GovernDiff does not evaluate or refresh field results.",
                 "A stale or hidden field result may not match what Word displays after refresh.",
                 "Update all fields in Word, save the document, and retry."),
                (b"<w:vanish", b"<w:webHidden", "docx-hidden-text-present",
                 "The DOCX contains hidden-text formatting.",
                 "Hidden runs can be included in extracted body text and create unexpected evidence.",
                 "Remove hidden content or verify the extracted evidence before accepting findings."),
                (b"<w:txbxContent", b"<v:textbox", "docx-text-box-present",
                 "The DOCX contains a text box; its text is flattened into the surrounding paragraph when reachable.",
                 "Text-box reading order and spatial relationships are not preserved in evidence.",
                 "Verify text-box evidence or compare an exported digital-text PDF."),
            )
            for marker_a, marker_b, code, reason, impact, next_step in structure_checks:
                if marker_a in document_xml or marker_b in document_xml:
                    result.add(_issue(code, "warning", reason, impact, next_step))
            if re.search(rb"<w:tc(?:\s|>)[\s\S]*?<w:tbl(?:\s|>)", document_xml):
                result.add(_issue(
                    "docx-nested-table-flattened", "warning",
                    "The DOCX contains a table nested inside another table cell.",
                    "Nested text is retained, but inner row/column coordinates and reading order are flattened.",
                    "Verify nested-table evidence or compare an exported digital-text PDF.",
                ))
            if "word/comments.xml" in names and not any(item.code == "docx-comments-ignored" for item in result.issues):
                result.add(_issue(
                    "docx-comments-ignored", "warning",
                    "The DOCX package contains comments; comment bodies are not compared.",
                    "Policy-relevant instructions stored only in comments will be absent from evidence.",
                    "Resolve comments or move required content into the document body before comparison.",
                ))
            if any(name in names for name in ("word/footnotes.xml", "word/endnotes.xml")) and not any(
                item.code == "docx-notes-ignored" for item in result.issues
            ):
                result.add(_issue(
                    "docx-notes-ignored", "warning",
                    "The DOCX package contains footnotes or endnotes; note bodies are not compared.",
                    "Requirements expressed only in notes may be omitted from the result.",
                    "Move operative notes into the body or compare an exported digital-text PDF.",
                ))
            if any(name.startswith("word/media/") for name in names):
                result.add(_issue(
                    "docx-images-not-ocr", "warning",
                    "The DOCX contains images; text inside images is not extracted because OCR is disabled.",
                    "Image-only clauses, diagrams, or scanned pages will not contribute evidence.",
                    "Provide equivalent digital text or run authorized OCR before comparison.",
                ))
            if any(name.startswith("_xmlsignatures/") for name in names):
                result.add(_issue(
                    "docx-signature-not-validated", "warning",
                    "The DOCX package contains a digital signature.",
                    "GovernDiff reads document text but does not validate signature authenticity or package integrity.",
                    "Validate the signature in an authorized Office viewer before relying on provenance.",
                ))
            if "word/settings.xml" in names and b"documentProtection" in archive.read("word/settings.xml"):
                result.add(_issue(
                    "docx-protection-not-enforced", "warning",
                    "The DOCX declares document protection; GovernDiff can read the package but does not enforce editing restrictions.",
                    "The restriction is not proof of document authenticity or approval state.",
                    "Verify provenance and authorization in Word before relying on the comparison.",
                ))
    except (zipfile.BadZipFile, KeyError, ET.ParseError, RuntimeError) as error:
        result.add(_issue(
            "invalid-docx", "error", f"The DOCX is damaged, encrypted, or incomplete: {error}",
            "Paragraphs, tables, and evidence indices cannot be recovered safely.",
            "Open and re-save an unencrypted DOCX, or export it to digital-text PDF.",
        ))
        return raw, None
    visible = "\n".join(_docx_text(node) for node in root.iter(f"{_W}p"))
    result.paragraph_count = sum(1 for node in root.iter(f"{_W}p") if _docx_text(node))
    _add_text_quality(result, visible)
    result.text_coverage = 1.0 if visible.strip() else 0.0
    return raw, root


def _parse_docx(path: Path, language: str, result: PreflightResult, raw: bytes, root: ET.Element) -> Document:
    body = root.find(f"{_W}body")
    if body is None:
        raise DocumentInputError(_issue(
            "invalid-docx", "error", "The DOCX body is missing.",
            "No policy content can be located.", "Open and re-save the DOCX, then retry.",
        ))
    records: list[_Record] = []
    tables: list[Table] = []
    section_stack: list[str] = []
    paragraph_index = 0
    char_cursor = 0
    for child in body:
        if child.tag == f"{_W}p":
            paragraph_index += 1
            text = _docx_text(child)
            if not text:
                continue
            style = _docx_style(child)
            heading_level = _docx_heading_level(child)
            toc = style.casefold().startswith("toc") or bool(_TOC_TITLE.fullmatch(text))
            if heading_level is not None and not toc:
                section_stack = section_stack[: heading_level - 1]
                section_stack.append(text)
                char_cursor += len(text) + 1
                continue
            list_level = _docx_list_level(child)
            records.append(_Record(
                text=text,
                section=tuple(section_stack),
                block_type="toc" if toc else ("list_item" if list_level is not None else "paragraph"),
                paragraph_start=paragraph_index,
                paragraph_end=paragraph_index,
                char_start=char_cursor,
                char_end=char_cursor + len(text),
                list_level=list_level,
                is_noise=toc,
            ))
            char_cursor += len(text) + 1
        elif child.tag == f"{_W}tbl":
            table_ordinal = len(tables)
            table_id = f"TBL-{table_ordinal + 1:04d}"
            cells: list[TableCell] = []
            rows = child.findall(f"./{_W}tr")
            max_column = 0
            table_start = paragraph_index + 1
            for row_index, row in enumerate(rows):
                column_index = 0
                for cell in row.findall(f"./{_W}tc"):
                    paragraphs = cell.findall(f"./{_W}p")
                    paragraph_start = paragraph_index + 1
                    paragraph_index += max(1, len(paragraphs))
                    paragraph_end = paragraph_index
                    text = "\n".join(filter(None, (_docx_text(item) for item in paragraphs)))
                    grid_span = cell.find(f"./{_W}tcPr/{_W}gridSpan")
                    column_span = int(grid_span.get(f"{_W}val", "1")) if grid_span is not None else 1
                    cell_id = f"{table_id}-R{row_index + 1}C{column_index + 1}"
                    model_cell = TableCell(
                        cell_id=cell_id,
                        table_id=table_id,
                        row_index=row_index,
                        column_index=column_index,
                        text=text,
                        column_span=column_span,
                        is_header=row_index == 0,
                        paragraph_index=paragraph_start,
                    )
                    cells.append(model_cell)
                    if text:
                        records.append(_Record(
                            text=text,
                            section=tuple(section_stack),
                            block_type="table_cell",
                            paragraph_start=paragraph_start,
                            paragraph_end=paragraph_end,
                            char_start=char_cursor,
                            char_end=char_cursor + len(text),
                            table_id=table_id,
                            table_row=row_index,
                            table_column=column_index,
                        ))
                        char_cursor += len(text) + 1
                    column_index += column_span
                max_column = max(max_column, column_index)
            tables.append(Table(
                table_id=table_id,
                ordinal=table_ordinal,
                row_count=len(rows),
                column_count=max_column,
                cells=cells,
                paragraph_index=table_start,
            ))
    blocks = _records_to_blocks(records)
    result.paragraph_count = paragraph_index
    content = "\n".join(block.text for block in blocks)
    selected_language = detect_language(content) if language == "auto" else language
    return Document(
        path=str(path).replace("\\", "/"),
        sha256=hashlib.sha256(raw).hexdigest(),
        language=selected_language,
        blocks=blocks,
        source_format="docx",
        tables=tables,
        preflight=result,
    )


@dataclass(slots=True)
class _HTMLNode:
    tag: str
    attrs: dict[str, str] = field(default_factory=dict)
    children: list[Any] = field(default_factory=list)


class _HTMLTreeParser(HTMLParser):
    _VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = _HTMLNode("document")
        self.stack = [self.root]

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        node = _HTMLNode(tag.casefold(), {key.casefold(): value or "" for key, value in attrs})
        self.stack[-1].children.append(node)
        if node.tag not in self._VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if self.stack[-1].tag == tag.casefold():
            self.stack.pop()

    def handle_endtag(self, tag: str) -> None:
        target = tag.casefold()
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == target:
                del self.stack[index:]
                break

    def handle_data(self, data: str) -> None:
        self.stack[-1].children.append(data)


_HTML_SKIP = {"script", "style", "noscript", "template", "svg", "canvas", "form", "nav", "header", "footer", "aside"}
_HTML_BLOCK = {"p", "li", "blockquote", "pre", "dd", "dt", "table", "h1", "h2", "h3", "h4", "h5", "h6"}
_HTML_CONTENT_MARKERS = (
    "article", "content", "detail", "document", "editor", "main", "policy", "text",
)
_HTML_CONTENT_SPECIFIC = (
    "article-body", "article_content", "content-body", "content_body", "doccontent",
    "editor", "ucap-content",
)


def _html_is_toc(node: _HTMLNode) -> bool:
    marker = f"{node.attrs.get('id', '')} {node.attrs.get('class', '')}".casefold()
    return any(token in marker for token in ("table-of-contents", "table_of_contents", "toc", "contents-list"))


def _html_is_hidden(node: _HTMLNode) -> bool:
    if "hidden" in node.attrs or node.attrs.get("aria-hidden", "").casefold() == "true":
        return True
    style = re.sub(r"\s+", "", node.attrs.get("style", "").casefold())
    return "display:none" in style or "visibility:hidden" in style


def _html_is_site_noise(node: _HTMLNode) -> bool:
    marker = f"{node.attrs.get('id', '')} {node.attrs.get('class', '')}".casefold()
    return any(token in marker for token in (
        "cookie-banner", "cookie_banner", "cookie-consent", "cookie_consent",
        "cookie-notice", "cookie_notice",
    ))


def _html_text(node: _HTMLNode) -> str:
    if _html_is_hidden(node) or _html_is_site_noise(node):
        return ""
    parts: list[str] = []
    for child in node.children:
        if isinstance(child, str):
            parts.append(child)
        elif child.tag not in _HTML_SKIP:
            parts.append(_html_text(child))
    return normalize_text(" ".join(parts))


def _html_descendants(node: _HTMLNode, tag: str) -> list[_HTMLNode]:
    values: list[_HTMLNode] = []
    for child in node.children:
        if not isinstance(child, _HTMLNode):
            continue
        if _html_is_hidden(child) or _html_is_site_noise(child) or child.tag in _HTML_SKIP:
            continue
        if child.tag == tag:
            values.append(child)
        values.extend(_html_descendants(child, tag))
    return values


def _html_find_first(node: _HTMLNode, tags: tuple[str, ...]) -> _HTMLNode | None:
    for tag in tags:
        matches = _html_descendants(node, tag)
        if matches:
            return matches[0]
    return None


def _html_content_container(root: _HTMLNode) -> _HTMLNode:
    """Select the most substantial policy-like container in imperfect web HTML.

    Government CMS exports are frequently malformed: an unclosed ``header`` can
    make the actual article a descendant of a navigation wrapper. Starting at
    ``body`` would then discard the whole policy because headers are noise. A
    scored inner container keeps the original file auditable while recovering
    the visible article body.
    """

    candidates: list[_HTMLNode] = []

    def collect(node: _HTMLNode) -> None:
        marker = f"{node.attrs.get('id', '')} {node.attrs.get('class', '')}".casefold()
        if node.tag in {"main", "article"} or (
            node.tag in {"div", "section"}
            and any(token in marker for token in _HTML_CONTENT_MARKERS)
        ):
            candidates.append(node)
        for child in node.children:
            if isinstance(child, _HTMLNode):
                collect(child)

    collect(root)
    substantial = [node for node in candidates if len(_html_text(node)) >= 40]
    if substantial:
        def score(node: _HTMLNode) -> tuple[int, int]:
            marker = f"{node.attrs.get('id', '')} {node.attrs.get('class', '')}".casefold()
            return (
                int(any(token in marker for token in _HTML_CONTENT_SPECIFIC)),
                len(_html_text(node)),
            )

        return max(substantial, key=score)
    return _html_find_first(root, ("main", "article", "body")) or root


def _html_payload(path: Path, result: PreflightResult) -> tuple[str, _HTMLNode | None]:
    try:
        text = read_text(path)
        parser = _HTMLTreeParser()
        parser.feed(text)
        parser.close()
    except (OSError, UnicodeError, ValueError) as error:
        result.add(_issue(
            "invalid-html", "error", f"The HTML could not be parsed: {error}",
            "Document structure and evidence cannot be recovered.",
            "Provide valid HTML or export the page as digital-text PDF.",
        ))
        return "", None
    visible = _html_text(_html_content_container(parser.root))
    result.paragraph_count = sum(
        len(_html_descendants(parser.root, tag))
        for tag in ("p", "li", "blockquote", "pre", "dd", "dt", "td", "th")
    )
    _add_text_quality(result, visible)
    result.text_coverage = 1.0 if visible.strip() else 0.0
    return text, parser.root


def _parse_html(path: Path, language: str, result: PreflightResult, raw_text: str, root: _HTMLNode) -> Document:
    container = _html_content_container(root)
    records: list[_Record] = []
    tables: list[Table] = []
    section_stack: list[str] = []
    paragraph_index = 0
    char_cursor = 0

    def add_record(text: str, kind: str, noise: bool = False, list_level: int | None = None, **kwargs: Any) -> None:
        nonlocal paragraph_index, char_cursor
        text = normalize_text(text)
        if not text:
            return
        paragraph_index += 1
        records.append(_Record(
            text=text,
            section=tuple(section_stack),
            block_type="toc" if noise else kind,
            paragraph_start=paragraph_index,
            paragraph_end=paragraph_index,
            char_start=char_cursor,
            char_end=char_cursor + len(text),
            list_level=list_level,
            is_noise=noise,
            **kwargs,
        ))
        char_cursor += len(text) + 1

    def parse_table(node: _HTMLNode, noise: bool) -> None:
        nonlocal paragraph_index
        rows = _html_descendants(node, "tr")
        table_ordinal = len(tables)
        table_id = f"TBL-{table_ordinal + 1:04d}"
        cells: list[TableCell] = []
        max_column = 0
        table_start = paragraph_index + 1
        for row_index, row in enumerate(rows):
            column_index = 0
            row_cells = [child for child in row.children if isinstance(child, _HTMLNode) and child.tag in {"td", "th"}]
            for cell in row_cells:
                text = _html_text(cell)
                column_span = max(1, int(cell.attrs.get("colspan", "1") or "1"))
                row_span = max(1, int(cell.attrs.get("rowspan", "1") or "1"))
                next_paragraph = paragraph_index + 1
                model_cell = TableCell(
                    cell_id=f"{table_id}-R{row_index + 1}C{column_index + 1}",
                    table_id=table_id,
                    row_index=row_index,
                    column_index=column_index,
                    text=text,
                    row_span=row_span,
                    column_span=column_span,
                    is_header=cell.tag == "th" or row_index == 0,
                    paragraph_index=next_paragraph,
                )
                cells.append(model_cell)
                add_record(
                    text, "table_cell", noise,
                    table_id=table_id, table_row=row_index, table_column=column_index,
                )
                column_index += column_span
            max_column = max(max_column, column_index)
        tables.append(Table(
            table_id=table_id,
            ordinal=table_ordinal,
            row_count=len(rows),
            column_count=max_column,
            cells=cells,
            paragraph_index=table_start,
        ))

    def walk(node: _HTMLNode, inherited_noise: bool = False) -> None:
        nonlocal section_stack
        if node.tag in _HTML_SKIP or _html_is_hidden(node) or _html_is_site_noise(node):
            return
        noise = inherited_noise or _html_is_toc(node)
        if re.fullmatch(r"h[1-6]", node.tag):
            text = _html_text(node)
            if noise:
                add_record(text, "toc", True)
            elif text:
                level = int(node.tag[1])
                section_stack = section_stack[: level - 1]
                section_stack.append(text)
            return
        if node.tag == "table":
            parse_table(node, noise)
            return
        if node.tag in {"p", "blockquote", "pre", "dd", "dt"}:
            add_record(_html_text(node), "paragraph", noise)
            return
        if node.tag == "li":
            add_record(_html_text(node), "list_item", noise, list_level=0)
            return
        child_nodes = [child for child in node.children if isinstance(child, _HTMLNode)]
        for child in child_nodes:
            walk(child, noise)
        if node.tag in {"div", "section", "article", "main", "body"} and not any(
            child.tag in _HTML_BLOCK or child.tag in {"div", "section", "article", "main"}
            for child in child_nodes
        ):
            direct = normalize_text(" ".join(child for child in node.children if isinstance(child, str)))
            add_record(direct, "paragraph", noise)

    walk(container)
    blocks = _records_to_blocks(records)
    result.paragraph_count = paragraph_index
    content = "\n".join(block.text for block in blocks)
    selected_language = detect_language(content) if language == "auto" else language
    return Document(
        path=str(path).replace("\\", "/"),
        sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
        language=selected_language,
        blocks=blocks,
        source_format="html",
        tables=tables,
        preflight=result,
    )


def _inspect(path: Path) -> tuple[PreflightResult, Any]:
    result = _basic_preflight(path)
    if result.status == "error":
        return result, None
    if result.source_format in {"markdown", "text"}:
        payload, _ = _text_inspection(path, result)
    elif result.source_format == "pdf":
        payload = _pdf_inspection(path, result)
    elif result.source_format == "docx":
        payload = _docx_payload(path, result)
    elif result.source_format == "html":
        payload = _html_payload(path, result)
    else:
        payload = None
    return result, payload


def preflight_document_file(path: Path) -> PreflightResult:
    result, _ = _inspect(path)
    return result


def parse_document_file(path: Path, language: str = "auto") -> Document:
    try:
        before = path.stat()
        before_signature = (before.st_dev, before.st_ino, before.st_size, before.st_mtime_ns)
    except OSError:
        before_signature = None
    result, payload = _inspect(path)
    _raise_first_error(result)
    document: Document
    if result.source_format in {"markdown", "text"}:
        document = parse_text(payload, str(path), language)
        document.sha256 = hashlib.sha256(path.read_bytes()).hexdigest()
        document.source_format = result.source_format
        document.preflight = result
    elif result.source_format == "pdf":
        page_texts, _ = payload
        document = _parse_pdf(path, language, result, page_texts)
    elif result.source_format == "docx":
        raw, root = payload
        assert root is not None
        document = _parse_docx(path, language, result, raw, root)
    elif result.source_format == "html":
        raw_text, root = payload
        assert root is not None
        document = _parse_html(path, language, result, raw_text, root)
    else:
        raise DocumentInputError(next(item for item in result.issues if item.severity == "error"))
    try:
        after = path.stat()
        after_signature = (after.st_dev, after.st_ino, after.st_size, after.st_mtime_ns)
    except OSError:
        after_signature = None
    if before_signature is not None and after_signature != before_signature:
        raise DocumentInputError(_issue(
            "source-modified-during-read", "error",
            "The source file changed while GovernDiff was reading it.",
            "Extracted evidence and the recorded document hash may refer to different revisions.",
            "Stop the writer, save a stable copy, and retry the comparison.",
        ))
    return document
