"""Shared Phase 5 report selection and JSON/Markdown/HTML/CSV rendering."""

from __future__ import annotations

import csv
import json
import re
from collections.abc import Callable
from dataclasses import dataclass
from html import escape as html_escape
from io import StringIO
from pathlib import Path
from typing import Any

from .models import (
    CONFIDENCE_ORDER,
    REPORT_DISCLAIMER,
    REVIEW_STATES,
    AnalysisReport,
    Change,
    Finding,
    change_section_tree,
    highest_severity,
)


FindingFilter = Callable[[Finding], bool]
REPORT_SCOPES = ("all", "breaking", "confirmed", "unreviewed", "filtered")
REDACTED_EVIDENCE_LIMIT = 160
REDACTED_VALUE_LIMIT = 80


@dataclass(frozen=True, slots=True)
class ReportSelection:
    """A serializable selection contract shared by every report renderer."""

    scope: str = "all"
    min_confidence: str = "low"
    change_types: tuple[str, ...] = ()
    checks: tuple[str, ...] = ()
    severities: tuple[str, ...] = ()
    confidence_levels: tuple[str, ...] = ()
    review_states: tuple[str, ...] = ()
    sections: tuple[str, ...] = ()
    visible_change_fingerprints: tuple[str, ...] = ()
    visible_finding_fingerprints: tuple[str, ...] = ()

    @property
    def has_filters(self) -> bool:
        return any((
            self.change_types,
            self.checks,
            self.severities,
            self.confidence_levels,
            self.review_states,
            self.sections,
            self.visible_change_fingerprints,
            self.visible_finding_fingerprints,
        ))

    def validate(self) -> None:
        if self.scope not in REPORT_SCOPES:
            raise ValueError(f"Unsupported report scope: {self.scope}")
        if self.min_confidence not in CONFIDENCE_ORDER:
            raise ValueError(f"Unsupported minimum confidence: {self.min_confidence}")
        if self.scope == "filtered" and not self.has_filters:
            raise ValueError(
                "The filtered report scope requires at least one --filter-* value "
                "or visible change IDs imported from a review file"
            )
        invalid_states = set(self.review_states).difference(REVIEW_STATES)
        if invalid_states:
            raise ValueError(
                f"Unsupported review state filter: {', '.join(sorted(invalid_states))}"
            )

    def filters_dict(self) -> dict[str, list[str]]:
        values = {
            "change_types": self.change_types,
            "checks": self.checks,
            "severities": self.severities,
            "confidence_levels": self.confidence_levels,
            "review_states": self.review_states,
            "sections": self.sections,
            "visible_change_fingerprints": self.visible_change_fingerprints,
            "visible_finding_fingerprints": self.visible_finding_fingerprints,
        }
        return {key: list(items) for key, items in values.items() if items}

    def matches(self, change: Change, finding: Finding) -> bool:
        threshold = CONFIDENCE_ORDER[self.min_confidence]
        if CONFIDENCE_ORDER.get(finding.confidence_level, 0) < threshold:
            return False
        if self.scope == "breaking" and not (finding.breaking and finding.active):
            return False
        if self.scope == "confirmed" and not (
            finding.review_state == "confirmed" and finding.active
        ):
            return False
        if self.scope == "unreviewed" and not (
            finding.review_state == "unreviewed" and finding.active
        ):
            return False
        if self.change_types and change.change_type not in self.change_types:
            return False
        if self.checks and finding.check_id not in self.checks:
            return False
        if self.severities and finding.severity not in self.severities:
            return False
        if self.confidence_levels and finding.confidence_level not in self.confidence_levels:
            return False
        if self.review_states and finding.review_state not in self.review_states:
            return False
        if self.sections and not any(
            value.casefold() in change.section_label.casefold() for value in self.sections
        ):
            return False
        if (
            self.visible_change_fingerprints
            and change.fingerprint not in self.visible_change_fingerprints
        ):
            return False
        if (
            self.visible_finding_fingerprints
            and finding.fingerprint not in self.visible_finding_fingerprints
        ):
            return False
        return True


@dataclass(slots=True)
class SelectedReport:
    selection: ReportSelection
    changes: list[tuple[Change, list[Finding]]]
    summary: dict[str, Any]

    @property
    def findings(self) -> list[Finding]:
        return [finding for _, findings in self.changes for finding in findings]


def _filtered_summary(
    report: AnalysisReport,
    changes: list[tuple[Change, list[Finding]]],
) -> dict[str, Any]:
    selected_changes = [change for change, _ in changes]
    findings = [item for _, values in changes for item in values]
    active = [item for item in findings if item.active]
    return {
        "total_changes": len(selected_changes),
        "change_types": {
            kind: sum(change.change_type == kind for change in selected_changes)
            for kind in (
                "added", "removed", "modified", "split", "merged", "moved", "format_only"
            )
        },
        "findings": len(findings),
        "active_findings": len(active),
        "breaking_findings": sum(item.breaking for item in active),
        "high_confidence_breaking_findings": sum(
            item.breaking and item.confidence_level == "high" for item in active
        ),
        "confidence": {
            "changes": {
                level: sum(change.confidence_level == level for change in selected_changes)
                for level in ("high", "medium", "low")
            },
            "findings": {
                level: sum(item.confidence_level == level for item in active)
                for level in ("high", "medium", "low")
            },
        },
        "review_states": {
            state: sum(change.review_state == state for change in selected_changes)
            for state in REVIEW_STATES
        },
        "article_mappings": len(report.article_mappings),
        "renumbered_article_mappings": sum(
            item.status == "unique" and item.old_key != item.new_key
            for item in report.article_mappings
        ),
        "article_mapping_conflicts": sum(
            item.status != "unique" for item in report.article_mappings
        ),
        "highest_severity": highest_severity([item.severity for item in active]),
    }


def select_report(
    report: AnalysisReport,
    selection: ReportSelection | None = None,
    predicate: FindingFilter | None = None,
) -> SelectedReport:
    """Select findings once so all output formats receive identical rows."""

    chosen = selection or ReportSelection(scope="filtered" if predicate else "all")
    if predicate is None:
        chosen.validate()
    changes: list[tuple[Change, list[Finding]]] = []
    pristine_all = chosen.scope == "all" and not chosen.has_filters and predicate is None
    for change in report.changes:
        if change.change_type == "unchanged":
            continue
        findings = [
            finding
            for finding in change.findings
            if chosen.matches(change, finding)
            and (predicate is None or predicate(finding))
        ]
        if findings or pristine_all:
            changes.append((change, findings))
    return SelectedReport(chosen, changes, _filtered_summary(report, changes))


def _selection_metadata(selected: SelectedReport) -> dict[str, Any]:
    return {
        "scope": selected.selection.scope,
        "minimum_confidence": selected.selection.min_confidence,
        "filters": selected.selection.filters_dict(),
        "selected_change_count": selected.summary["total_changes"],
        "selected_finding_count": selected.summary["findings"],
    }


def _compact(value: str | None, limit: int) -> str | None:
    if value is None:
        return None
    compact = " ".join(value.split())
    return compact if len(compact) <= limit else compact[: limit - 1] + "…"


def _redacted_block(value: dict[str, Any] | None) -> dict[str, Any] | None:
    if value is None:
        return None
    allowed = (
        "block_id", "section", "section_label", "evidence_label", "ordinal",
        "block_type", "page_start", "page_end", "paragraph_start", "paragraph_end",
        "line_start", "line_end", "table_id", "table_row", "table_column",
    )
    return {key: value.get(key) for key in allowed}


def _redact_report_data(data: dict[str, Any]) -> dict[str, Any]:
    for side in ("old_document", "new_document"):
        document = data[side]
        data[side] = {
            "source_name": Path(str(document.get("path", ""))).name,
            "sha256": document["sha256"],
            "language": document["language"],
            "format": document["format"],
            "imported_at": document["imported_at"],
            "block_count": document["block_count"],
            "word_count": document["word_count"],
            "table_count": document["table_count"],
            "preflight": document.get("preflight"),
        }
    for change in data["changes"]:
        change["old_block"] = _redacted_block(change.get("old_block"))
        change["new_block"] = _redacted_block(change.get("new_block"))
        change["old_blocks"] = [
            _redacted_block(value) for value in change.get("old_blocks", [])
        ]
        change["new_blocks"] = [
            _redacted_block(value) for value in change.get("new_blocks", [])
        ]
        change["word_diff"] = []
        review = change.get("review") or {}
        review["note"] = _compact(review.get("note"), REDACTED_EVIDENCE_LIMIT)
        for finding in change.get("findings", []):
            for key in (
                "old_value", "new_value", "reviewed_old_value", "reviewed_new_value"
            ):
                finding[key] = _compact(finding.get(key), REDACTED_VALUE_LIMIT)
            for group in ("machine_values", "reviewed_values", "effective_values"):
                if finding.get(group):
                    finding[group] = {
                        key: _compact(value, REDACTED_VALUE_LIMIT)
                        for key, value in finding[group].items()
                    }
            finding["old_evidence"] = _compact(
                finding.get("old_evidence"), REDACTED_EVIDENCE_LIMIT
            )
            finding["new_evidence"] = _compact(
                finding.get("new_evidence"), REDACTED_EVIDENCE_LIMIT
            )
            finding["summary"] = _compact(
                finding.get("summary"), REDACTED_EVIDENCE_LIMIT
            )
            finding["explanation"] = _compact(
                finding.get("explanation"), REDACTED_EVIDENCE_LIMIT
            )
            finding["review_note"] = _compact(
                finding.get("review_note"), REDACTED_EVIDENCE_LIMIT
            )
            finding["waiver_reason"] = _compact(
                finding.get("waiver_reason"), REDACTED_EVIDENCE_LIMIT
            )
            finding["waiver_approver"] = _compact(
                finding.get("waiver_approver"), REDACTED_VALUE_LIMIT
            )
    data["redacted"] = True
    return data


def report_data(
    report: AnalysisReport,
    selection: ReportSelection | None = None,
    *,
    predicate: FindingFilter | None = None,
    redacted: bool = False,
) -> dict[str, Any]:
    selected = select_report(report, selection, predicate)
    data = report.to_dict()
    data["unfiltered_summary"] = report.summary()
    data["summary"] = selected.summary
    data["selection"] = _selection_metadata(selected)
    data["redacted"] = redacted
    data["changes"] = []
    for change, findings in selected.changes:
        item = change.to_dict()
        item["findings"] = [finding.to_dict() for finding in findings]
        data["changes"].append(item)
    data["section_tree"] = change_section_tree(
        [change for change, _ in selected.changes]
    )
    return _redact_report_data(data) if redacted else data


def render_json(
    report: AnalysisReport,
    predicate: FindingFilter | None = None,
    *,
    selection: ReportSelection | None = None,
    redacted: bool = False,
) -> str:
    return json.dumps(
        report_data(report, selection, predicate=predicate, redacted=redacted),
        ensure_ascii=False,
        indent=2,
    ) + "\n"


def _escape_markdown(value: object) -> str:
    rendered = str(value).replace("\n", " ")
    return re.sub(r"([\\`*_{}\[\]<>()#+.!|])", r"\\\1", rendered)


def _quote(value: str | None, limit: int = 300) -> str:
    compact = _compact(value, limit)
    return compact if compact else "∅"


def _csv_safe(value: object) -> str:
    """Prevent spreadsheet formula execution while preserving visible evidence."""

    rendered = str(value)
    if rendered.lstrip().startswith(("=", "+", "-", "@")):
        return "'" + rendered
    return rendered


def _display_path(path: str, redacted: bool) -> str:
    return Path(path).name if redacted else path


def _quality_warnings(report: AnalysisReport) -> list[tuple[str, Any]]:
    return [
        ("old", issue) for issue in (
            report.old_document.preflight.issues if report.old_document.preflight else []
        )
    ] + [
        ("new", issue) for issue in (
            report.new_document.preflight.issues if report.new_document.preflight else []
        )
    ]


def render_markdown(
    report: AnalysisReport,
    predicate: FindingFilter | None = None,
    *,
    selection: ReportSelection | None = None,
    redacted: bool = False,
) -> str:
    selected = select_report(report, selection, predicate)
    evidence_limit = REDACTED_EVIDENCE_LIMIT if redacted else 300
    lines = [
        "# GovernDiff report",
        "",
        f"> {REPORT_DISCLAIMER}",
        "",
        f"- Generator: `{report.generator}`; schema `{report.schema_version}`",
        f"- Generated: `{report.generated_at}`",
        f"- Scope: `{selected.selection.scope}`; redacted: `{'yes' if redacted else 'no'}`",
        f"- Old: `{_escape_markdown(_display_path(report.old_document.path, redacted))}` (`{report.old_document.sha256}`)",
        f"- New: `{_escape_markdown(_display_path(report.new_document.path, redacted))}` (`{report.new_document.sha256}`)",
        f"- Displayed changes: **{selected.summary['total_changes']}**",
        f"- Displayed findings: **{selected.summary['findings']}**",
        f"- Displayed active findings: **{selected.summary['active_findings']}**",
        f"- Highest displayed severity: **{selected.summary['highest_severity'].upper()}**",
        "",
        "| Fingerprint | Review | Severity | Confidence | Check | Field | Machine → effective | Summary |",
        "|---|---|---:|---:|---|---|---|---|",
    ]
    if not selected.findings:
        lines.append("| — | — | — | — | — | — | — | No matching findings. |")
    for _, findings in selected.changes:
        for finding in findings:
            machine = f"{finding.old_value or '∅'} → {finding.new_value or '∅'}"
            effective = (
                f"{finding.effective_old_value or '∅'} → "
                f"{finding.effective_new_value or '∅'}"
            )
            values = machine if machine == effective else f"{machine} ⇒ {effective}"
            if redacted:
                values = _quote(values, REDACTED_VALUE_LIMIT * 2)
            lines.append(
                f"| `{finding.fingerprint}` | {finding.review_state} | {finding.severity} | "
                f"{finding.confidence_level} `{finding.confidence_score:.2f}` | "
                f"`{finding.check_id}` | `{finding.field}` | {_escape_markdown(values)} | "
                f"{_escape_markdown(_quote(finding.summary, evidence_limit))} |"
            )

    warnings = _quality_warnings(report)
    if warnings:
        lines.extend(["", "## Input quality warnings", ""])
        for side, issue in warnings:
            lines.append(
                f"- **{side} / {issue.severity.upper()} / `{issue.code}`**: "
                f"{issue.reason} Impact: {issue.impact} Next step: {issue.next_step}"
            )
    if report.waiver_diagnostics:
        lines.extend(["", "## Waiver diagnostics", ""])
        for diagnostic in report.waiver_diagnostics:
            lines.append(
                f"- **{str(diagnostic.get('severity', 'warning')).upper()} / "
                f"`{diagnostic.get('code', 'waiver-diagnostic')}`**: "
                f"{diagnostic.get('message', '')}"
            )

    for change, findings in selected.changes:
        if not findings:
            continue
        lines.extend([
            "",
            f"## `{change.fingerprint}` — {change.change_type}",
            "",
            f"Section: **{_escape_markdown(change.section_label)}** · confidence "
            f"**{change.confidence_level.upper()}** `{change.confidence_score:.2f}` · "
            f"review **{change.review_state}**",
        ])
        if change.review_note:
            lines.append(f"Reviewer note: {_escape_markdown(_quote(change.review_note, evidence_limit))}")
        for finding in findings:
            lines.extend([
                "",
                f"### `{finding.fingerprint}` · {finding.check_id} · {finding.severity.upper()}",
                "",
                _escape_markdown(_quote(finding.explanation, evidence_limit)),
                "",
                f"- Before: {_escape_markdown(_quote(finding.old_evidence, evidence_limit))}",
                f"- After: {_escape_markdown(_quote(finding.new_evidence, evidence_limit))}",
                f"- Review state: {finding.review_state}",
                f"- Machine value: {_escape_markdown(_quote(finding.old_value, REDACTED_VALUE_LIMIT if redacted else 300))} → {_escape_markdown(_quote(finding.new_value, REDACTED_VALUE_LIMIT if redacted else 300))}",
                f"- Effective value: {_escape_markdown(_quote(finding.effective_old_value, REDACTED_VALUE_LIMIT if redacted else 300))} → {_escape_markdown(_quote(finding.effective_new_value, REDACTED_VALUE_LIMIT if redacted else 300))}",
            ])
            if finding.review_note:
                lines.append(f"- Reviewer note: {_escape_markdown(_quote(finding.review_note, evidence_limit))}")
            if finding.waived:
                lines.extend([
                    f"- Waiver reason: {_escape_markdown(_quote(finding.waiver_reason, evidence_limit))}",
                    f"- Approved by: {_escape_markdown(finding.waiver_approver or 'Unknown')}",
                    f"- Created: {finding.waiver_created_at or 'Unknown'}",
                    f"- Expires: {finding.waiver_expires_at or 'Unknown'}",
                ])
    return "\n".join(lines) + "\n"


def _html_text(value: object) -> str:
    return html_escape(str(value), quote=True)


def render_html(
    report: AnalysisReport,
    predicate: FindingFilter | None = None,
    *,
    selection: ReportSelection | None = None,
    redacted: bool = False,
) -> str:
    selected = select_report(report, selection, predicate)
    evidence_limit = REDACTED_EVIDENCE_LIMIT if redacted else 1_000_000
    value_limit = REDACTED_VALUE_LIMIT if redacted else 1_000_000
    warning_html = "".join(
        "<li><strong>{side} · {severity} · {code}</strong><br>{reason} "
        "Impact: {impact} Next step: {next_step}</li>".format(
            side=_html_text(side), severity=_html_text(issue.severity.upper()),
            code=_html_text(issue.code), reason=_html_text(issue.reason),
            impact=_html_text(issue.impact), next_step=_html_text(issue.next_step),
        )
        for side, issue in _quality_warnings(report)
    )
    diagnostic_html = "".join(
        "<li><strong>{severity} · {code}</strong><br>{message}</li>".format(
            severity=_html_text(str(item.get("severity", "warning")).upper()),
            code=_html_text(item.get("code", "waiver-diagnostic")),
            message=_html_text(item.get("message", "")),
        )
        for item in report.waiver_diagnostics
    )
    change_html: list[str] = []
    for change, findings in selected.changes:
        finding_html: list[str] = []
        for finding in findings:
            badges = [
                f'<span class="badge severity-{_html_text(finding.severity)}">{_html_text(finding.severity)}</span>',
                f'<span class="badge">{_html_text(finding.confidence_level)} {finding.confidence_score:.2f}</span>',
                f'<span class="badge">{_html_text(finding.review_state)}</span>',
            ]
            waiver = ""
            if finding.waived:
                waiver = (
                    '<dl class="waiver"><dt>Waiver</dt>'
                    f'<dd>{_html_text(_quote(finding.waiver_reason, evidence_limit))}</dd>'
                    f'<dt>Approved by</dt><dd>{_html_text(finding.waiver_approver or "Unknown")}</dd>'
                    f'<dt>Created</dt><dd>{_html_text(finding.waiver_created_at or "Unknown")}</dd>'
                    f'<dt>Expires</dt><dd>{_html_text(finding.waiver_expires_at or "Unknown")}</dd></dl>'
                )
            finding_html.append(
                f'<section class="finding" data-finding-fingerprint="{_html_text(finding.fingerprint)}">'
                f'<div class="finding-head"><div><p class="eyebrow">{_html_text(finding.check_id)} · {_html_text(finding.field)}</p>'
                f'<h3>{_html_text(_quote(finding.summary, evidence_limit))}</h3></div>'
                f'<div class="badges">{"".join(badges)}</div></div>'
                f'<p>{_html_text(_quote(finding.explanation, evidence_limit))}</p>'
                '<div class="evidence-grid">'
                f'<blockquote><span>Before</span>{_html_text(_quote(finding.old_evidence, evidence_limit))}</blockquote>'
                f'<blockquote><span>After</span>{_html_text(_quote(finding.new_evidence, evidence_limit))}</blockquote>'
                '</div><dl class="values">'
                f'<dt>Machine</dt><dd>{_html_text(_quote(finding.old_value, value_limit))} → {_html_text(_quote(finding.new_value, value_limit))}</dd>'
                f'<dt>Effective</dt><dd>{_html_text(_quote(finding.effective_old_value, value_limit))} → {_html_text(_quote(finding.effective_new_value, value_limit))}</dd>'
                f'</dl>{waiver}</section>'
            )
        if not finding_html:
            continue
        change_html.append(
            f'<article class="change" data-change-fingerprint="{_html_text(change.fingerprint)}">'
            f'<header><p class="eyebrow">{_html_text(change.change_type)} · {_html_text(change.fingerprint)}</p>'
            f'<h2>{_html_text(change.section_label)}</h2>'
            f'<p>Alignment confidence {change.confidence_level} {change.confidence_score:.2f} · review {change.review_state}</p></header>'
            f'{"".join(finding_html)}</article>'
        )
    if not change_html:
        change_html.append(
            '<section class="empty"><h2>No matching findings</h2>'
            '<p>The selected scope produced zero finding rows.</p></section>'
        )
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GovernDiff report</title>
  <style>
    :root {{ color-scheme: light; --ink:#17231d; --muted:#607168; --paper:#f4f2eb; --card:#fffef9; --line:#d7ddd7; --accent:#146c4a; --high:#a63424; --medium:#9a6500; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--ink); background:var(--paper); line-height:1.55; }}
    main {{ width:min(1120px,calc(100% - 32px)); margin:0 auto; padding:48px 0 72px; }}
    .hero {{ padding:34px; color:white; background:linear-gradient(135deg,#123e31,#1d684f); border-radius:22px; box-shadow:0 18px 50px #183c2a24; }}
    .hero h1 {{ margin:.1em 0; font-size:clamp(2rem,6vw,4.6rem); letter-spacing:-.055em; }}
    .hero p {{ max-width:820px; }}
    .eyebrow {{ margin:0; color:var(--muted); font-size:.76rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }}
    .hero .eyebrow {{ color:#c7e7d8; }}
    .meta {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; margin:18px 0; }}
    .meta div,.stat,.notice,.change,.empty {{ background:var(--card); border:1px solid var(--line); border-radius:16px; }}
    .meta div {{ padding:14px 16px; overflow-wrap:anywhere; }}
    .meta dt,.values dt,.waiver dt {{ color:var(--muted); font-size:.75rem; font-weight:800; text-transform:uppercase; }}
    .meta dd,.values dd,.waiver dd {{ margin:4px 0 0; }}
    .stats {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin:24px 0; }}
    .stat {{ padding:18px; }} .stat strong {{ display:block; font-size:2rem; }}
    .notice {{ padding:18px 22px; margin:18px 0; }} .notice ul {{ margin-bottom:0; }}
    .change {{ margin:24px 0; overflow:hidden; }} .change>header {{ padding:22px 24px; border-bottom:1px solid var(--line); }}
    .change h2,.finding h3 {{ margin:.25rem 0; }}
    .finding {{ padding:22px 24px; border-bottom:1px solid var(--line); }} .finding:last-child {{ border-bottom:0; }}
    .finding-head {{ display:flex; justify-content:space-between; gap:20px; align-items:flex-start; }}
    .badges {{ display:flex; flex-wrap:wrap; gap:6px; justify-content:flex-end; }}
    .badge {{ padding:3px 9px; border-radius:999px; background:#edf1ed; font-size:.76rem; font-weight:800; text-transform:uppercase; white-space:nowrap; }}
    .severity-high,.severity-critical {{ color:#8b281c; background:#ffe4df; }} .severity-medium {{ color:#755000; background:#fff0c5; }}
    .evidence-grid {{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }}
    blockquote {{ margin:0; padding:16px; background:#f5f7f3; border-left:4px solid var(--accent); border-radius:8px; overflow-wrap:anywhere; }}
    blockquote span {{ display:block; margin-bottom:7px; color:var(--muted); font-size:.75rem; font-weight:800; text-transform:uppercase; }}
    .values,.waiver {{ display:grid; grid-template-columns:110px 1fr; gap:7px 12px; margin:16px 0 0; }}
    .empty {{ padding:32px; text-align:center; }}
    footer {{ margin-top:34px; padding-top:20px; border-top:1px solid var(--line); color:var(--muted); font-size:.9rem; }}
    @media (max-width:700px) {{ .evidence-grid {{ grid-template-columns:1fr; }} .finding-head {{ display:block; }} .badges {{ justify-content:flex-start; margin-top:10px; }} }}
    @media print {{ body {{ background:white; }} main {{ width:100%; padding:0; }} .hero {{ box-shadow:none; }} .change {{ break-inside:avoid; }} }}
  </style>
</head>
<body>
<main>
  <header class="hero"><p class="eyebrow">GovernDiff · audit report</p><h1>Policy change review</h1><p>{_html_text(REPORT_DISCLAIMER)}</p></header>
  <dl class="meta">
    <div><dt>Generator</dt><dd>{_html_text(report.generator)} · schema {_html_text(report.schema_version)}</dd></div>
    <div><dt>Generated</dt><dd>{_html_text(report.generated_at)}</dd></div>
    <div><dt>Scope</dt><dd>{_html_text(selected.selection.scope)} · redacted {'yes' if redacted else 'no'}</dd></div>
    <div><dt>Old document</dt><dd>{_html_text(_display_path(report.old_document.path, redacted))}<br>{_html_text(report.old_document.sha256)}</dd></div>
    <div><dt>New document</dt><dd>{_html_text(_display_path(report.new_document.path, redacted))}<br>{_html_text(report.new_document.sha256)}</dd></div>
  </dl>
  <section aria-labelledby="overview"><h2 id="overview">Overview</h2><div class="stats">
    <div class="stat"><span>Changes</span><strong>{selected.summary['total_changes']}</strong></div>
    <div class="stat"><span>Findings</span><strong>{selected.summary['findings']}</strong></div>
    <div class="stat"><span>Active</span><strong>{selected.summary['active_findings']}</strong></div>
    <div class="stat"><span>Breaking</span><strong>{selected.summary['breaking_findings']}</strong></div>
  </div></section>
  {f'<section class="notice"><h2>Input quality warnings</h2><ul>{warning_html}</ul></section>' if warning_html else ''}
  {f'<section class="notice"><h2>Waiver diagnostics</h2><ul>{diagnostic_html}</ul></section>' if diagnostic_html else ''}
  <section aria-labelledby="changes"><h2 id="changes">Changes and evidence</h2>{''.join(change_html)}</section>
  <footer>{_html_text(REPORT_DISCLAIMER)} Generated by {_html_text(report.generator)}.</footer>
</main>
</body>
</html>
'''


CSV_FIELDS = (
    "schema_version", "generator", "generated_at", "disclaimer", "redacted", "scope",
    "old_sha256", "new_sha256", "change_fingerprint", "change_type", "section",
    "finding_fingerprint", "review_state", "active", "breaking", "severity",
    "confidence_level", "confidence_score", "check_id", "field", "machine_old_value",
    "machine_new_value", "effective_old_value", "effective_new_value", "summary",
    "explanation", "old_evidence", "new_evidence", "waiver_reason",
    "waiver_approved_by", "waiver_created_at", "waiver_expires_at",
)


def render_csv(
    report: AnalysisReport,
    predicate: FindingFilter | None = None,
    *,
    selection: ReportSelection | None = None,
    redacted: bool = False,
) -> str:
    selected = select_report(report, selection, predicate)
    output = StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=CSV_FIELDS, lineterminator="\n")
    writer.writeheader()
    evidence_limit = REDACTED_EVIDENCE_LIMIT if redacted else 1_000_000
    value_limit = REDACTED_VALUE_LIMIT if redacted else 1_000_000
    for change, findings in selected.changes:
        for finding in findings:
            writer.writerow({key: _csv_safe(value) for key, value in {
                "schema_version": report.schema_version,
                "generator": report.generator,
                "generated_at": report.generated_at,
                "disclaimer": REPORT_DISCLAIMER,
                "redacted": str(redacted).lower(),
                "scope": selected.selection.scope,
                "old_sha256": report.old_document.sha256,
                "new_sha256": report.new_document.sha256,
                "change_fingerprint": change.fingerprint,
                "change_type": change.change_type,
                "section": change.section_label,
                "finding_fingerprint": finding.fingerprint,
                "review_state": finding.review_state,
                "active": str(finding.active).lower(),
                "breaking": str(finding.breaking).lower(),
                "severity": finding.severity,
                "confidence_level": finding.confidence_level,
                "confidence_score": f"{finding.confidence_score:.4f}",
                "check_id": finding.check_id,
                "field": finding.field,
                "machine_old_value": _quote(finding.old_value, value_limit),
                "machine_new_value": _quote(finding.new_value, value_limit),
                "effective_old_value": _quote(finding.effective_old_value, value_limit),
                "effective_new_value": _quote(finding.effective_new_value, value_limit),
                "summary": _quote(finding.summary, evidence_limit),
                "explanation": _quote(finding.explanation, evidence_limit),
                "old_evidence": _quote(finding.old_evidence, evidence_limit),
                "new_evidence": _quote(finding.new_evidence, evidence_limit),
                "waiver_reason": _quote(finding.waiver_reason, evidence_limit) if finding.waiver_reason else "",
                "waiver_approved_by": _quote(finding.waiver_approver, value_limit) if finding.waiver_approver else "",
                "waiver_created_at": finding.waiver_created_at or "",
                "waiver_expires_at": finding.waiver_expires_at or "",
            }.items()})
    return output.getvalue()
