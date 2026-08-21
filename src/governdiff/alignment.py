"""Deterministic one-to-one, split, and merged clause alignment."""

from __future__ import annotations

from dataclasses import dataclass
from difflib import SequenceMatcher
from typing import Iterator

from .articles import block_article
from .models import Block, Document


@dataclass(slots=True)
class AlignmentGroup:
    old_blocks: list[Block]
    new_blocks: list[Block]
    similarity: float
    relationship: str

    @property
    def old_block(self) -> Block | None:
        return self.old_blocks[0] if self.old_blocks else None

    @property
    def new_block(self) -> Block | None:
        return self.new_blocks[0] if self.new_blocks else None

    def __iter__(self) -> Iterator[Block | float | None]:
        # Preserve the original tuple-shaped public API for existing callers.
        yield self.old_block
        yield self.new_block
        yield self.similarity

    def __getitem__(self, index: int | slice):
        return (self.old_block, self.new_block, self.similarity)[index]

    def __len__(self) -> int:
        return 3


def _section_similarity(old: Block, new: Block, article_map: dict[str, str] | None = None) -> float:
    left = " / ".join(old.section).casefold()
    right = " / ".join(new.section).casefold()
    if not left and not right:
        return 1.0
    score = SequenceMatcher(None, left, right).ratio()
    old_article = block_article(old)
    new_article = block_article(new)
    if (
        article_map
        and old_article
        and new_article
        and article_map.get(old_article.key) == new_article.key
    ):
        return max(score, 0.98)
    return score


def _position_similarity(old: Block, new: Block, old_count: int, new_count: int) -> float:
    old_position = old.ordinal / max(1, old_count - 1)
    new_position = new.ordinal / max(1, new_count - 1)
    return max(0.0, 1.0 - abs(old_position - new_position))


def block_similarity(
    old: Block,
    new: Block,
    old_count: int,
    new_count: int,
    article_map: dict[str, str] | None = None,
) -> float:
    text_score = SequenceMatcher(None, old.comparison_text, new.comparison_text).ratio()
    section_score = _section_similarity(old, new, article_map)
    position_score = _position_similarity(old, new, old_count, new_count)
    return (text_score * 0.76) + (section_score * 0.16) + (position_score * 0.08)


def _join_text(blocks: list[Block]) -> str:
    return "".join(block.comparison_text for block in blocks)


def _group_similarity(
    old_blocks: list[Block],
    new_blocks: list[Block],
    old_count: int,
    new_count: int,
    article_map: dict[str, str] | None,
) -> float:
    text_score = SequenceMatcher(None, _join_text(old_blocks), _join_text(new_blocks)).ratio()
    section_scores = [
        _section_similarity(old, new, article_map)
        for old in old_blocks
        for new in new_blocks
    ]
    section_score = max(section_scores) if section_scores else 0.0
    position_score = _position_similarity(
        old_blocks[len(old_blocks) // 2],
        new_blocks[len(new_blocks) // 2],
        old_count,
        new_count,
    )
    return (text_score * 0.86) + (section_score * 0.10) + (position_score * 0.04)


def _eligible_group(blocks: list[Block]) -> bool:
    if not blocks or any(block.is_noise or block.block_type == "table_cell" for block in blocks):
        return False
    return all(block.comparison_text for block in blocks)


def _plausible_group(old_blocks: list[Block], new_blocks: list[Block]) -> bool:
    left = _join_text(old_blocks)
    right = _join_text(new_blocks)
    if not left or not right:
        return False
    length_ratio = min(len(left), len(right)) / max(len(left), len(right))
    if length_ratio < 0.52:
        return False
    matcher = SequenceMatcher(None, left, right)
    return matcher.real_quick_ratio() >= 0.62 and matcher.quick_ratio() >= 0.56


def _consecutive_runs(
    indices: set[int],
    centers: set[int] | None = None,
    maximum: int = 3,
    radius: int = 2,
) -> list[tuple[int, ...]]:
    runs: list[tuple[int, ...]] = []
    starts = sorted(indices)
    if centers:
        starts = [
            start for start in starts
            if any(abs(start - center) <= radius for center in centers)
        ]
    for start in starts:
        for length in range(2, maximum + 1):
            candidate = tuple(range(start, start + length))
            if all(index in indices for index in candidate):
                runs.append(candidate)
    return runs


def _group_candidates(
    old_blocks: list[Block],
    new_blocks: list[Block],
    unmatched_old: set[int],
    unmatched_new: set[int],
    article_map: dict[str, str] | None,
    threshold: float,
    pair_scores: dict[tuple[int, int], float],
) -> list[tuple[float, str, tuple[int, ...], tuple[int, ...]]]:
    candidates: list[tuple[float, str, tuple[int, ...], tuple[int, ...]]] = []
    for old_index in sorted(unmatched_old):
        old_group = [old_blocks[old_index]]
        if not _eligible_group(old_group):
            continue
        projected = round(old_index / max(1, len(old_blocks) - 1) * max(0, len(new_blocks) - 1))
        section_matches = {
            index for index in unmatched_new
            if old_blocks[old_index].section == new_blocks[index].section
        }
        section_matches = set(sorted(section_matches, key=lambda index: abs(index - projected))[:3])
        new_runs = _consecutive_runs(unmatched_new, {projected, *section_matches})
        for new_indices in new_runs:
            new_group = [new_blocks[index] for index in new_indices]
            if not _eligible_group(new_group) or not _plausible_group(old_group, new_group):
                continue
            score = _group_similarity(old_group, new_group, len(old_blocks), len(new_blocks), article_map)
            best_single = max(pair_scores[(old_index, index)] for index in new_indices)
            text_score = SequenceMatcher(None, _join_text(old_group), _join_text(new_group)).ratio()
            if score >= threshold and (score >= best_single + 0.06 or text_score >= 0.86):
                candidates.append((score, "split", (old_index,), new_indices))

    for new_index in sorted(unmatched_new):
        new_group = [new_blocks[new_index]]
        if not _eligible_group(new_group):
            continue
        projected = round(new_index / max(1, len(new_blocks) - 1) * max(0, len(old_blocks) - 1))
        section_matches = {
            index for index in unmatched_old
            if new_blocks[new_index].section == old_blocks[index].section
        }
        section_matches = set(sorted(section_matches, key=lambda index: abs(index - projected))[:3])
        old_runs = _consecutive_runs(unmatched_old, {projected, *section_matches})
        for old_indices in old_runs:
            old_group = [old_blocks[index] for index in old_indices]
            if not _eligible_group(old_group) or not _plausible_group(old_group, new_group):
                continue
            score = _group_similarity(old_group, new_group, len(old_blocks), len(new_blocks), article_map)
            best_single = max(pair_scores[(index, new_index)] for index in old_indices)
            text_score = SequenceMatcher(None, _join_text(old_group), _join_text(new_group)).ratio()
            if score >= threshold and (score >= best_single + 0.06 or text_score >= 0.86):
                candidates.append((score, "merged", old_indices, (new_index,)))
    return candidates


def align_documents(
    old_document: Document,
    new_document: Document,
    threshold: float = 0.52,
    article_map: dict[str, str] | None = None,
    group_threshold: float = 0.62,
) -> list[AlignmentGroup]:
    """Return ordered one-to-one, split/merged, and one-sided alignments."""

    old_blocks = old_document.blocks
    new_blocks = new_document.blocks
    unmatched_old = set(range(len(old_blocks)))
    unmatched_new = set(range(len(new_blocks)))
    groups: list[AlignmentGroup] = []

    new_exact: dict[str, list[int]] = {}
    for index, block in enumerate(new_blocks):
        new_exact.setdefault(block.normalized_text, []).append(index)

    for old_index, old_block in enumerate(old_blocks):
        candidates = [index for index in new_exact.get(old_block.normalized_text, []) if index in unmatched_new]
        if not candidates:
            continue
        new_index = min(candidates, key=lambda index: abs(index - old_index))
        groups.append(AlignmentGroup([old_block], [new_blocks[new_index]], 1.0, "paired"))
        unmatched_old.discard(old_index)
        unmatched_new.discard(new_index)

    pair_scores = {
        (old_index, new_index): block_similarity(
            old_blocks[old_index],
            new_blocks[new_index],
            len(old_blocks),
            len(new_blocks),
            article_map,
        )
        for old_index in unmatched_old
        for new_index in unmatched_new
    }

    group_candidates = _group_candidates(
        old_blocks,
        new_blocks,
        unmatched_old,
        unmatched_new,
        article_map,
        group_threshold,
        pair_scores,
    )
    for score, relationship, old_indices, new_indices in sorted(
        group_candidates,
        key=lambda item: (-item[0], item[2], item[3], item[1]),
    ):
        if any(index not in unmatched_old for index in old_indices):
            continue
        if any(index not in unmatched_new for index in new_indices):
            continue
        groups.append(AlignmentGroup(
            [old_blocks[index] for index in old_indices],
            [new_blocks[index] for index in new_indices],
            score,
            relationship,
        ))
        unmatched_old.difference_update(old_indices)
        unmatched_new.difference_update(new_indices)

    candidates: list[tuple[float, int, int]] = [
        (score, old_index, new_index)
        for (old_index, new_index), score in pair_scores.items()
        if old_index in unmatched_old and new_index in unmatched_new and score >= threshold
    ]

    for score, old_index, new_index in sorted(candidates, key=lambda item: (-item[0], item[1], item[2])):
        if old_index not in unmatched_old or new_index not in unmatched_new:
            continue
        groups.append(AlignmentGroup([old_blocks[old_index]], [new_blocks[new_index]], score, "paired"))
        unmatched_old.remove(old_index)
        unmatched_new.remove(new_index)

    groups.extend(AlignmentGroup([old_blocks[index]], [], 0.0, "removed") for index in unmatched_old)
    groups.extend(AlignmentGroup([], [new_blocks[index]], 0.0, "added") for index in unmatched_new)

    def order_key(item: AlignmentGroup) -> tuple[int, int]:
        primary = item.new_block.ordinal if item.new_block else (item.old_block.ordinal if item.old_block else 0)
        return primary, 0 if item.old_blocks and item.new_blocks else 1

    return sorted(groups, key=order_key)


def classify_alignment(old: Block | None, new: Block | None) -> str:
    if old is None:
        return "added"
    if new is None:
        return "removed"
    if old.normalized_text == new.normalized_text:
        if old.section != new.section or old.ordinal != new.ordinal:
            return "moved"
        return "unchanged"
    if old.comparison_text == new.comparison_text:
        if old.section != new.section or old.ordinal != new.ordinal:
            return "moved"
        return "format_only"
    return "modified"


def classify_group(group: AlignmentGroup) -> str:
    if group.relationship in {"split", "merged", "added", "removed"}:
        return group.relationship
    return classify_alignment(group.old_block, group.new_block)
