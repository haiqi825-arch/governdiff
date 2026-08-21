"""Structured effective-date and relative-deadline extraction."""

from __future__ import annotations

import re
from datetime import date

from .articles import chinese_number
from .models import Block, TemporalChange


_EFFECTIVE_CONTEXT = re.compile(
    r"\b(?:comes?\s+into\s+force|takes?\s+effect|effective\s+(?:on|from)|"
    r"shall\s+be\s+effective)\b|(?:自|于).{0,48}(?:起施行|施行|生效)",
    re.I,
)
_ISO_DATE = re.compile(r"\b(?P<year>20\d{2})[-/.](?P<month>0?[1-9]|1[0-2])[-/.](?P<day>0?[1-9]|[12]\d|3[01])\b")
_ZH_DATE = re.compile(r"(?P<year>20\d{2})\s*年\s*(?P<month>0?[1-9]|1[0-2])\s*月\s*(?P<day>0?[1-9]|[12]\d|3[01])\s*日")
_EN_DATE = re.compile(
    r"\b(?:(?P<month_name>January|February|March|April|May|June|July|August|September|October|November|December)\s+"
    r"(?P<day_name>\d{1,2})(?:st|nd|rd|th)?,?\s+(?P<year_name>20\d{2})|"
    r"(?P<day_first>\d{1,2})\s+(?P<month_first>January|February|March|April|May|June|July|August|September|October|November|December)\s+(?P<year_first>20\d{2}))\b",
    re.I,
)
_MONTHS = {
    name.casefold(): index
    for index, name in enumerate(
        ("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"),
        start=1,
    )
}
_UNIT_DISPLAY = {
    "businessday": "business days",
    "calendarday": "calendar days",
    "day": "days",
    "hour": "hours",
    "week": "weeks",
    "month": "months",
    "year": "years",
}
_DEADLINE = re.compile(
    r"(?P<number>\d+(?:\.\d+)?)\s*(?P<unit>business\s+days?|calendar\s+days?|days?|hours?|weeks?|months?|years?|"
    r"工作日|日|天|小时|周|个月|月|年)(?:\s+(?:after|from|before|within))?|"
    r"(?:在|于|自).{0,24}?(?P<zh_number>\d+(?:\.\d+)?|[零〇一二两三四五六七八九十百千万]+)\s*"
    r"(?P<zh_unit>工作日|日|天|小时|周|个月|月|年)(?:内|前|后)",
    re.I,
)


def _date_value(text: str) -> tuple[str, str] | None:
    for pattern in (_ISO_DATE, _ZH_DATE):
        match = pattern.search(text)
        if match:
            try:
                value = date(int(match.group("year")), int(match.group("month")), int(match.group("day")))
            except ValueError:
                return None
            return match.group(0), value.isoformat()
    match = _EN_DATE.search(text)
    if not match:
        return None
    if match.group("month_name"):
        month = _MONTHS[match.group("month_name").casefold()]
        day = int(match.group("day_name"))
        year = int(match.group("year_name"))
    else:
        month = _MONTHS[match.group("month_first").casefold()]
        day = int(match.group("day_first"))
        year = int(match.group("year_first"))
    try:
        value = date(year, month, day)
    except ValueError:
        return None
    return match.group(0), value.isoformat()


def effective_date(text: str) -> tuple[str, str] | None:
    if not _EFFECTIVE_CONTEXT.search(text):
        return None
    return _date_value(text)


def _deadline_values(text: str) -> dict[str, tuple[str, float]]:
    if _EFFECTIVE_CONTEXT.search(text):
        return {}
    values: dict[str, list[tuple[str, float]]] = {}
    for match in _DEADLINE.finditer(text):
        raw_number = match.group("number") or match.group("zh_number")
        raw_unit = match.group("unit") or match.group("zh_unit")
        unit = raw_unit.casefold().replace(" ", "")
        unit = re.sub(r"s$", "", unit)
        if re.fullmatch(r"[零〇一二两三四五六七八九十百千万]+", raw_number):
            parsed = chinese_number(raw_number)
            if parsed is None:
                continue
            number = float(parsed)
        else:
            number = float(raw_number)
        values.setdefault(unit, []).append((match.group(0), number))
    return {unit: items[0] for unit, items in values.items() if len(items) == 1}


def extract_temporal_changes(old: Block | None, new: Block | None) -> list[TemporalChange]:
    if old is None or new is None:
        return []
    changes: list[TemporalChange] = []
    old_effective = effective_date(old.text)
    new_effective = effective_date(new.text)
    if old_effective or new_effective:
        old_raw, old_normalized = old_effective or (None, None)
        new_raw, new_normalized = new_effective or (None, None)
        if old_normalized != new_normalized:
            if old_normalized is None:
                direction = "added"
            elif new_normalized is None:
                direction = "removed"
            elif new_normalized < old_normalized:
                direction = "earlier"
            else:
                direction = "later"
            changes.append(TemporalChange(
                kind="effective_date",
                old_value=old_raw,
                new_value=new_raw,
                old_normalized=old_normalized,
                new_normalized=new_normalized,
                direction=direction,
                old_evidence=old.text,
                new_evidence=new.text,
            ))

    old_deadlines = _deadline_values(old.text)
    new_deadlines = _deadline_values(new.text)
    for unit in sorted(old_deadlines.keys() & new_deadlines.keys()):
        old_raw, old_number = old_deadlines[unit]
        new_raw, new_number = new_deadlines[unit]
        if old_number == new_number:
            continue
        changes.append(TemporalChange(
            kind="deadline",
            old_value=old_raw,
            new_value=new_raw,
            old_normalized=f"{old_number:g} {_UNIT_DISPLAY.get(unit, unit)}",
            new_normalized=f"{new_number:g} {_UNIT_DISPLAY.get(unit, unit)}",
            direction="shortened" if new_number < old_number else "extended",
            old_evidence=old.text,
            new_evidence=new.text,
        ))
    return changes
