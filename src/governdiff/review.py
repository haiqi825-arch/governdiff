"""Import Reviewer decisions and apply them to an in-memory analysis report."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Mapping

from .alignment import AlignmentGroup, classify_group
from .articles import block_article
from .checks import run_checks
from .confidence import assign_confidence
from .engine import _aggregate_blocks
from .fingerprint import grouped_change_fingerprint
from .models import AnalysisReport, Block, Change, Finding, REVIEW_STATES
from .temporal import extract_temporal_changes
from .worddiff import word_diff


_LEGACY_STATES = {"accepted": "confirmed", "false-positive": "rejected"}


def _normalized_state(value: object) -> str:
    state = _LEGACY_STATES.get(str(value), str(value))
    if state not in REVIEW_STATES:
        raise ValueError(f"Unsupported review state: {value}")
    return state


def load_review(source: str | Path | Mapping[str, Any]) -> dict[str, Any]:
    if isinstance(source, Mapping):
        return dict(source)
    path = Path(source)
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    if not isinstance(data, dict):
        raise ValueError("Review JSON must contain an object at the top level")
    return data


def _decisions(data: Mapping[str, Any]) -> list[dict[str, Any]]:
    raw = data.get("decisions", [])
    if isinstance(raw, Mapping):
        return [
            {"change_fingerprint": fingerprint, **(value if isinstance(value, dict) else {})}
            for fingerprint, value in raw.items()
        ]
    if isinstance(raw, list):
        return [item for item in raw if isinstance(item, dict)]
    raise ValueError("Review decisions must be an array or fingerprint-keyed object")


def _manual_change(
    old_blocks: list[Block],
    new_blocks: list[Block],
    enabled_checks: set[str] | None = None,
) -> Change:
    old_block = _aggregate_blocks(old_blocks, "old-review")
    new_block = _aggregate_blocks(new_blocks, "new-review")
    if old_block and new_block:
        similarity = SequenceMatcher(
            None, old_block.comparison_text, new_block.comparison_text
        ).ratio()
    else:
        similarity = 0.0
    relationship = (
        "removed" if old_blocks and not new_blocks else
        "added" if new_blocks and not old_blocks else
        "split" if len(old_blocks) == 1 and len(new_blocks) > 1 else
        "merged" if len(old_blocks) > 1 and len(new_blocks) == 1 else
        "manual"
    )
    group = AlignmentGroup(old_blocks, new_blocks, similarity, relationship)
    change_type = classify_group(group)
    old_article = block_article(old_block)
    new_article = block_article(new_block)
    change = Change(
        fingerprint=grouped_change_fingerprint(change_type, old_blocks, new_blocks),
        change_type=change_type,
        old_block=old_block,
        new_block=new_block,
        similarity=similarity,
        findings=run_checks(change_type, old_block, new_block, enabled_checks),
        old_article=old_article.label if old_article else None,
        new_article=new_article.label if new_article else None,
        old_blocks=old_blocks,
        new_blocks=new_blocks,
        word_diff=word_diff(old_block.text, new_block.text) if old_block and new_block else [],
        temporal_changes=extract_temporal_changes(old_block, new_block),
        alignment_status="human-corrected",
    )
    assign_confidence(change)
    return change


def _apply_alignment_overrides(
    report: AnalysisReport,
    overrides: object,
    enabled_checks: set[str] | None = None,
) -> tuple[dict[str, list[Change]], int]:
    if not isinstance(overrides, list):
        return {}, 0
    old_index = {block.block_id: block for block in report.old_document.blocks}
    new_index = {block.block_id: block for block in report.new_document.blocks}
    aliases: dict[str, list[Change]] = {}
    applied = 0

    for item in overrides:
        if not isinstance(item, dict):
            continue
        original = str(item.get("original_change_fingerprint", ""))
        action = str(item.get("action", ""))
        original_change = next(
            (change for change in report.changes if change.fingerprint == original), None
        )
        if not original or action not in {"unlink", "relink"} or original_change is None:
            continue
        old_ids = [str(value) for value in item.get("old_block_ids", [])]
        new_ids = [str(value) for value in item.get("new_block_ids", [])]
        old_blocks = [old_index[value] for value in old_ids if value in old_index]
        new_blocks = [new_index[value] for value in new_ids if value in new_index]
        if action == "relink" and (not old_blocks or not new_blocks):
            raise ValueError(f"Relink {original} must select old and new blocks")

        consumed_old = set(old_ids)
        consumed_new = set(new_ids)
        report.changes = [
            change for change in report.changes
            if change.fingerprint != original and not (
                action == "relink" and (
                    consumed_old.intersection(block.block_id for block in change.old_blocks)
                    or consumed_new.intersection(block.block_id for block in change.new_blocks)
                )
            )
        ]
        if action == "relink":
            replacements = [_manual_change(old_blocks, new_blocks, enabled_checks)]
        else:
            replacements = [
                *[_manual_change([block], [], enabled_checks) for block in old_blocks],
                *[_manual_change([], [block], enabled_checks) for block in new_blocks],
            ]
        for replacement in replacements:
            replacement.review_state = original_change.review_state
            replacement.review_note = original_change.review_note
            replacement.review_updated_at = original_change.review_updated_at
        report.changes.extend(replacements)
        aliases[original] = replacements
        applied += 1
    report.changes.sort(
        key=lambda change: min(
            [block.ordinal for block in change.new_blocks]
            or [block.ordinal for block in change.old_blocks]
            or [10**9]
        )
    )
    return aliases, applied


def _apply_decision(change: Change, decision: Mapping[str, Any]) -> None:
    state = _normalized_state(decision.get("state", "unreviewed"))
    note = str(decision.get("note", "")).strip() or None
    updated_at = str(
        decision.get("updated_at") or decision.get("updatedAt") or ""
    ).strip() or None
    change.review_state = state
    change.review_note = note
    change.review_updated_at = updated_at
    for finding in change.findings:
        finding.review_state = state
        finding.review_note = note
        finding.review_updated_at = updated_at
        if state == "waived":
            finding.waived = True
            finding.waiver_reason = note or finding.waiver_reason


def _all_field_edits(data: Mapping[str, Any], decisions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    edits = [item for item in data.get("field_edits", []) if isinstance(item, dict)]
    for decision in decisions:
        for item in decision.get("field_edits", []):
            if isinstance(item, dict):
                edits.append({"change_fingerprint": decision.get("change_fingerprint"), **item})
    return edits


def _apply_field_edit(report: AnalysisReport, edit: Mapping[str, Any]) -> bool:
    finding_id = str(edit.get("finding_fingerprint", ""))
    change_id = str(edit.get("change_fingerprint", ""))
    for change in report.changes:
        if change_id and change.fingerprint != change_id:
            continue
        for finding in change.findings:
            if finding_id and finding.fingerprint != finding_id:
                continue
            if edit.get("field") and str(edit["field"]) != finding.field:
                continue
            finding.reviewed_old_value = (
                edit.get("reviewed_old_value")
                if "reviewed_old_value" in edit else finding.old_value
            )
            finding.reviewed_new_value = (
                edit.get("reviewed_new_value")
                if "reviewed_new_value" in edit else finding.new_value
            )
            finding.field_modified = True
            terminal_state = change.review_state if change.review_state in {"rejected", "waived"} else None
            finding.review_state = terminal_state or "modified"
            finding.review_note = str(edit.get("note", "")).strip() or finding.review_note
            finding.review_updated_at = str(
                edit.get("updated_at") or edit.get("updatedAt") or ""
            ).strip() or finding.review_updated_at
            change.review_state = terminal_state or "modified"
            change.review_note = finding.review_note or change.review_note
            change.review_updated_at = finding.review_updated_at or change.review_updated_at
            return True
    return False


def apply_review(
    report: AnalysisReport,
    source: str | Path | Mapping[str, Any],
    enabled_checks: set[str] | None = None,
) -> AnalysisReport:
    """Apply a portable Reviewer export and return the mutated report."""

    data = load_review(source)
    schema = str(data.get("schema_version", ""))
    if schema not in {"governdiff-review/1.0", "governdiff-review/1.1"}:
        raise ValueError(f"Unsupported review schema: {schema or '(missing)'}")
    identity = data.get("report", {})
    if not isinstance(identity, Mapping):
        raise ValueError("Review report identity must be an object")
    expected = {
        "old_sha256": report.old_document.sha256,
        "new_sha256": report.new_document.sha256,
    }
    for key, value in expected.items():
        supplied = str(identity.get(key, ""))
        if supplied and supplied != value:
            raise ValueError(f"Review {key} does not match the analyzed documents")

    decisions = _decisions(data)
    decision_index = {
        str(item.get("change_fingerprint", "")): item for item in decisions
        if item.get("change_fingerprint")
    }
    for change in report.changes:
        decision = decision_index.get(change.fingerprint)
        if decision:
            _apply_decision(change, decision)

    aliases, alignment_count = _apply_alignment_overrides(
        report, data.get("alignment_overrides", []), enabled_checks
    )
    for original, replacements in aliases.items():
        decision = decision_index.get(original)
        if decision:
            for replacement in replacements:
                _apply_decision(replacement, decision)

    field_count = 0
    for edit in _all_field_edits(data, decisions):
        applied = _apply_field_edit(report, edit)
        original = str(edit.get("change_fingerprint", ""))
        if not applied and original in aliases:
            for replacement in aliases[original]:
                fallback = dict(edit)
                fallback["change_fingerprint"] = replacement.fingerprint
                fallback.pop("finding_fingerprint", None)
                if _apply_field_edit(report, fallback):
                    applied = True
                    break
        field_count += int(applied)
    raw = json.dumps(data, ensure_ascii=False, sort_keys=True).encode("utf-8")
    report.review_import = {
        "schema_version": schema,
        "applied_at": datetime.now(timezone.utc).isoformat(),
        "source_sha256": hashlib.sha256(raw).hexdigest(),
        "decisions_applied": sum(
            1 for key in decision_index
            if any(change.fingerprint == key for change in report.changes) or key in aliases
        ),
        "field_edits_applied": field_count,
        "alignment_overrides_applied": alignment_count,
        "visible_change_fingerprints": [
            str(value)
            for value in (
                data.get("filters", {}).get("visible_change_fingerprints", [])
                if isinstance(data.get("filters"), Mapping) else []
            )
        ],
    }
    return report
