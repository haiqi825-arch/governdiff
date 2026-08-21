"""Deterministic token-level differences for English and Chinese evidence."""

from __future__ import annotations

import re
from difflib import SequenceMatcher

from .models import WordDiffOperation


_TOKEN = re.compile(
    r"\s+|[\u3400-\u9fff]|[A-Za-z0-9]+(?:[’'][A-Za-z0-9]+)?|[^\w\s]",
    re.UNICODE,
)


def tokenize(text: str) -> list[str]:
    """Tokenize without losing display whitespace or punctuation."""

    return _TOKEN.findall(text)


def word_diff(old_text: str, new_text: str) -> list[WordDiffOperation]:
    """Return stable equal/insert/delete/replace spans with token offsets."""

    old_tokens = tokenize(old_text)
    new_tokens = tokenize(new_text)
    matcher = SequenceMatcher(
        None,
        [token.casefold() for token in old_tokens],
        [token.casefold() for token in new_tokens],
        # SequenceMatcher's popularity heuristic prevents quadratic behavior
        # on long policy clauses with repeated whitespace and boilerplate.
        autojunk=max(len(old_tokens), len(new_tokens)) > 240,
    )
    operations: list[WordDiffOperation] = []
    for operation, old_start, old_end, new_start, new_end in matcher.get_opcodes():
        operations.append(WordDiffOperation(
            operation=operation,
            old_text="".join(old_tokens[old_start:old_end]),
            new_text="".join(new_tokens[new_start:new_end]),
            old_start=old_start,
            old_end=old_end,
            new_start=new_start,
            new_end=new_end,
        ))
    return operations
