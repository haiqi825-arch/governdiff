"""Explainable, deterministic breaking checks for English and Chinese policy text."""

from __future__ import annotations

import re
from dataclasses import dataclass
from difflib import SequenceMatcher

from .articles import chinese_number
from .fingerprint import finding_fingerprint
from .models import Block, Finding
from .temporal import extract_temporal_changes


@dataclass(frozen=True, slots=True)
class _Modality:
    rank: int
    label: str
    phrase: str


_MODALITY_PATTERNS: tuple[tuple[int, str, re.Pattern[str]], ...] = (
    (4, "prohibition", re.compile(r"\b(?:must\s+not|shall\s+not|is\s+prohibited|are\s+prohibited|forbidden)\b|不得|严禁|禁止", re.I)),
    (3, "mandatory", re.compile(r"\b(?:must|shall|is\s+required\s+to|are\s+required\s+to|is\s+obligated\s+to|are\s+obligated\s+to|will)\b|必须|应当|应|有义务", re.I)),
    (2, "recommended", re.compile(r"\b(?:should|is\s+expected\s+to|are\s+expected\s+to)\b|宜|建议|原则上", re.I)),
    (1, "permitted", re.compile(r"\b(?:may|can|is\s+permitted\s+to|are\s+permitted\s+to|has\s+the\s+right\s+to|have\s+the\s+right\s+to)\b|可以|可|有权", re.I)),
)

_RESTRICTION = re.compile(
    r"\b(?:must\s+not|shall\s+not|prohibited|forbidden|restricted|not\s+allowed|ban(?:ned)?|"
    r"harassment|violating\s+(?:explicitly\s+expressed\s+)?boundaries)\b|"
    r"不得|严禁|禁止|限制|违规|违反|封禁",
    re.I,
)
_PROHIBITION = re.compile(
    r"\b(?:must\s+not|shall\s+not|is\s+prohibited|are\s+prohibited|forbidden|not\s+allowed)\b|"
    r"不得|严禁|禁止",
    re.I,
)
_DUTY = re.compile(
    r"\b(?:must|shall|will|is\s+required\s+to|are\s+required\s+to|is\s+obligated\s+to|are\s+obligated\s+to|"
    r"agree\s+to|responsible\s+for|committed\s+to)\b|必须|应当|应|有义务|负责",
    re.I,
)
_RIGHT_OR_PROTECTION = re.compile(
    r"\b(?:may|can|right|permission|privacy|security|confidential|appeal|notice|consent)\b|"
    r"可以|有权|权限|隐私|安全|保密|申诉|通知|同意",
    re.I,
)
_PERMISSION = re.compile(
    r"\b(?:may|can|right|permission|appeal|consent|is\s+permitted\s+to|are\s+permitted\s+to|"
    r"has\s+the\s+right\s+to|have\s+the\s+right\s+to)\b|"
    r"可以|有权|权限|申诉|同意",
    re.I,
)
_EXCEPTION = re.compile(r"\b(?:except|unless|other\s+than|provided\s+that|notwithstanding)\b|除外|除非|但书|特殊情况", re.I)
_SCOPE_EXPANSION = re.compile(r"\b(?:all|any|everyone|including|as\s+well\s+as|and\s+also)\b|所有|任何|全体|包括|以及", re.I)
_SCOPE_LIMIT = re.compile(r"\b(?:only|solely|limited\s+to|excluding|within)\b|仅|只限|限于|不包括", re.I)
_ACTOR = re.compile(
    r"^\s*(?P<actor>[A-Z][A-Za-z -]{1,50}?|the\s+[a-z][a-z -]{1,50}?|all\s+[a-z][a-z -]{1,50}?)\s+"
    r"(?:must|shall|will|may|can|are\s+required\s+to|are\s+responsible\s+for|have\s+the\s+right)",
    re.I,
)
_ZH_ACTOR = re.compile(
    r"^\s*(?P<actor>[\u3400-\u9fffA-Za-z0-9·（）()_-]{1,40}?)\s*"
    r"(?:必须|应当|应该|应|有权|可以|可|不得|严禁|禁止)"
)
_NUMBER_WITH_UNIT = re.compile(
    r"(?P<number>\d+(?:\.\d+)?)\s*(?P<unit>business\s+days?|calendar\s+days?|days?|hours?|weeks?|months?|years?|"
    r"percent|%|日|天|小时|周|个月|月|年)",
    re.I,
)
_EFFECTIVE_DATE = re.compile(
    r"\b(?:comes?\s+into\s+force|takes?\s+effect|effective\s+(?:on|from))\b|"
    r"自.{0,40}(?:起施行|施行|生效)",
    re.I,
)
_ZH_REFERENCE = re.compile(
    r"(?:依照|根据|按照|依据|参照|见).{0,18}?第\s*([零〇一二三四五六七八九十百千万两]+|\d+)\s*条"
)
_EN_REFERENCE = re.compile(
    r"\b(?:pursuant\s+to|under|in\s+accordance\s+with|see|as\s+provided\s+in)\s+"
    r"(?P<kind>article|section)\s+(?P<number>\d+(?:\.\d+)*(?:[A-Za-z-]+)?)\b",
    re.I,
)
_NON_OPERATIVE_PREAMBLE = re.compile(
    r"^\s*(?:HAVING\s+REGARD|WHEREAS|RECOGNISING|RECOGNIZING|CONSIDERING)\b",
    re.I,
)
_MODAL_ANCHOR_TERMS = re.compile(
    r"\b(?:must\s+not|shall\s+not|must|shall|will|should|may|can|"
    r"is\s+required\s+to|are\s+required\s+to|is\s+obligated\s+to|"
    r"are\s+obligated\s+to|is\s+expected\s+to|are\s+expected\s+to)\b|"
    r"不得|严禁|禁止|必须|应当|应该|建议|原则上|可以|有权",
    re.I,
)
_EN_DEFINITION = re.compile(
    r'^\s*["“]?\s*(?P<term>[A-Za-z][A-Za-z0-9 _/-]{0,60}?)\s*["”]?\s+'
    r'(?:means?|is\s+defined\s+as|refers?\s+to)\s+(?P<value>.+?)\s*$',
    re.I,
)
_ZH_DEFINITION = re.compile(
    r"^\s*[“「]?\s*(?P<term>[\u3400-\u9fffA-Za-z0-9_-]{1,30})\s*[”」]?\s*"
    r"(?:是指|指)\s*(?P<value>.+?)\s*$"
)


def _modality(text: str) -> _Modality | None:
    text = re.sub(r"\bwon['’]t\b", "will not", text, flags=re.I)
    matches: list[_Modality] = []
    for rank, label, pattern in _MODALITY_PATTERNS:
        match = pattern.search(text)
        if match:
            matches.append(_Modality(rank, label, match.group(0)))
    return max(matches, key=lambda item: item.rank) if matches else None


def _modal_anchor_similarity(old_text: str, new_text: str) -> float:
    """Measure whether compared modal terms govern substantially the same proposition."""

    old_anchor = re.sub(r"\s+", " ", _MODAL_ANCHOR_TERMS.sub("", old_text)).strip().casefold()
    new_anchor = re.sub(r"\s+", " ", _MODAL_ANCHOR_TERMS.sub("", new_text)).strip().casefold()
    return SequenceMatcher(None, old_anchor, new_anchor).ratio()


def _actor(text: str) -> str | None:
    value = text.replace("\n", " ")
    match = _ACTOR.search(value) or _ZH_ACTOR.search(value)
    return re.sub(r"\s+", " ", match.group("actor")).strip() if match else None


def _numbers(text: str) -> dict[str, list[float]]:
    result: dict[str, list[float]] = {}
    for match in _NUMBER_WITH_UNIT.finditer(text):
        unit = match.group("unit").casefold().replace(" ", "")
        unit = re.sub(r"s$", "", unit)
        result.setdefault(unit, []).append(float(match.group("number")))
    return result


def _references(text: str) -> list[tuple[str, str]]:
    values: list[tuple[str, str]] = []
    for match in _ZH_REFERENCE.finditer(text):
        raw = match.group(1)
        number = int(raw) if raw.isdigit() else chinese_number(raw)
        if number is not None:
            values.append((f"article:{number}", f"第{raw}条"))
    for match in _EN_REFERENCE.finditer(text):
        kind = match.group("kind").casefold()
        number = match.group("number").casefold()
        values.append((f"{kind}:{number}", f"{match.group('kind').title()} {match.group('number')}"))
    return values


def _definition(text: str) -> tuple[str, str] | None:
    """Return a conservative term/value pair for an explicit definition clause."""

    value = re.sub(r"\s+", " ", text).strip()
    for pattern in (_EN_DEFINITION, _ZH_DEFINITION):
        match = pattern.match(value)
        if match:
            term = match.group("term").strip()
            definition = match.group("value").strip().rstrip("。.")
            if term and definition:
                return term, definition
    return None


def _finding(
    check_id: str,
    severity: str,
    breaking: bool,
    summary: str,
    field: str,
    old: Block | None,
    new: Block | None,
    old_value: str | None,
    new_value: str | None,
    explanation: str,
) -> Finding:
    return Finding(
        fingerprint=finding_fingerprint(check_id, old, new, field, old_value, new_value),
        check_id=check_id,
        severity=severity,
        breaking=breaking,
        summary=summary,
        field=field,
        old_value=old_value,
        new_value=new_value,
        old_evidence=old.text if old else None,
        new_evidence=new.text if new else None,
        explanation=explanation,
    )


def run_checks(
    change_type: str,
    old: Block | None,
    new: Block | None,
    enabled: set[str] | None = None,
) -> list[Finding]:
    """Evaluate explainable checks against one aligned change."""

    findings: list[Finding] = []

    def add(item: Finding) -> None:
        if enabled is None or item.check_id in enabled:
            findings.append(item)

    evidence = new or old
    if evidence and (evidence.is_noise or evidence.block_type in {"toc", "header", "footer", "page_number"}):
        add(_finding(
            "document-noise-changed", "info", False,
            "A table-of-contents or document-furniture block changed.", "document_noise",
            old, new,
            old.block_type if old else None,
            new.block_type if new else None,
            "Repeated document furniture and table-of-contents text remain auditable but do not enter high-priority review.",
        ))
        return findings

    if change_type == "added" and new:
        section_text = " ".join(new.section)
        if _PROHIBITION.search(new.text) or _PROHIBITION.search(section_text):
            match = _PROHIBITION.search(new.text)
            add(_finding(
                "prohibition-added", "high", True,
                "A new prohibition was added.", "prohibition", old, new, None,
                match.group(0) if match else section_text,
                "The added clause contains explicit prohibitive language and should be reviewed before relying on the revised policy.",
            ))
        if _RESTRICTION.search(new.text) or _RESTRICTION.search(section_text):
            add(_finding(
                "restriction-added", "high", True,
                "A new restriction or sanction was added.", "restriction", old, new, None,
                _RESTRICTION.search(new.text).group(0) if _RESTRICTION.search(new.text) else section_text,
                "New restrictive language can reduce permitted behavior or introduce a new consequence.",
            ))
        elif _DUTY.search(new.text):
            phrase = _DUTY.search(new.text).group(0)
            add(_finding(
                "duty-added", "high", True,
                "A new duty or mandatory commitment was added.", "modality", old, new, None, phrase,
                "The added clause contains language associated with an obligation or assigned responsibility.",
            ))
        if not findings:
            add(_finding(
                "policy-clause-added", "medium", False,
                "A substantive policy clause was added.", "clause", old, new, None, "added",
                "The clause has no sufficiently similar predecessor and should be reviewed for policy impact.",
            ))
        return findings

    if change_type == "removed" and old:
        if _NON_OPERATIVE_PREAMBLE.search(old.text):
            # The diff remains visible, but recital/citation deletion is not
            # presented as an operative right or protection removal.
            return findings
        if _PERMISSION.search(old.text):
            phrase = _PERMISSION.search(old.text).group(0)
            add(_finding(
                "permission-removed", "high", True,
                "An explicit permission or right may have been removed.", "permission", old, new, phrase, None,
                "The deleted clause contains explicit permission or right language and should be reviewed against the prior policy expectation.",
            ))
        if _RIGHT_OR_PROTECTION.search(old.text):
            phrase = _RIGHT_OR_PROTECTION.search(old.text).group(0)
            add(_finding(
                "protection-removed", "high", True,
                "A right, permission, or protection may have been removed.", "protection", old, new, phrase, None,
                "Removing a clause containing rights or safeguards can materially affect governed participants.",
            ))
        if not findings:
            add(_finding(
                "policy-clause-removed", "high", True,
                "A substantive policy clause was removed.", "clause", old, new, "removed", None,
                "Deletion changes the policy baseline even when no specific rule pattern can be inferred.",
            ))
        return findings

    if change_type not in {"modified", "split", "merged", "format_only"} or not old or not new:
        return findings
    if change_type == "format_only":
        return findings

    old_modality = _modality(old.text)
    new_modality = _modality(new.text)
    if (
        old_modality
        and new_modality
        and old_modality.rank != new_modality.rank
        and _modal_anchor_similarity(old.text, new.text) >= 0.58
    ):
        strengthened = new_modality.rank > old_modality.rank
        add(_finding(
            "modality-strengthened" if strengthened else "modality-weakened",
            "high",
            True,
            "Normative force was strengthened." if strengthened else "Normative force was weakened.",
            "modality", old, new, old_modality.phrase, new_modality.phrase,
            f"Detected a shift from {old_modality.label} language to {new_modality.label} language.",
        ))
    elif old_modality is None and new_modality and new_modality.rank >= 3:
        add(_finding(
            "duty-added", "high", True,
            "Mandatory language was introduced into an existing clause.", "modality", old, new, None, new_modality.phrase,
            "The revised clause introduces mandatory or prohibitive normative language.",
        ))

    old_prohibition = _PROHIBITION.search(old.text)
    new_prohibition = _PROHIBITION.search(new.text)
    if not old_prohibition and new_prohibition:
        add(_finding(
            "prohibition-added", "high", True,
            "A prohibition was introduced into an existing clause.", "prohibition", old, new,
            None, new_prohibition.group(0),
            "The revised clause introduces explicit prohibitive language and should be reviewed before relying on the revised policy.",
        ))

    old_permission = _PERMISSION.search(old.text)
    new_permission = _PERMISSION.search(new.text)
    permission_became_stronger_modality = (
        old_modality is not None
        and old_modality.rank == 1
        and new_modality is not None
        and new_modality.rank > old_modality.rank
        and _modal_anchor_similarity(old.text, new.text) >= 0.58
    )
    if old_permission and not new_permission and not permission_became_stronger_modality:
        add(_finding(
            "permission-removed", "high", True,
            "An explicit permission or right may have been removed.", "permission", old, new,
            old_permission.group(0), None,
            "Explicit permission or right language is absent from the revised clause and should be reviewed against the prior policy expectation.",
        ))

    old_definition = _definition(old.text)
    new_definition = _definition(new.text)
    if (
        old_definition
        and new_definition
        and old_definition[0].casefold() == new_definition[0].casefold()
        and old_definition[1] != new_definition[1]
    ):
        add(_finding(
            "definition-changed", "high", True,
            f'The definition of "{new_definition[0]}" changed.', "definition", old, new,
            old_definition[1], new_definition[1],
            "An explicit defined term retains its name but has different defining text; dependent clauses should be reviewed.",
        ))

    temporal_changes = extract_temporal_changes(old, new)
    for temporal in temporal_changes:
        if temporal.kind == "effective_date":
            add(_finding(
                "effective-date-shifted", "high", True,
                f"The policy effective date changed from {temporal.old_value or 'none'} to {temporal.new_value or 'none'}.",
                "effective_date", old, new, temporal.old_value, temporal.new_value,
                f"Absolute effective dates are compared separately from relative deadlines; the new date is {temporal.direction}.",
            ))
        elif temporal.kind == "deadline":
            shortened = temporal.direction == "shortened"
            add(_finding(
                "deadline-shortened" if shortened else "deadline-extended",
                "high" if shortened else "medium",
                True,
                f"A deadline changed from {temporal.old_normalized} to {temporal.new_normalized}.",
                "deadline", old, new, temporal.old_normalized, temporal.new_normalized,
                "A relative duration with the same unit appears once in both aligned clauses.",
            ))

    compares_effective_dates = bool(_EFFECTIVE_DATE.search(old.text) or _EFFECTIVE_DATE.search(new.text))
    old_numbers = {} if compares_effective_dates else _numbers(old.text)
    new_numbers = {} if compares_effective_dates else _numbers(new.text)
    for unit in sorted(old_numbers.keys() & new_numbers.keys()):
        if unit not in {"percent", "%"}:
            continue
        if len(old_numbers[unit]) != 1 or len(new_numbers[unit]) != 1:
            continue
        old_number = old_numbers[unit][0]
        new_number = new_numbers[unit][0]
        if old_number == new_number:
            continue
        add(_finding(
            "threshold-changed",
            "medium",
            True,
            f"A numeric threshold changed from {old_number:g} to {new_number:g} {unit}.",
            "numeric_value", old, new, f"{old_number:g} {unit}", f"{new_number:g} {unit}",
            "The same unit appears once in both aligned clauses, allowing a deterministic numeric comparison.",
        ))

    old_references = _references(old.text)
    new_references = _references(new.text)
    if old_references and new_references and [item[0] for item in old_references] != [item[0] for item in new_references]:
        old_labels = ", ".join(item[1] for item in old_references)
        new_labels = ", ".join(item[1] for item in new_references)
        add(_finding(
            "reference-retargeted", "medium", True,
            f"A cross-reference target changed from {old_labels} to {new_labels}.",
            "cross_reference", old, new, old_labels, new_labels,
            "Explicit article or section references changed inside an otherwise aligned clause and should be checked against the mapped target.",
        ))

    old_exception = bool(_EXCEPTION.search(old.text))
    new_exception = bool(_EXCEPTION.search(new.text))
    if old_exception != new_exception:
        added = new_exception
        old_phrase = _EXCEPTION.search(old.text).group(0) if old_exception else None
        new_phrase = _EXCEPTION.search(new.text).group(0) if new_exception else None
        add(_finding(
            "exception-added" if added else "exception-removed",
            "medium" if added else "high", True,
            "An exception was added." if added else "An exception was removed.",
            "exception", old, new, old_phrase, new_phrase,
            "Exception language changes which cases are governed by the general rule.",
        ))

    old_expansion = len(_SCOPE_EXPANSION.findall(old.text))
    new_expansion = len(_SCOPE_EXPANSION.findall(new.text))
    old_limit = len(_SCOPE_LIMIT.findall(old.text))
    new_limit = len(_SCOPE_LIMIT.findall(new.text))
    if new_expansion > old_expansion and new_limit <= old_limit:
        add(_finding(
            "scope-expanded", "high", True,
            "The governed scope may have expanded.", "scope", old, new,
            str(old_expansion), str(new_expansion),
            "The revised clause contains more universal or inclusive scope terms without more limiting terms.",
        ))
    elif new_limit > old_limit and new_expansion <= old_expansion:
        add(_finding(
            "scope-narrowed", "medium", True,
            "The governed scope may have narrowed.", "scope", old, new,
            str(old_limit), str(new_limit),
            "The revised clause contains more limiting scope terms without more universal terms.",
        ))

    old_actor = _actor(old.text)
    new_actor = _actor(new.text)
    if old_actor and new_actor and old_actor.casefold() != new_actor.casefold():
        add(_finding(
            "authority-shifted", "high", True,
            f"Responsibility or authority shifted from {old_actor} to {new_actor}.", "actor", old, new,
            old_actor, new_actor,
            "The grammatical actor attached to normative language changed in the aligned clause.",
        ))

    if not findings:
        add(_finding(
            "substantive-text-changed", "low", False,
            "The clause changed, but no configured breaking pattern was confirmed.", "text", old, new,
            "changed", "changed",
            "This is a review cue, not a claim that the policy effect changed.",
        ))
    return findings
