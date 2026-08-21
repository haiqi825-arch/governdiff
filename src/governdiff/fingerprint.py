"""Stable identifiers for reviewable changes and findings."""

from __future__ import annotations

import hashlib
import re
import unicodedata

from .models import Block


def _stable(value: str | None) -> str:
    if value is None:
        return ""
    normalized = unicodedata.normalize("NFKC", value).casefold()
    return re.sub(r"\s+", " ", normalized).strip()


def make_fingerprint(prefix: str, *parts: str | None) -> str:
    payload = "\x1f".join(_stable(part) for part in parts)
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()[:10].upper()
    return f"{prefix}-{digest}"


def change_fingerprint(change_type: str, old: Block | None, new: Block | None) -> str:
    block = new or old
    section = " / ".join(block.section) if block else "document-root"
    return make_fingerprint(
        "GVC",
        change_type,
        section,
        old.comparison_text if old else None,
        new.comparison_text if new else None,
    )


def grouped_change_fingerprint(
    change_type: str,
    old_blocks: list[Block],
    new_blocks: list[Block],
) -> str:
    """Return a movement-stable fingerprint for one-to-many alignments."""

    block = (new_blocks or old_blocks or [None])[0]
    section = " / ".join(block.section) if block else "document-root"
    return make_fingerprint(
        "GVC",
        change_type,
        section,
        "\x1e".join(item.comparison_text for item in old_blocks),
        "\x1e".join(item.comparison_text for item in new_blocks),
    )


def finding_fingerprint(
    check_id: str,
    old: Block | None,
    new: Block | None,
    field: str,
    old_value: str | None,
    new_value: str | None,
) -> str:
    block = new or old
    section = " / ".join(block.section) if block else "document-root"
    # Clause content disambiguates repeated checks in the same section. Values and
    # headings remain first-class inputs so line movement and formatting do not
    # affect the identifier.
    return make_fingerprint(
        "GVD",
        check_id,
        section,
        field,
        old_value,
        new_value,
        old.comparison_text if old else None,
        new.comparison_text if new else None,
    )
