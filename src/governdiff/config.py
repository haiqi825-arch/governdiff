"""Small, dependency-free loader for GovernDiff JSON and conventional YAML config."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

from .models import CONFIDENCE_ORDER, REVIEW_STATES, SEVERITY_ORDER


DEFAULT_CHECKS = {
    "article-mapping-conflict",
    "article-remapped",
    "authority-shifted",
    "deadline-extended",
    "deadline-shortened",
    "effective-date-shifted",
    "duty-added",
    "document-noise-changed",
    "exception-added",
    "exception-removed",
    "definition-changed",
    "modality-strengthened",
    "modality-weakened",
    "policy-clause-added",
    "policy-clause-removed",
    "permission-removed",
    "prohibition-added",
    "protection-removed",
    "reference-retargeted",
    "restriction-added",
    "scope-expanded",
    "scope-narrowed",
    "substantive-text-changed",
    "threshold-changed",
}


@dataclass(slots=True)
class DocumentSpec:
    path: str
    language: str = "auto"


@dataclass(slots=True)
class Config:
    version: int = 1
    documents: list[DocumentSpec] = field(default_factory=list)
    enabled_checks: set[str] = field(default_factory=lambda: set(DEFAULT_CHECKS))
    fail_on: str = "high"
    min_confidence: str = "medium"
    waivers_path: str | None = ".governdiff-waivers.yml"
    require_waiver_reason: bool = True
    report_scope: str = "all"
    report_redacted: bool = False
    report_change_types: tuple[str, ...] = ()
    report_checks: tuple[str, ...] = ()
    report_severities: tuple[str, ...] = ()
    report_confidence_levels: tuple[str, ...] = ()
    report_review_states: tuple[str, ...] = ()
    report_sections: tuple[str, ...] = ()


@dataclass(frozen=True, slots=True)
class Waiver:
    fingerprint: str
    reason: str
    approver: str | None = None
    created_at: str | None = None
    expires_at: str | None = None
    reference: str | None = None

    def is_expired(self, now: datetime | None = None) -> bool:
        if not self.expires_at:
            return False
        reference = now or datetime.now(timezone.utc)
        raw = self.expires_at.strip()
        try:
            if "T" in raw:
                expiry = datetime.fromisoformat(raw.replace("Z", "+00:00"))
                if expiry.tzinfo is None:
                    expiry = expiry.replace(tzinfo=timezone.utc)
                return expiry <= reference
            return date.fromisoformat(raw) < reference.date()
        except ValueError as error:
            raise ValueError(
                f"Waiver {self.fingerprint} has an invalid expires_at value: {raw}"
            ) from error


class WaiverCollection(dict[str, Waiver]):
    """Active waivers plus non-fatal diagnostics for ignored entries."""

    def __init__(
        self,
        *args: Any,
        diagnostics: list[dict[str, Any]] | None = None,
        **kwargs: Any,
    ) -> None:
        super().__init__(*args, **kwargs)
        self.diagnostics = diagnostics or []


_TOP_LEVEL_FIELDS = {"version", "documents", "checks", "review", "report"}
_DOCUMENT_FIELDS = {"path", "language"}
_CHECK_FIELDS = {"enabled", "fail_on", "min_confidence"}
_REVIEW_FIELDS = {"waivers", "require_reason"}
_REPORT_FIELDS = {
    "scope", "redacted", "change_types", "checks", "severities",
    "confidence_levels", "review_states", "sections",
}
_REPORT_SCOPES = {"all", "breaking", "confirmed", "unreviewed", "filtered"}
_CHANGE_TYPES = {"added", "removed", "modified", "split", "merged", "moved", "format_only"}


def _config_error(reason: str, impact: str, next_step: str) -> ValueError:
    return ValueError(f"{reason} Impact: {impact} Next step: {next_step}")


def _unknown_fields(data: dict[str, Any], allowed: set[str], context: str) -> None:
    unknown = sorted(set(map(str, data)).difference(allowed))
    if unknown:
        raise ValueError(
            f"Unknown {context} field(s): {', '.join(unknown)}. "
            "Impact: the configuration was not applied. "
            "Next step: remove the field or use a supported config schema version."
        )


def _string_list(value: Any, context: str) -> list[str]:
    if value is None:
        return []
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        raise ValueError(
            f"{context} must be a list of strings. "
            "Impact: the configuration was not applied. "
            "Next step: use a YAML/JSON array with one string per item."
        )
    return value


def _validate_mapping(data: dict[str, Any]) -> None:
    if not isinstance(data, dict):
        raise _config_error(
            "The config root must be an object.",
            "No configuration was applied.",
            "Provide a YAML or JSON mapping with version: 1.",
        )
    _unknown_fields(data, _TOP_LEVEL_FIELDS, "top-level")
    version = data.get("version", 1)
    if not isinstance(version, int) or isinstance(version, bool) or version != 1:
        raise _config_error(
            f"Unsupported config version: {version}.",
            "The configuration was not applied.",
            "Use the integer version 1 and migrate any older shape.",
        )

    documents = data.get("documents") or []
    if not isinstance(documents, list):
        raise _config_error(
            "documents must be an array of path/language objects.",
            "No configured document selection was applied.",
            "Use a YAML/JSON list with one path/language object per document pattern.",
        )
    for index, item in enumerate(documents):
        if not isinstance(item, dict):
            raise _config_error(
                f"documents[{index}] must be an object.",
                "That document selector was not applied.",
                "Provide path and optional language fields in an object.",
            )
        _unknown_fields(item, _DOCUMENT_FIELDS, f"documents[{index}]")
        path = item.get("path")
        if not isinstance(path, str) or not path.strip():
            raise _config_error(
                f"documents[{index}].path must be a non-empty string.",
                "Document selection is undefined.",
                "Set path to a repository-relative path or glob.",
            )
        if "\x00" in path or path.count("[") != path.count("]"):
            raise ValueError(
                f"documents[{index}].path is not a valid glob. "
                "Impact: document selection is ambiguous. Next step: fix the path pattern."
            )
        language = str(item.get("language", "auto")).casefold()
        if language not in {"auto", "en", "zh"}:
            raise ValueError(
                f"Unsupported document language: {language}. "
                "Impact: language-specific parsing was not applied. Next step: use auto, en, or zh."
            )

    checks = data.get("checks") or {}
    review = data.get("review") or {}
    report = data.get("report") or {}
    for context, value, allowed in (
        ("checks", checks, _CHECK_FIELDS),
        ("review", review, _REVIEW_FIELDS),
        ("report", report, _REPORT_FIELDS),
    ):
        if not isinstance(value, dict):
            raise _config_error(
                f"{context} must be an object.",
                f"The {context} configuration was not applied.",
                f"Use a YAML/JSON mapping for {context}.",
            )
        _unknown_fields(value, allowed, context)

    enabled = _string_list(checks.get("enabled"), "checks.enabled")
    unknown_checks = sorted(set(enabled).difference(DEFAULT_CHECKS))
    if unknown_checks:
        raise ValueError(
            f"Unknown checks.enabled value(s): {', '.join(unknown_checks)}. "
            "Impact: the requested check set was not applied. "
            "Next step: use a documented check ID."
        )
    fail_on = str(checks.get("fail_on", "high")).casefold()
    if fail_on not in SEVERITY_ORDER:
        raise ValueError(
            f"Unsupported checks.fail_on value: {fail_on}. "
            "Impact: the gate threshold was not applied. "
            "Next step: use info, low, medium, high, or critical."
        )
    min_confidence = str(checks.get("min_confidence", "medium")).casefold()
    if min_confidence not in CONFIDENCE_ORDER:
        raise ValueError(
            f"Unsupported checks.min_confidence value: {min_confidence}. "
            "Impact: the confidence threshold was not applied. Next step: use low, medium, or high."
        )

    scope = str(report.get("scope", "all")).casefold()
    if scope not in _REPORT_SCOPES:
        raise ValueError(
            f"Unsupported report.scope value: {scope}. "
            "Impact: report selection was not applied. "
            "Next step: use all, breaking, confirmed, unreviewed, or filtered."
        )
    change_types = _string_list(report.get("change_types"), "report.change_types")
    invalid_change_types = sorted(set(change_types).difference(_CHANGE_TYPES))
    if invalid_change_types:
        raise _config_error(
            f"Unsupported report.change_types value(s): {', '.join(invalid_change_types)}.",
            "The report filter was not applied.",
            "Use added, removed, modified, split, merged, moved, or format_only.",
        )
    report_checks = _string_list(report.get("checks"), "report.checks")
    invalid_report_checks = sorted(set(report_checks).difference(DEFAULT_CHECKS))
    if invalid_report_checks:
        raise _config_error(
            f"Unsupported report.checks value(s): {', '.join(invalid_report_checks)}.",
            "The report filter was not applied.",
            "Use a documented check ID.",
        )
    severities = _string_list(report.get("severities"), "report.severities")
    invalid_severities = sorted(set(severities).difference(SEVERITY_ORDER))
    if invalid_severities:
        raise _config_error(
            f"Unsupported report.severities value(s): {', '.join(invalid_severities)}.",
            "The report filter was not applied.",
            "Use info, low, medium, high, or critical.",
        )
    confidence_levels = _string_list(report.get("confidence_levels"), "report.confidence_levels")
    invalid_confidence = sorted(set(confidence_levels).difference(CONFIDENCE_ORDER))
    if invalid_confidence:
        raise _config_error(
            f"Unsupported report.confidence_levels value(s): {', '.join(invalid_confidence)}.",
            "The report filter was not applied.",
            "Use low, medium, or high.",
        )
    review_states = _string_list(report.get("review_states"), "report.review_states")
    invalid_states = sorted(set(review_states).difference(REVIEW_STATES))
    if invalid_states:
        raise _config_error(
            f"Unsupported report.review_states value(s): {', '.join(invalid_states)}.",
            "The report filter was not applied.",
            "Use unreviewed, confirmed, rejected, modified, or waived.",
        )
    _string_list(report.get("sections"), "report.sections")
    if "redacted" in report and not isinstance(report["redacted"], bool):
        raise _config_error(
            "report.redacted must be a boolean.",
            "The redaction policy was not applied.",
            "Use true or false without quotes.",
        )
    if "require_reason" in review and not isinstance(review["require_reason"], bool):
        raise _config_error(
            "review.require_reason must be a boolean.",
            "Waiver validation was not configured.",
            "Use true or false without quotes.",
        )
    if "waivers" in review and review["waivers"] is not None and not isinstance(review["waivers"], str):
        raise _config_error(
            "review.waivers must be a path string or null.",
            "The waiver file was not loaded.",
            "Set a repository-relative path, an absolute path, or null to disable loading.",
        )
    if scope == "filtered" and not any(
        (change_types, report_checks, severities, confidence_levels, review_states, report.get("sections"))
    ):
        raise ValueError(
            "report.scope filtered requires at least one report filter. "
            "Impact: an empty selection was not generated. Next step: configure a report filter."
        )


def _scalar(raw: str) -> Any:
    value = raw.strip()
    if not value:
        return ""
    if value[0:1] in {'"', "'"} and value[-1:] == value[0]:
        return value[1:-1]
    lowered = value.casefold()
    if lowered in {"true", "yes", "on"}:
        return True
    if lowered in {"false", "no", "off"}:
        return False
    if lowered in {"null", "none", "~"}:
        return None
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    return value


def _from_mapping(data: dict[str, Any]) -> Config:
    _validate_mapping(data)
    checks = data.get("checks") or {}
    review = data.get("review") or {}
    report = data.get("report") or {}
    documents = [
        DocumentSpec(str(item["path"]), str(item.get("language", "auto")))
        for item in (data.get("documents") or [])
        if isinstance(item, dict) and item.get("path")
    ]
    enabled_raw = checks.get("enabled")
    enabled = set(map(str, enabled_raw)) if isinstance(enabled_raw, list) else set(DEFAULT_CHECKS)
    return Config(
        version=int(data.get("version", 1)),
        documents=documents,
        enabled_checks=enabled,
        fail_on=str(checks.get("fail_on", "high")).casefold(),
        min_confidence=str(checks.get("min_confidence", "medium")).casefold(),
        waivers_path=review.get("waivers", ".governdiff-waivers.yml"),
        require_waiver_reason=bool(review.get("require_reason", True)),
        report_scope=str(report.get("scope", "all")).casefold(),
        report_redacted=bool(report.get("redacted", False)),
        report_change_types=tuple(map(str, report.get("change_types", []) or [])),
        report_checks=tuple(map(str, report.get("checks", []) or [])),
        report_severities=tuple(map(str, report.get("severities", []) or [])),
        report_confidence_levels=tuple(
            map(str, report.get("confidence_levels", []) or [])
        ),
        report_review_states=tuple(map(str, report.get("review_states", []) or [])),
        report_sections=tuple(map(str, report.get("sections", []) or [])),
    )


def _parse_conventional_yaml(text: str) -> dict[str, Any]:
    """Parse the documented GovernDiff YAML shape, not arbitrary YAML."""

    result: dict[str, Any] = {
        "documents": [],
        "checks": {},
        "review": {},
        "report": {},
    }
    section: str | None = None
    subsection: str | None = None
    current_document: dict[str, Any] | None = None

    for raw_line in text.splitlines():
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        indent = len(raw_line) - len(raw_line.lstrip(" "))
        line = raw_line.strip()

        if indent == 0 and ":" in line:
            key, raw_value = line.split(":", 1)
            section = key.strip()
            subsection = None
            value = _scalar(raw_value)
            if value != "":
                result[section] = value
                section = None
            continue

        if section == "documents":
            if line.startswith("-"):
                current_document = {}
                result["documents"].append(current_document)
                rest = line[1:].strip()
                if ":" in rest:
                    key, value = rest.split(":", 1)
                    current_document[key.strip()] = _scalar(value)
            elif current_document is not None and ":" in line:
                key, value = line.split(":", 1)
                current_document[key.strip()] = _scalar(value)
            continue

        if section in {"checks", "review", "report"}:
            target = result[section]
            if indent <= 2 and ":" in line:
                key, raw_value = line.split(":", 1)
                subsection = key.strip()
                value = _scalar(raw_value)
                if value != "":
                    target[subsection] = value
                    subsection = None
                else:
                    target[subsection] = []
            elif line.startswith("-") and subsection:
                target[subsection].append(_scalar(line[1:]))
            continue

    return result


def load_config(path: str | Path | None) -> Config:
    if path is None:
        return Config()
    source = Path(path)
    text = source.read_text(encoding="utf-8-sig")
    if source.suffix.casefold() == ".json" or text.lstrip().startswith("{"):
        data = json.loads(text)
    else:
        data = _parse_conventional_yaml(text)
    return _from_mapping(data)


def _validate_date_value(fingerprint: str, field_name: str, raw: str) -> None:
    try:
        if "T" in raw:
            value = datetime.fromisoformat(raw.replace("Z", "+00:00"))
            if value.tzinfo is None:
                raise ValueError
        else:
            date.fromisoformat(raw)
    except ValueError as error:
        raise ValueError(
            f"Waiver {fingerprint} has an invalid {field_name} value: {raw}"
        ) from error


def _date_key(raw: str) -> datetime:
    if "T" in raw:
        value = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        return value.astimezone(timezone.utc)
    value = date.fromisoformat(raw)
    return datetime(value.year, value.month, value.day, tzinfo=timezone.utc)


def load_waivers(path: str | Path | None, require_reason: bool = True) -> WaiverCollection:
    if not path or not Path(path).exists():
        return WaiverCollection()
    source = Path(path)
    text = source.read_text(encoding="utf-8-sig")
    if source.suffix.casefold() == ".json" or text.lstrip().startswith("{"):
        data = json.loads(text)
        schema_version = data.get("schema_version")
        if schema_version and schema_version != "governdiff-waiver/1.0":
            raise ValueError(f"Unsupported waiver schema: {schema_version}")
        items = data.get("waivers", [])
    else:
        schema_match = re.search(r"(?m)^\s*schema_version\s*:\s*['\"]?([^'\"\s]+)", text)
        if schema_match and schema_match.group(1) != "governdiff-waiver/1.0":
            raise ValueError(f"Unsupported waiver schema: {schema_match.group(1)}")
        items: list[dict[str, str]] = []
        current: dict[str, str] | None = None
        in_waivers = False
        for raw_line in text.splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            if line == "waivers:":
                in_waivers = True
                continue
            if not in_waivers:
                continue
            if line.startswith("-"):
                current = {}
                items.append(current)
                line = line[1:].strip()
            if current is not None and ":" in line:
                key, value = line.split(":", 1)
                current[key.strip()] = str(_scalar(value))
    if not isinstance(items, list):
        raise ValueError("Waiver file must contain a waivers array")
    waivers = WaiverCollection()
    for item in items:
        if not isinstance(item, dict):
            raise ValueError("Each waiver entry must be an object")
        fingerprint = str(item.get("fingerprint", "")).strip()
        reason = str(item.get("reason", "")).strip()
        if not fingerprint:
            continue
        if require_reason and not reason:
            raise ValueError(f"Waiver {fingerprint} is missing a reason")
        approver = str(item.get("approved_by") or item.get("approver") or "").strip()
        created_at = str(item.get("created_at", "")).strip()
        expires_at = str(item.get("expires_at", "")).strip()
        if not approver:
            raise ValueError(f"Waiver {fingerprint} is missing approved_by")
        if not created_at:
            raise ValueError(f"Waiver {fingerprint} is missing created_at")
        if not expires_at:
            raise ValueError(f"Waiver {fingerprint} is missing expires_at")
        _validate_date_value(fingerprint, "created_at", created_at)
        _validate_date_value(fingerprint, "expires_at", expires_at)
        if _date_key(created_at) > _date_key(expires_at):
            raise ValueError(
                f"Waiver {fingerprint} expires before it was created"
            )
        waiver = Waiver(
            fingerprint=fingerprint,
            reason=reason,
            approver=approver,
            created_at=created_at,
            expires_at=expires_at,
            reference=str(item.get("reference", "")).strip() or None,
        )
        if fingerprint in waivers:
            raise ValueError(f"Duplicate waiver fingerprint: {fingerprint}")
        if waiver.is_expired():
            waivers.diagnostics.append({
                "code": "waiver-expired",
                "severity": "warning",
                "fingerprint": fingerprint,
                "message": (
                    f"Waiver {fingerprint} expired at {expires_at} and was not applied."
                ),
                "expires_at": expires_at,
            })
            continue
        waivers[fingerprint] = waiver
    return waivers
