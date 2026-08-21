"""Validate checked-in examples and a live report without external packages.

The validator intentionally implements only the JSON Schema 2020-12 keywords
used by GovernDiff's checked-in contracts. The schemas remain standard JSON
Schema and can also be consumed by full validators such as jsonschema or Ajv.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from governdiff import analyze_texts  # noqa: E402
from governdiff.report import render_json  # noqa: E402


class SchemaValidationError(ValueError):
    pass


def _resolve(root: dict[str, Any], reference: str) -> dict[str, Any]:
    if not reference.startswith("#/"):
        raise SchemaValidationError(f"Only local schema references are supported: {reference}")
    value: Any = root
    for token in reference[2:].split("/"):
        value = value[token.replace("~1", "/").replace("~0", "~")]
    if not isinstance(value, dict):
        raise SchemaValidationError(f"Schema reference is not an object: {reference}")
    return value


def _is_type(instance: Any, expected: str) -> bool:
    return {
        "null": instance is None,
        "boolean": isinstance(instance, bool),
        "integer": isinstance(instance, int) and not isinstance(instance, bool),
        "number": isinstance(instance, (int, float)) and not isinstance(instance, bool),
        "string": isinstance(instance, str),
        "array": isinstance(instance, list),
        "object": isinstance(instance, dict),
    }.get(expected, False)


def _format_ok(value: str, name: str) -> bool:
    try:
        if name == "date":
            date.fromisoformat(value)
        elif name == "date-time":
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
            if parsed.tzinfo is None:
                return False
        else:
            return True
    except ValueError:
        return False
    return True


def validate_instance(
    instance: Any,
    schema: dict[str, Any],
    *,
    root: dict[str, Any] | None = None,
    path: str = "$",
) -> None:
    root = root or schema
    if "$ref" in schema:
        validate_instance(instance, _resolve(root, schema["$ref"]), root=root, path=path)
        return
    if "allOf" in schema:
        for branch in schema["allOf"]:
            validate_instance(instance, branch, root=root, path=path)
    for keyword, expected_matches in (("anyOf", 1), ("oneOf", 1)):
        if keyword not in schema:
            continue
        matches = 0
        for branch in schema[keyword]:
            try:
                validate_instance(instance, branch, root=root, path=path)
                matches += 1
            except SchemaValidationError:
                pass
        if matches < expected_matches or (keyword == "oneOf" and matches != 1):
            raise SchemaValidationError(f"{path}: failed {keyword}")
    if "const" in schema and instance != schema["const"]:
        raise SchemaValidationError(f"{path}: expected constant {schema['const']!r}")
    if "enum" in schema and instance not in schema["enum"]:
        raise SchemaValidationError(f"{path}: {instance!r} is not in {schema['enum']!r}")

    expected = schema.get("type")
    if expected is not None:
        types = expected if isinstance(expected, list) else [expected]
        if not any(_is_type(instance, item) for item in types):
            raise SchemaValidationError(f"{path}: expected type {types}, got {type(instance).__name__}")

    if isinstance(instance, str):
        if "minLength" in schema and len(instance) < schema["minLength"]:
            raise SchemaValidationError(f"{path}: string is shorter than minLength")
        if "pattern" in schema and re.search(schema["pattern"], instance) is None:
            raise SchemaValidationError(f"{path}: string does not match {schema['pattern']}")
        if "format" in schema and not _format_ok(instance, schema["format"]):
            raise SchemaValidationError(f"{path}: invalid {schema['format']} value")
    if isinstance(instance, (int, float)) and not isinstance(instance, bool):
        if "minimum" in schema and instance < schema["minimum"]:
            raise SchemaValidationError(f"{path}: number is below minimum")
        if "maximum" in schema and instance > schema["maximum"]:
            raise SchemaValidationError(f"{path}: number is above maximum")
    if isinstance(instance, list):
        if schema.get("uniqueItems"):
            encoded = [json.dumps(value, sort_keys=True, ensure_ascii=False) for value in instance]
            if len(encoded) != len(set(encoded)):
                raise SchemaValidationError(f"{path}: array items are not unique")
        if "items" in schema:
            for index, item in enumerate(instance):
                validate_instance(item, schema["items"], root=root, path=f"{path}[{index}]")
    if isinstance(instance, dict):
        for key in schema.get("required", []):
            if key not in instance:
                raise SchemaValidationError(f"{path}: missing required property {key}")
        properties = schema.get("properties", {})
        for key, value in instance.items():
            if key in properties:
                validate_instance(value, properties[key], root=root, path=f"{path}.{key}")
            elif schema.get("additionalProperties") is False:
                raise SchemaValidationError(f"{path}: unexpected property {key}")


def _read(relative: str) -> dict[str, Any]:
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def validate_published_artifacts() -> list[str]:
    targets = [
        ("schema/report.schema.json", "schema/examples/report.example.json"),
        ("schema/review.schema.json", "schema/examples/review.example.json"),
        ("schema/waiver.schema.json", "schema/examples/waiver.example.json"),
        (
            "schema/action-manifest.schema.json",
            "schema/examples/action-manifest.example.json",
        ),
    ]
    validated: list[str] = []
    for schema_path, example_path in targets:
        validate_instance(_read(example_path), _read(schema_path))
        validated.append(example_path)
    live = json.loads(render_json(analyze_texts(
        "# Rules\n\nMembers may submit within 30 days.\n",
        "# Rules\n\nMembers must submit within 10 days.\n",
    )))
    validate_instance(live, _read("schema/report.schema.json"))
    validated.append("live CLI-equivalent report")
    return validated


def main() -> int:
    for value in validate_published_artifacts():
        print(f"validated: {value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
