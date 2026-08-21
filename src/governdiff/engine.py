"""Public orchestration API for GovernDiff analysis."""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Mapping

from .alignment import AlignmentGroup, align_documents, classify_group
from .articles import block_article, derive_article_mappings
from .checks import run_checks
from .config import Waiver
from .confidence import assign_confidence
from .document import parse_document, parse_text
from .fingerprint import finding_fingerprint, grouped_change_fingerprint, make_fingerprint
from .models import AnalysisReport, Block, Change, Document, Finding, PreflightResult
from .temporal import extract_temporal_changes
from .worddiff import word_diff


def _aggregate_blocks(blocks: list[Block], side: str) -> Block | None:
    if not blocks:
        return None
    if len(blocks) == 1:
        return blocks[0]
    common: list[str] = []
    for parts in zip(*(block.section for block in blocks)):
        if len(set(parts)) != 1:
            break
        common.append(parts[0])
    section = tuple(common) or blocks[0].section
    text = "\n".join(block.text for block in blocks)
    normalized = "\n".join(block.normalized_text for block in blocks)
    comparison = "".join(block.comparison_text for block in blocks)
    page_values = [block.page_start for block in blocks if block.page_start is not None]
    page_end_values = [block.page_end for block in blocks if block.page_end is not None]
    paragraph_values = [block.paragraph_start for block in blocks if block.paragraph_start is not None]
    paragraph_end_values = [block.paragraph_end for block in blocks if block.paragraph_end is not None]
    char_values = [block.char_start for block in blocks if block.char_start is not None]
    char_end_values = [block.char_end for block in blocks if block.char_end is not None]
    return Block(
        block_id=make_fingerprint("BLK-GROUP", side, *(block.block_id for block in blocks)),
        section=section,
        text=text,
        normalized_text=normalized,
        comparison_text=comparison,
        ordinal=min(block.ordinal for block in blocks),
        line_start=min(block.line_start for block in blocks),
        line_end=max(block.line_end for block in blocks),
        block_type="alignment_group",
        page_start=min(page_values) if page_values else None,
        page_end=max(page_end_values) if page_end_values else None,
        paragraph_start=min(paragraph_values) if paragraph_values else None,
        paragraph_end=max(paragraph_end_values) if paragraph_end_values else None,
        char_start=min(char_values) if char_values else None,
        char_end=max(char_end_values) if char_end_values else None,
    )


def _analyze(
    old_document: Document,
    new_document: Document,
    enabled_checks: set[str] | None = None,
    waivers: Mapping[str, str | Waiver] | None = None,
) -> AnalysisReport:
    changes: list[Change] = []
    waiver_map = waivers or {}
    initial_alignments = align_documents(old_document, new_document)
    initial_mappings = derive_article_mappings(initial_alignments)
    article_map = {
        mapping.old_key: mapping.new_key
        for mapping in initial_mappings
        if mapping.status == "unique" and mapping.confidence_level in {"high", "medium"}
    }
    alignments = align_documents(old_document, new_document, article_map=article_map)
    article_mappings = derive_article_mappings(alignments)
    mappings_by_pair = {
        (mapping.old_key, mapping.new_key): mapping
        for mapping in article_mappings
    }
    for alignment in alignments:
        assert isinstance(alignment, AlignmentGroup)
        old_blocks = alignment.old_blocks
        new_blocks = alignment.new_blocks
        old_block = _aggregate_blocks(old_blocks, "old")
        new_block = _aggregate_blocks(new_blocks, "new")
        similarity = alignment.similarity
        change_type = classify_group(alignment)
        old_article = block_article(old_block)
        new_article = block_article(new_block)
        article_mapping = None
        if old_article and new_article:
            article_mapping = mappings_by_pair.get((old_article.key, new_article.key))
        change = Change(
            fingerprint=grouped_change_fingerprint(change_type, old_blocks, new_blocks),
            change_type=change_type,
            old_block=old_block,
            new_block=new_block,
            similarity=similarity,
            findings=run_checks(change_type, old_block, new_block, enabled_checks),
            old_article=old_article.label if old_article else None,
            new_article=new_article.label if new_article else None,
            article_mapping=article_mapping,
            old_blocks=old_blocks,
            new_blocks=new_blocks,
            word_diff=word_diff(old_block.text, new_block.text) if old_block and new_block else [],
            temporal_changes=extract_temporal_changes(old_block, new_block),
        )
        if (
            article_mapping
            and article_mapping.status == "unique"
            and article_mapping.old_key != article_mapping.new_key
            and (enabled_checks is None or "article-remapped" in enabled_checks)
        ):
            change.findings.append(Finding(
                fingerprint=finding_fingerprint(
                    "article-remapped",
                    old_block,
                    new_block,
                    "article",
                    article_mapping.old_article,
                    article_mapping.new_article,
                ),
                check_id="article-remapped",
                severity="info",
                breaking=False,
                summary=(
                    f"The clause maps from {article_mapping.old_article} "
                    f"to {article_mapping.new_article}."
                ),
                field="article",
                old_value=article_mapping.old_article,
                new_value=article_mapping.new_article,
                old_evidence=old_block.section_label if old_block else None,
                new_evidence=new_block.section_label if new_block else None,
                explanation=(
                    "Aligned clause evidence indicates that the article identity was retained "
                    "while its marker changed."
                ),
            ))
        elif (
            article_mapping
            and article_mapping.status != "unique"
            and (enabled_checks is None or "article-mapping-conflict" in enabled_checks)
        ):
            candidate_labels = ", ".join(
                f"{candidate.new_article} ({candidate.competition_score:.2f})"
                for candidate in article_mapping.candidates
            )
            change.findings.append(Finding(
                fingerprint=finding_fingerprint(
                    "article-mapping-conflict",
                    old_block,
                    new_block,
                    "article",
                    article_mapping.old_article,
                    candidate_labels,
                ),
                check_id="article-mapping-conflict",
                severity="medium",
                breaking=False,
                summary=f"Article mapping for {article_mapping.old_article} is not uniquely resolved.",
                field="article",
                old_value=article_mapping.old_article,
                new_value=None,
                old_evidence=old_block.section_label if old_block else None,
                new_evidence=new_block.section_label if new_block else None,
                explanation=f"Candidate targets and competition scores: {candidate_labels}.",
            ))
        for finding in change.findings:
            if finding.fingerprint in waiver_map:
                waiver = waiver_map[finding.fingerprint]
                finding.waived = True
                finding.review_state = "waived"
                if isinstance(waiver, Waiver):
                    finding.waiver_reason = waiver.reason
                    finding.waiver_approver = waiver.approver
                    finding.waiver_created_at = waiver.created_at
                    finding.waiver_expires_at = waiver.expires_at
                else:
                    finding.waiver_reason = str(waiver)
        if change.findings and all(finding.review_state == "waived" for finding in change.findings):
            change.review_state = "waived"
            change.review_note = "; ".join(
                dict.fromkeys(
                    finding.waiver_reason for finding in change.findings
                    if finding.waiver_reason
                )
            ) or None
        assign_confidence(change)
        changes.append(change)
    return AnalysisReport(
        old_document=old_document,
        new_document=new_document,
        changes=changes,
        generated_at=datetime.now(timezone.utc).isoformat(),
        article_mappings=article_mappings,
        waiver_diagnostics=list(getattr(waivers, "diagnostics", [])),
    )


def analyze_texts(
    old_text: str,
    new_text: str,
    old_path: str = "old.md",
    new_path: str = "new.md",
    language: str = "auto",
    enabled_checks: set[str] | None = None,
    waivers: Mapping[str, str | Waiver] | None = None,
) -> AnalysisReport:
    return _analyze(
        parse_text(old_text, old_path, language),
        parse_text(new_text, new_path, language),
        enabled_checks,
        waivers,
    )


def analyze_documents(
    old_path: str | Path,
    new_path: str | Path,
    language: str = "auto",
    enabled_checks: set[str] | None = None,
    waivers: Mapping[str, str | Waiver] | None = None,
) -> AnalysisReport:
    return _analyze(
        parse_document(old_path, language),
        parse_document(new_path, language),
        enabled_checks,
        waivers,
    )


def _empty_document(logical_path: str, language: str) -> Document:
    """Represent an absent Git side without pretending an empty file was parsed."""

    source_format = {
        ".md": "markdown",
        ".markdown": "markdown",
        ".txt": "text",
        ".pdf": "pdf",
        ".docx": "docx",
        ".html": "html",
        ".htm": "html",
    }.get(Path(logical_path).suffix.casefold(), "text")
    return Document(
        path=logical_path.replace("\\", "/"),
        sha256=hashlib.sha256(b"").hexdigest(),
        language="unknown" if language == "auto" else language,
        blocks=[],
        source_format=source_format,
        preflight=PreflightResult(
            source_format=source_format,
            file_size_bytes=0,
            text_coverage=0.0,
        ),
    )


def analyze_document_versions(
    old_path: str | Path | None,
    new_path: str | Path | None,
    *,
    old_logical_path: str | None = None,
    new_logical_path: str | None = None,
    language: str = "auto",
    enabled_checks: set[str] | None = None,
    waivers: Mapping[str, str | Waiver] | None = None,
) -> AnalysisReport:
    """Compare two document versions when either Git side may be absent.

    Existing files still pass through the normal PDF/DOCX/HTML/Markdown/TXT
    parser.  A missing side becomes a zero-block document, allowing additions
    and deletions to use the same deterministic alignment and finding pipeline.
    """

    if old_path is None and new_path is None:
        raise ValueError("At least one document version must exist")
    old_name = old_logical_path or str(old_path or new_path or "old.md")
    new_name = new_logical_path or str(new_path or old_path or "new.md")
    old_document = (
        parse_document(old_path, language)
        if old_path is not None
        else _empty_document(old_name, language)
    )
    new_document = (
        parse_document(new_path, language)
        if new_path is not None
        else _empty_document(new_name, language)
    )
    old_document.path = old_name.replace("\\", "/")
    new_document.path = new_name.replace("\\", "/")
    return _analyze(old_document, new_document, enabled_checks, waivers)
