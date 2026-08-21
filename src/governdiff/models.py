"""Core data types shared across parsing, alignment, checks, and reports."""

from __future__ import annotations

import hashlib
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any


SEVERITY_ORDER = {"info": 0, "low": 1, "medium": 2, "high": 3, "critical": 4}
CONFIDENCE_ORDER = {"low": 0, "medium": 1, "high": 2}
REVIEW_STATES = ("unreviewed", "confirmed", "rejected", "modified", "waived")
REPORT_DISCLAIMER = (
    "GovernDiff provides machine-assisted document comparison and review cues. "
    "It does not constitute legal advice, a policy-effect assessment, or a "
    "compliance determination. Important changes must be verified by a person "
    "with the appropriate responsibility and expertise."
)


@dataclass(slots=True)
class InputIssue:
    """Actionable preflight result with a stable machine code."""

    code: str
    severity: str
    reason: str
    impact: str
    next_step: str
    page_number: int | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class DocumentInputError(ValueError):
    """Raised when a source document cannot safely enter comparison."""

    def __init__(self, issue: InputIssue):
        self.issue = issue
        super().__init__(
            f"[{issue.code}] {issue.reason} "
            f"Impact: {issue.impact} Next step: {issue.next_step}"
        )


@dataclass(slots=True)
class PreflightResult:
    source_format: str
    file_size_bytes: int
    status: str = "ok"
    page_count: int | None = None
    paragraph_count: int = 0
    word_count: int = 0
    character_count: int = 0
    text_coverage: float | None = None
    blank_pages: list[int] = field(default_factory=list)
    encrypted: bool = False
    suspected_scanned: bool = False
    has_garbled_text: bool = False
    issues: list[InputIssue] = field(default_factory=list)

    def add(self, issue: InputIssue) -> None:
        self.issues.append(issue)
        if issue.severity == "error":
            self.status = "error"
        elif issue.severity == "warning" and self.status == "ok":
            self.status = "warning"

    def to_dict(self) -> dict[str, Any]:
        value = asdict(self)
        if self.text_coverage is not None:
            value["text_coverage"] = round(self.text_coverage, 4)
        return value


@dataclass(slots=True)
class TableCell:
    cell_id: str
    table_id: str
    row_index: int
    column_index: int
    text: str
    row_span: int = 1
    column_span: int = 1
    is_header: bool = False
    page_number: int | None = None
    paragraph_index: int | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class Table:
    table_id: str
    ordinal: int
    row_count: int
    column_count: int
    cells: list[TableCell] = field(default_factory=list)
    page_number: int | None = None
    paragraph_index: int | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "table_id": self.table_id,
            "ordinal": self.ordinal,
            "row_count": self.row_count,
            "column_count": self.column_count,
            "page_number": self.page_number,
            "paragraph_index": self.paragraph_index,
            "cells": [cell.to_dict() for cell in self.cells],
        }


def highest_severity(values: list[str], default: str = "info") -> str:
    """Return the highest normalized severity in *values*."""

    return max(values or [default], key=lambda value: SEVERITY_ORDER.get(value, 0))


def confidence_level(score: float) -> str:
    """Convert a deterministic 0..1 score into a stable review layer."""

    if score >= 0.80:
        return "high"
    if score >= 0.62:
        return "medium"
    return "low"


@dataclass(slots=True)
class ArticleMappingCandidate:
    new_key: str
    new_article: str
    evidence_count: int
    average_similarity: float
    competition_score: float
    rank: int
    selected: bool = False

    def to_dict(self) -> dict[str, Any]:
        value = asdict(self)
        value["average_similarity"] = round(self.average_similarity, 4)
        value["competition_score"] = round(self.competition_score, 4)
        return value


@dataclass(slots=True)
class ArticleMapping:
    old_key: str
    new_key: str
    old_article: str
    new_article: str
    evidence_count: int
    average_similarity: float
    confidence_score: float
    confidence_level: str
    confidence_reasons: list[str] = field(default_factory=list)
    status: str = "unique"
    competition_margin: float = 1.0
    candidates: list[ArticleMappingCandidate] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        value = asdict(self)
        value["average_similarity"] = round(self.average_similarity, 4)
        value["confidence_score"] = round(self.confidence_score, 4)
        value["competition_margin"] = round(self.competition_margin, 4)
        value["candidates"] = [candidate.to_dict() for candidate in self.candidates]
        return value


@dataclass(slots=True)
class WordDiffOperation:
    operation: str
    old_text: str
    new_text: str
    old_start: int
    old_end: int
    new_start: int
    new_end: int

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class TemporalChange:
    kind: str
    old_value: str | None
    new_value: str | None
    old_normalized: str | None
    new_normalized: str | None
    direction: str
    old_evidence: str | None
    new_evidence: str | None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class Block:
    block_id: str
    section: tuple[str, ...]
    text: str
    normalized_text: str
    comparison_text: str
    ordinal: int
    line_start: int
    line_end: int
    block_type: str = "paragraph"
    page_start: int | None = None
    page_end: int | None = None
    paragraph_start: int | None = None
    paragraph_end: int | None = None
    char_start: int | None = None
    char_end: int | None = None
    list_level: int | None = None
    table_id: str | None = None
    table_row: int | None = None
    table_column: int | None = None
    is_noise: bool = False

    @property
    def section_label(self) -> str:
        return " > ".join(self.section) if self.section else "(document root)"

    @property
    def evidence_label(self) -> str:
        values: list[str] = []
        if self.page_start is not None:
            page = str(self.page_start)
            if self.page_end is not None and self.page_end != self.page_start:
                page += f"-{self.page_end}"
            values.append(f"page {page}")
        if self.paragraph_start is not None:
            paragraph = str(self.paragraph_start)
            if self.paragraph_end is not None and self.paragraph_end != self.paragraph_start:
                paragraph += f"-{self.paragraph_end}"
            values.append(f"paragraph {paragraph}")
        if self.table_id is not None:
            values.append(
                f"{self.table_id} r{(self.table_row or 0) + 1}c{(self.table_column or 0) + 1}"
            )
        if self.char_start is not None and self.char_end is not None:
            values.append(f"chars {self.char_start}-{self.char_end}")
        if not values and self.line_start:
            values.append(f"line {self.line_start}")
        return " · ".join(values) if values else "location unavailable"

    def to_dict(self) -> dict[str, Any]:
        value = asdict(self)
        value["section"] = list(self.section)
        value["section_label"] = self.section_label
        value["evidence_label"] = self.evidence_label
        return value


@dataclass(slots=True)
class Document:
    path: str
    sha256: str
    language: str
    blocks: list[Block]
    source_format: str = "text"
    tables: list[Table] = field(default_factory=list)
    preflight: PreflightResult | None = None
    imported_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    def metadata(self) -> dict[str, Any]:
        return {
            "path": self.path,
            "sha256": self.sha256,
            "language": self.language,
            "format": self.source_format,
            "imported_at": self.imported_at,
            "block_count": len(self.blocks),
            "word_count": sum(len(block.text.split()) for block in self.blocks),
            "table_count": len(self.tables),
            "section_tree": document_section_tree(self.blocks),
            "tables": [table.to_dict() for table in self.tables],
            "preflight": self.preflight.to_dict() if self.preflight else None,
        }


@dataclass(slots=True)
class Finding:
    fingerprint: str
    check_id: str
    severity: str
    breaking: bool
    summary: str
    field: str
    old_value: str | None
    new_value: str | None
    old_evidence: str | None
    new_evidence: str | None
    explanation: str
    confidence_score: float = 0.0
    confidence_level: str = "low"
    confidence_reasons: list[str] = field(default_factory=list)
    waived: bool = False
    waiver_reason: str | None = None
    waiver_approver: str | None = None
    waiver_created_at: str | None = None
    waiver_expires_at: str | None = None
    review_state: str = "unreviewed"
    review_note: str | None = None
    review_updated_at: str | None = None
    reviewed_old_value: str | None = None
    reviewed_new_value: str | None = None
    field_modified: bool = False

    @property
    def active(self) -> bool:
        return not self.waived and self.review_state not in {"rejected", "waived"}

    @property
    def effective_old_value(self) -> str | None:
        return self.reviewed_old_value if self.field_modified else self.old_value

    @property
    def effective_new_value(self) -> str | None:
        return self.reviewed_new_value if self.field_modified else self.new_value

    def to_dict(self) -> dict[str, Any]:
        value = asdict(self)
        value["machine_values"] = {"old": self.old_value, "new": self.new_value}
        value["reviewed_values"] = (
            {"old": self.reviewed_old_value, "new": self.reviewed_new_value}
            if self.field_modified else None
        )
        value["effective_values"] = {
            "old": self.effective_old_value,
            "new": self.effective_new_value,
        }
        value["active"] = self.active
        return value


@dataclass(slots=True)
class Change:
    fingerprint: str
    change_type: str
    old_block: Block | None
    new_block: Block | None
    similarity: float
    findings: list[Finding] = field(default_factory=list)
    old_article: str | None = None
    new_article: str | None = None
    article_mapping: ArticleMapping | None = None
    confidence_score: float = 0.0
    confidence_level: str = "low"
    confidence_reasons: list[str] = field(default_factory=list)
    old_blocks: list[Block] = field(default_factory=list)
    new_blocks: list[Block] = field(default_factory=list)
    word_diff: list[WordDiffOperation] = field(default_factory=list)
    temporal_changes: list[TemporalChange] = field(default_factory=list)
    alignment_status: str = "automatic"
    review_state: str = "unreviewed"
    review_note: str | None = None
    review_updated_at: str | None = None

    def __post_init__(self) -> None:
        if not self.old_blocks and self.old_block is not None:
            self.old_blocks = [self.old_block]
        if not self.new_blocks and self.new_block is not None:
            self.new_blocks = [self.new_block]

    @property
    def severity(self) -> str:
        return highest_severity([item.severity for item in self.findings])

    @property
    def section_label(self) -> str:
        block = self.new_block or self.old_block
        return block.section_label if block else "(document root)"

    @property
    def section_path(self) -> tuple[str, ...]:
        block = self.new_block or self.old_block
        return block.section if block else ()

    def to_dict(self) -> dict[str, Any]:
        return {
            "fingerprint": self.fingerprint,
            "change_type": self.change_type,
            "similarity": round(self.similarity, 4),
            "severity": self.severity,
            "section": self.section_label,
            "section_path": list(self.section_path),
            "section_id": section_id(self.section_path),
            "old_article": self.old_article,
            "new_article": self.new_article,
            "article_mapping": self.article_mapping.to_dict() if self.article_mapping else None,
            "confidence_score": round(self.confidence_score, 4),
            "confidence_level": self.confidence_level,
            "confidence_reasons": self.confidence_reasons,
            "alignment_status": self.alignment_status,
            "review": {
                "state": self.review_state,
                "note": self.review_note,
                "updated_at": self.review_updated_at,
            },
            "old_block": self.old_block.to_dict() if self.old_block else None,
            "new_block": self.new_block.to_dict() if self.new_block else None,
            "old_blocks": [block.to_dict() for block in self.old_blocks],
            "new_blocks": [block.to_dict() for block in self.new_blocks],
            "word_diff": [operation.to_dict() for operation in self.word_diff],
            "temporal_changes": [change.to_dict() for change in self.temporal_changes],
            "findings": [finding.to_dict() for finding in self.findings],
        }


def section_id(path: tuple[str, ...] | list[str]) -> str:
    label = "\x1f".join(path) if path else "document-root"
    digest = hashlib.sha256(label.casefold().encode("utf-8")).hexdigest()[:10].upper()
    return f"SEC-{digest}"


def document_section_tree(blocks: list[Block]) -> list[dict[str, Any]]:
    roots: list[dict[str, Any]] = []
    index: dict[tuple[str, ...], dict[str, Any]] = {}
    for block in blocks:
        path = block.section or ("(document root)",)
        for depth in range(1, len(path) + 1):
            current = tuple(path[:depth])
            node = index.get(current)
            if node is None:
                node = {
                    "section_id": section_id(current),
                    "title": current[-1],
                    "path": list(current),
                    "depth": depth,
                    "block_count": 0,
                    "block_ids": [],
                    "children": [],
                }
                index[current] = node
                if depth == 1:
                    roots.append(node)
                else:
                    index[current[:-1]]["children"].append(node)
            node["block_count"] += 1
            if depth == len(path):
                node["block_ids"].append(block.block_id)
    return roots


def change_section_tree(changes: list[Change]) -> list[dict[str, Any]]:
    roots: list[dict[str, Any]] = []
    index: dict[tuple[str, ...], dict[str, Any]] = {}
    for change in changes:
        if change.change_type == "unchanged":
            continue
        path = change.section_path or ("(document root)",)
        breaking = any(item.breaking and item.active for item in change.findings)
        for depth in range(1, len(path) + 1):
            current = tuple(path[:depth])
            node = index.get(current)
            if node is None:
                node = {
                    "section_id": section_id(current),
                    "title": current[-1],
                    "path": list(current),
                    "depth": depth,
                    "change_count": 0,
                    "breaking_count": 0,
                    "change_types": {},
                    "confidence": {"high": 0, "medium": 0, "low": 0},
                    "children": [],
                }
                index[current] = node
                if depth == 1:
                    roots.append(node)
                else:
                    index[current[:-1]]["children"].append(node)
            node["change_count"] += 1
            node["breaking_count"] += int(breaking)
            node["change_types"][change.change_type] = (
                node["change_types"].get(change.change_type, 0) + 1
            )
            node["confidence"][change.confidence_level] += 1
    return roots


@dataclass(slots=True)
class AnalysisReport:
    old_document: Document
    new_document: Document
    changes: list[Change]
    generated_at: str
    article_mappings: list[ArticleMapping] = field(default_factory=list)
    schema_version: str = "1.5"
    generator: str = "governdiff/0.6.0"
    review_import: dict[str, Any] | None = None
    waiver_diagnostics: list[dict[str, Any]] = field(default_factory=list)

    def summary(self) -> dict[str, Any]:
        changed = [change for change in self.changes if change.change_type != "unchanged"]
        findings = [finding for change in changed for finding in change.findings]
        active = [finding for finding in findings if finding.active]
        return {
            "total_changes": len(changed),
            "change_types": {
                kind: sum(change.change_type == kind for change in changed)
                for kind in ("added", "removed", "modified", "split", "merged", "moved", "format_only")
            },
            "findings": len(findings),
            "active_findings": len(active),
            "breaking_findings": sum(item.breaking for item in active),
            "high_confidence_breaking_findings": sum(
                item.breaking and item.confidence_level == "high" for item in active
            ),
            "review_states": {
                state: sum(change.review_state == state for change in changed)
                for state in REVIEW_STATES
            },
            "confidence": {
                "changes": {
                    level: sum(change.confidence_level == level for change in changed)
                    for level in ("high", "medium", "low")
                },
                "findings": {
                    level: sum(item.confidence_level == level for item in active)
                    for level in ("high", "medium", "low")
                },
            },
            "article_mappings": len(self.article_mappings),
            "renumbered_article_mappings": sum(
                mapping.status == "unique" and mapping.old_key != mapping.new_key
                for mapping in self.article_mappings
            ),
            "article_mapping_conflicts": sum(
                mapping.status != "unique" for mapping in self.article_mappings
            ),
            "highest_severity": highest_severity([item.severity for item in active]),
        }

    def to_dict(self) -> dict[str, Any]:
        return {
            "schema_version": self.schema_version,
            "generator": self.generator,
            "generated_at": self.generated_at,
            "disclaimer": REPORT_DISCLAIMER,
            "selection": {
                "scope": "all",
                "filters": {},
                "selected_change_count": self.summary()["total_changes"],
                "selected_finding_count": self.summary()["findings"],
            },
            "redacted": False,
            "review_import": self.review_import,
            "waiver_diagnostics": self.waiver_diagnostics,
            "old_document": self.old_document.metadata(),
            "new_document": self.new_document.metadata(),
            "summary": self.summary(),
            "article_mappings": [mapping.to_dict() for mapping in self.article_mappings],
            "section_tree": change_section_tree(self.changes),
            "changes": [change.to_dict() for change in self.changes],
        }
