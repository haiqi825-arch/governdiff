"""Dependency-free parsing for Markdown and plain-text policy documents."""

from __future__ import annotations

import hashlib
import html
import re
import unicodedata
from pathlib import Path

from .models import Block, Document, PreflightResult


_MARKDOWN_HEADING = re.compile(r"^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$")
_ARTICLE_HEADING = re.compile(
    r"^\s*(第[一二三四五六七八九十百千万零〇0-9]+[章节编条款]|Article\s+\d+[A-Za-z-]*)"
    r"(?:\s*[：:.、-]?\s*)(.*)$",
    re.IGNORECASE,
)
_NUMBERED_HEADING = re.compile(
    r"^\s*((?:\d+\.)+\d*|[一二三四五六七八九十百千万]+、)\s*(\S.*)$"
)
_LIST_ITEM = re.compile(r"^\s*(?:[-+*]|\d+[.)]|[（(][一二三四五六七八九十0-9]+[）)])\s+\S")
_MARKDOWN_LINK = re.compile(r"!?\[([^]]*)]\([^)]*\)")
_MARKDOWN_MARKS = re.compile(r"[`*_~>#]")
_PUNCTUATION = re.compile(r"[^\w\u3400-\u9fff]+", re.UNICODE)
_TOC_HEADING = re.compile(r"^(?:table\s+of\s+contents|contents|目录|目次)$", re.I)


def normalize_text(text: str) -> str:
    """Normalize Unicode and whitespace while retaining meaningful punctuation."""

    value = unicodedata.normalize("NFKC", html.unescape(text))
    value = _MARKDOWN_LINK.sub(r"\1", value)
    value = _MARKDOWN_MARKS.sub("", value)
    return re.sub(r"\s+", " ", value).strip()


def comparison_text(text: str) -> str:
    """Create a loose representation used only for matching and format detection."""

    value = normalize_text(text)
    article = _ARTICLE_HEADING.match(value)
    if article and article.group(2).strip():
        # Article labels are structural identity, not operative clause text.  By
        # removing only a leading label here, identical clauses can be aligned
        # across a renumbering while the original evidence remains untouched.
        value = article.group(2).strip()
    return _PUNCTUATION.sub("", value.casefold())


def detect_language(text: str) -> str:
    han = len(re.findall(r"[\u3400-\u9fff]", text))
    latin = len(re.findall(r"[A-Za-z]", text))
    if han > latin * 0.25:
        return "zh"
    return "en" if latin else "unknown"


def read_text(path: str | Path) -> str:
    raw = Path(path).read_bytes()
    for encoding in ("utf-8-sig", "utf-8", "gb18030"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


def _clean_heading(value: str) -> str:
    return normalize_text(re.sub(r"\s*#+\s*$", "", value))


def _looks_like_numbered_heading(line: str) -> re.Match[str] | None:
    match = _NUMBERED_HEADING.match(line)
    if not match:
        return None
    content = match.group(2).strip()
    # Long, sentence-like numbered clauses are content rather than headings.
    if len(content) > 80 or re.search(r"[。！？.!?;；]$", content):
        return None
    return match


def parse_text(text: str, logical_path: str = "document.md", language: str = "auto") -> Document:
    """Parse text into stable, evidence-addressable policy blocks."""

    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    section_stack: list[str] = []
    raw_blocks: list[tuple[tuple[str, ...], str, int, int]] = []
    paragraph: list[str] = []
    paragraph_start = 0
    front_matter_marker = lines[0].strip() if lines and lines[0].strip() in {"+++", "---"} else None
    in_front_matter = front_matter_marker is not None

    def flush(end_line: int) -> None:
        nonlocal paragraph, paragraph_start
        if paragraph:
            value = "\n".join(item.rstrip() for item in paragraph).strip()
            if value:
                raw_blocks.append((tuple(section_stack), value, paragraph_start, end_line))
        paragraph = []
        paragraph_start = 0

    for line_number, line in enumerate(lines, start=1):
        if in_front_matter:
            if line_number > 1 and line.strip() == front_matter_marker:
                in_front_matter = False
            continue

        # Markdown link reference definitions are rendering metadata, not policy clauses.
        if re.match(r"^\s*\[[^]]+]:\s*\S+", line):
            flush(line_number - 1)
            continue

        markdown_heading = _MARKDOWN_HEADING.match(line)
        article_heading = _ARTICLE_HEADING.match(line)
        numbered_heading = _looks_like_numbered_heading(line)

        if markdown_heading:
            flush(line_number - 1)
            depth = len(markdown_heading.group(1))
            title = _clean_heading(markdown_heading.group(2))
            section_stack = section_stack[: depth - 1]
            section_stack.append(title)
            continue

        if article_heading:
            flush(line_number - 1)
            marker = _clean_heading(article_heading.group(1))
            title = _clean_heading(article_heading.group(2))
            is_chinese_clause = marker.endswith(("条", "款")) and bool(title)
            is_english_inline_clause = (
                marker.casefold().startswith("article")
                and bool(title)
                and (len(title) > 80 or bool(re.search(r"[.!?;:]", title)))
            )
            inline_clause = is_chinese_clause or is_english_inline_clause
            label = marker if inline_clause else f"{marker} {title}".strip()
            # Articles sit below the nearest chapter/section heading.
            if section_stack and _ARTICLE_HEADING.match(section_stack[-1]):
                section_stack[-1] = label
            else:
                section_stack.append(label)
            # In Chinese laws, the article marker and the operative clause are
            # commonly on the same line. Keep that line as evidence instead of
            # treating all of it as a heading and silently dropping the rule.
            if inline_clause:
                raw_blocks.append(
                    (tuple(section_stack), line.strip(), line_number, line_number)
                )
            continue

        if numbered_heading:
            flush(line_number - 1)
            title = _clean_heading(f"{numbered_heading.group(1)} {numbered_heading.group(2)}")
            section_stack = section_stack[:1] if section_stack else []
            section_stack.append(title)
            continue

        if not line.strip():
            flush(line_number - 1)
            continue

        if _LIST_ITEM.match(line):
            flush(line_number - 1)
            raw_blocks.append((tuple(section_stack), line.strip(), line_number, line_number))
            continue

        if not paragraph:
            paragraph_start = line_number
        paragraph.append(line)

    flush(len(lines))

    occurrences: dict[str, int] = {}
    blocks: list[Block] = []
    line_offsets: list[int] = []
    cursor = 0
    for line in lines:
        line_offsets.append(cursor)
        cursor += len(line) + 1
    for ordinal, (section, value, line_start, line_end) in enumerate(raw_blocks):
        normalized = normalize_text(value)
        identity = "\x1f".join((*section, normalized))
        occurrence = occurrences.get(identity, 0)
        occurrences[identity] = occurrence + 1
        digest = hashlib.sha256(f"{identity}\x1f{occurrence}".encode("utf-8")).hexdigest()[:12]
        start = line_offsets[max(0, line_start - 1)] if line_offsets else 0
        end_line_index = min(max(0, line_end - 1), len(lines) - 1) if lines else 0
        end = (line_offsets[end_line_index] + len(lines[end_line_index])) if lines else len(text)
        is_toc = any(_TOC_HEADING.fullmatch(item.strip()) for item in section)
        blocks.append(
            Block(
                block_id=f"BLK-{digest.upper()}",
                section=section,
                text=value,
                normalized_text=normalized,
                comparison_text=comparison_text(value),
                ordinal=ordinal,
                line_start=line_start,
                line_end=line_end,
                block_type="toc" if is_toc else ("list_item" if _LIST_ITEM.match(value) else "paragraph"),
                paragraph_start=ordinal + 1,
                paragraph_end=ordinal + 1,
                char_start=start,
                char_end=end,
                is_noise=is_toc,
            )
        )

    selected_language = detect_language(text) if language == "auto" else language
    suffix = Path(logical_path).suffix.casefold()
    source_format = "markdown" if suffix in {".md", ".markdown"} else "text"
    preflight = PreflightResult(
        source_format=source_format,
        file_size_bytes=len(text.encode("utf-8")),
        paragraph_count=len(blocks),
        word_count=sum(len(block.text.split()) for block in blocks),
        character_count=len(text),
        text_coverage=1.0 if text.strip() else 0.0,
    )
    return Document(
        path=logical_path.replace("\\", "/"),
        sha256=hashlib.sha256(text.encode("utf-8")).hexdigest(),
        language=selected_language,
        blocks=blocks,
        source_format=source_format,
        preflight=preflight,
    )


def parse_document(path: str | Path, language: str = "auto") -> Document:
    source = Path(path)
    from .formats import parse_document_file

    return parse_document_file(source, language)


def preflight_document(path: str | Path) -> PreflightResult:
    """Inspect a supported input without running the semantic diff."""

    from .formats import preflight_document_file

    return preflight_document_file(Path(path))
