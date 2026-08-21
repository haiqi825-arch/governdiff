"""Privacy-safe formatting for operational logs.

Reports intentionally retain evidence. Operational logs do not: callers must
opt in before emitting document locations or finding summaries.
"""

from __future__ import annotations

import os
import re
from collections.abc import Mapping


_SENSITIVE_ENV_NAMES = re.compile(
    r"(?:API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTHORIZATION|CREDENTIAL)",
    re.IGNORECASE,
)
_SECRET_ASSIGNMENT = re.compile(
    r"(?i)\b(api[_-]?key|access[_-]?token|token|secret|password|passwd|authorization)"
    r"(\s*[:=]\s*)(?:bearer\s+)?[^\s,;]+"
)
_KNOWN_SECRET = re.compile(
    r"(?i)\b(?:sk|ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_-]{8,}\b|"
    r"\bAKIA[A-Z0-9]{12,}\b"
)
_WINDOWS_ABSOLUTE_PATH = re.compile(
    r"(?<![A-Za-z0-9])(?:[A-Za-z]:[\\/]|\\\\)[^\r\n\t\"'<>|]+"
)
_POSIX_ABSOLUTE_PATH = re.compile(
    r"(?<![:A-Za-z0-9])/(?:[^/\s\"'<>]+/)*[^/\s\"'<>]*"
)
_DOCUMENT_NAME = re.compile(
    r"(?i)(?<![A-Za-z0-9_.-])[^\s\"'<>/\\]+"
    r"\.(?:pdf|docx|html?|markdown|md|txt|csv|json|ya?ml|toml|sarif|log)"
    r"(?![A-Za-z0-9_.-])"
)


def sensitive_environment_values(
    environment: Mapping[str, str] | None = None,
) -> tuple[str, ...]:
    values = environment or os.environ
    return tuple(sorted(
        {
            str(value)
            for name, value in values.items()
            if _SENSITIVE_ENV_NAMES.search(str(name))
            and len(str(value)) >= 4
        },
        key=len,
        reverse=True,
    ))


def redact_log_message(
    value: object,
    *,
    environment: Mapping[str, str] | None = None,
) -> str:
    """Remove secrets and document identity from a log-bound value."""

    result = str(value)
    for secret in sensitive_environment_values(environment):
        result = result.replace(secret, "[redacted-secret]")
    result = _SECRET_ASSIGNMENT.sub(
        lambda match: f"{match.group(1)}{match.group(2)}[redacted-secret]",
        result,
    )
    result = _KNOWN_SECRET.sub("[redacted-secret]", result)
    result = _WINDOWS_ABSOLUTE_PATH.sub("[redacted-path]", result)
    result = _POSIX_ABSOLUTE_PATH.sub("[redacted-path]", result)
    result = _DOCUMENT_NAME.sub("[redacted-document]", result)
    return result


def safe_exception_message(error: BaseException) -> str:
    return redact_log_message(str(error) or error.__class__.__name__)
