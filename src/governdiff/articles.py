"""Article marker parsing and evidence-backed old-to-new number remapping."""

from __future__ import annotations

import re
from collections import defaultdict
from dataclasses import dataclass

from .models import ArticleMapping, ArticleMappingCandidate, Block, confidence_level


_CHINESE_ARTICLE = re.compile(r"第\s*([零〇一二三四五六七八九十百千万两]+)\s*条")
_ENGLISH_ARTICLE = re.compile(
    r"\b(?P<kind>article|section)\s+(?P<number>\d+(?:\.\d+)*(?:[A-Za-z-]+)?)\b",
    re.IGNORECASE,
)
_DIGITS = {"零": 0, "〇": 0, "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9}
_UNITS = {"十": 10, "百": 100, "千": 1000, "万": 10000}


@dataclass(frozen=True, slots=True)
class ArticleRef:
    key: str
    label: str


def chinese_number(value: str) -> int | None:
    """Parse conventional Chinese integer numerals used in article markers."""

    if not value or any(char not in _DIGITS and char not in _UNITS for char in value):
        return None
    if all(char in _DIGITS for char in value):
        digits = "".join(str(_DIGITS[char]) for char in value)
        return int(digits)
    total = 0
    section = 0
    number = 0
    for char in value:
        if char in _DIGITS:
            number = _DIGITS[char]
            continue
        unit = _UNITS[char]
        if unit == 10000:
            section = (section + number) * unit
            total += section
            section = 0
            number = 0
        else:
            section += (number or 1) * unit
            number = 0
    return total + section + number


def article_ref(parts: tuple[str, ...] | list[str] | str) -> ArticleRef | None:
    """Return the most specific article marker present in a section path."""

    values = [parts] if isinstance(parts, str) else list(parts)
    for value in reversed(values):
        chinese = _CHINESE_ARTICLE.search(value)
        if chinese:
            number = chinese_number(chinese.group(1))
            if number is not None:
                return ArticleRef(f"article:{number}", chinese.group(0).replace(" ", ""))
        english = _ENGLISH_ARTICLE.search(value)
        if english:
            kind = english.group("kind").casefold()
            number = english.group("number").casefold()
            return ArticleRef(f"{kind}:{number}", english.group(0).strip())
    return None


def block_article(block: Block | None) -> ArticleRef | None:
    return article_ref(block.section) if block else None


def derive_article_mappings(
    alignments: list[object],
) -> list[ArticleMapping]:
    """Infer article remapping while retaining competing candidate evidence."""

    evidence: dict[tuple[str, str], list[float]] = defaultdict(list)
    labels: dict[tuple[str, str], tuple[str, str]] = {}
    by_old: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    for alignment in alignments:
        old_blocks = getattr(alignment, "old_blocks", None)
        new_blocks = getattr(alignment, "new_blocks", None)
        similarity = float(getattr(alignment, "similarity", 0.0))
        if old_blocks is None or new_blocks is None:
            old, new, similarity = alignment  # backward-compatible tuple input
            old_blocks = [old] if old else []
            new_blocks = [new] if new else []
        observed: set[tuple[str, str]] = set()
        for old in old_blocks:
            for new in new_blocks:
                old_ref = block_article(old)
                new_ref = block_article(new)
                if not old_ref or not new_ref:
                    continue
                pair = (old_ref.key, new_ref.key)
                if pair in observed:
                    continue
                observed.add(pair)
                weight = max(0.35, similarity)
                evidence[pair].append(similarity)
                labels[pair] = (old_ref.label, new_ref.label)
                by_old[old_ref.key][new_ref.key] += weight

    ranked_by_old: dict[str, list[tuple[float, str]]] = {
        old_key: sorted(
            ((weight, new_key) for new_key, weight in targets.items()),
            key=lambda item: (-item[0], item[1]),
        )
        for old_key, targets in by_old.items()
    }
    claims_by_new: dict[str, list[tuple[float, str]]] = defaultdict(list)
    for old_key, ranked in ranked_by_old.items():
        if ranked:
            claims_by_new[ranked[0][1]].append((ranked[0][0], old_key))
    for new_key in claims_by_new:
        claims_by_new[new_key].sort(key=lambda item: (-item[0], item[1]))

    mappings: list[ArticleMapping] = []
    for old_key, ranked in sorted(ranked_by_old.items()):
        if not ranked:
            continue
        top_weight, new_key = ranked[0]
        values = evidence[(old_key, new_key)]
        average = sum(values) / len(values)
        margin = 1.0 if len(ranked) == 1 else max(0.0, (ranked[0][0] - ranked[1][0]) / max(ranked[0][0], 0.01))
        target_claims = claims_by_new[new_key]
        target_winner = target_claims[0][1] == old_key
        close_target_competition = (
            len(target_claims) > 1
            and target_claims[1][0] / max(target_claims[0][0], 0.01) >= 0.82
        )
        if margin < 0.14:
            status = "ambiguous"
        elif not target_winner or close_target_competition:
            status = "conflict"
        else:
            status = "unique"
        same_marker = old_key == new_key
        score = min(
            0.99,
            (0.47 + average * 0.39 + min(len(values), 3) * 0.035 + margin * 0.055)
            + (0.04 if same_marker else 0.0),
        )
        if status != "unique":
            score = min(score, 0.61)
        reasons = [
            f"{len(values)} aligned clause pair(s) support this mapping",
            f"mean clause similarity is {average:.2f}",
        ]
        if same_marker:
            reasons.append("article marker is unchanged")
        elif status == "unique" and margin >= 0.5:
            reasons.append("no close competing target article was observed")
        elif status == "ambiguous":
            reasons.append("two or more target articles have near-equal evidence")
        elif status == "conflict":
            reasons.append("another old article competes for the same target article")
        else:
            reasons.append("a competing target article lowers certainty")
        old_label, new_label = labels[(old_key, new_key)]
        total_weight = sum(weight for weight, _ in ranked) or 1.0
        mapping_candidates: list[ArticleMappingCandidate] = []
        for rank, (weight, candidate_key) in enumerate(ranked[:5], start=1):
            candidate_values = evidence[(old_key, candidate_key)]
            _, candidate_label = labels[(old_key, candidate_key)]
            mapping_candidates.append(ArticleMappingCandidate(
                new_key=candidate_key,
                new_article=candidate_label,
                evidence_count=len(candidate_values),
                average_similarity=sum(candidate_values) / len(candidate_values),
                competition_score=weight / total_weight,
                rank=rank,
                selected=rank == 1 and status == "unique",
            ))
        mappings.append(ArticleMapping(
            old_key=old_key,
            new_key=new_key,
            old_article=old_label,
            new_article=new_label,
            evidence_count=len(values),
            average_similarity=average,
            confidence_score=score,
            confidence_level=confidence_level(score),
            confidence_reasons=reasons,
            status=status,
            competition_margin=margin,
            candidates=mapping_candidates,
        ))
    return sorted(mappings, key=lambda item: (item.old_key, item.new_key))
