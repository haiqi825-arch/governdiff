"""Explainable confidence scoring shared by reports, CI, and reviewer UI."""

from __future__ import annotations

from .models import Change, confidence_level


_CHECK_SPECIFICITY = {
    "article-mapping-conflict": 0.92,
    "document-noise-changed": 0.98,
    "deadline-shortened": 0.96,
    "deadline-extended": 0.94,
    "effective-date-shifted": 0.97,
    "reference-retargeted": 0.95,
    "threshold-changed": 0.94,
    "modality-strengthened": 0.92,
    "modality-weakened": 0.90,
    "exception-added": 0.91,
    "exception-removed": 0.91,
    "definition-changed": 0.95,
    "authority-shifted": 0.86,
    "restriction-added": 0.90,
    "duty-added": 0.88,
    "protection-removed": 0.86,
    "permission-removed": 0.91,
    "prohibition-added": 0.94,
    "scope-expanded": 0.74,
    "scope-narrowed": 0.72,
    "policy-clause-added": 0.66,
    "policy-clause-removed": 0.66,
    "substantive-text-changed": 0.48,
}


def assign_confidence(change: Change) -> None:
    """Attach deterministic score layers and reasons to a change and its findings."""

    if change.change_type == "unchanged":
        score = 0.99
        reasons = ["normalized clause text is identical"]
    elif change.change_type in {"moved", "format_only"}:
        score = 0.97
        reasons = ["clause text has an exact or formatting-only match"]
    elif change.change_type in {"split", "merged"}:
        score = 0.31 + (0.60 * change.similarity)
        reasons = [
            f"{change.change_type} alignment similarity is {change.similarity:.2f}",
            f"{len(change.old_blocks)} old block(s) align to {len(change.new_blocks)} new block(s)",
        ]
    elif change.old_block is not None and change.new_block is not None:
        score = 0.35 + (0.60 * change.similarity)
        reasons = [f"paired-clause similarity is {change.similarity:.2f}"]
    else:
        score = 0.72
        reasons = ["the clause is one-sided after global alignment"]

    if change.article_mapping:
        mapping = change.article_mapping
        if mapping.status == "unique":
            score += 0.05 * mapping.confidence_score
            reasons.append(
                f"article mapping {mapping.old_article} → {mapping.new_article} is {mapping.confidence_level} confidence"
            )
        else:
            score -= 0.10
            reasons.append(f"article mapping is unresolved ({mapping.status})")
    elif change.old_article and change.new_article and change.old_article != change.new_article:
        score -= 0.08
        reasons.append("article numbers differ without a supported remapping")

    change.confidence_score = min(0.99, max(0.0, score))
    change.confidence_level = confidence_level(change.confidence_score)
    change.confidence_reasons = reasons
    if change.confidence_level == "low" or (
        change.article_mapping and change.article_mapping.status != "unique"
    ):
        change.alignment_status = "needs-review"

    for finding in change.findings:
        if finding.check_id == "article-remapped" and change.article_mapping:
            finding.confidence_score = change.article_mapping.confidence_score
            finding.confidence_level = change.article_mapping.confidence_level
            finding.confidence_reasons = list(change.article_mapping.confidence_reasons)
            continue
        specificity = _CHECK_SPECIFICITY.get(finding.check_id, 0.60)
        finding_score = (change.confidence_score * 0.55) + (specificity * 0.45)
        finding.confidence_score = min(0.99, max(0.0, finding_score))
        finding.confidence_level = confidence_level(finding.confidence_score)
        finding.confidence_reasons = [
            f"parent change is {change.confidence_level} confidence ({change.confidence_score:.2f})",
            f"{finding.check_id} rule specificity is {specificity:.2f}",
        ]
