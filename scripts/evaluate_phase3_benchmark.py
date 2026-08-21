"""Evaluate the focused split/merge and structured-diff Phase 3 cases."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from governdiff import analyze_texts  # noqa: E402


def _find_section(nodes: list[dict[str, Any]], path: list[str]) -> dict[str, Any] | None:
    for node in nodes:
        if node["path"] == path:
            return node
        found = _find_section(node.get("children", []), path)
        if found:
            return found
    return None


def evaluate() -> dict[str, Any]:
    source = ROOT / "benchmark" / "phase3" / "CASES.json"
    corpus = json.loads(source.read_text(encoding="utf-8"))
    if corpus["case_count"] != len(corpus["cases"]):
        raise ValueError("Phase 3 case_count does not match cases")
    results: list[dict[str, Any]] = []
    for case in corpus["cases"]:
        report = analyze_texts(
            case["old"],
            case["new"],
            old_path=f"benchmark/phase3/{case['id']}/old.md",
            new_path=f"benchmark/phase3/{case['id']}/new.md",
            language=case["language"],
        )
        expected = case["expected"]
        changed = [change for change in report.changes if change.change_type != "unchanged"]
        change = next(
            (item for item in changed if item.change_type == expected.get("change_type")),
            changed[0] if changed else None,
        )
        checks: list[tuple[str, bool]] = []
        if "change_type" in expected:
            checks.append(("change_type", bool(change and change.change_type == expected["change_type"])))
        if "old_blocks" in expected:
            checks.append(("old_blocks", bool(change and len(change.old_blocks) == expected["old_blocks"])))
        if "new_blocks" in expected:
            checks.append(("new_blocks", bool(change and len(change.new_blocks) == expected["new_blocks"])))
        actual_check_ids = {finding.check_id for finding in (change.findings if change else [])}
        if "checks" in expected:
            checks.append(("checks", set(expected["checks"]).issubset(actual_check_ids)))
        if "excluded_checks" in expected:
            checks.append(("excluded_checks", not (set(expected["excluded_checks"]) & actual_check_ids)))
        if "word_operations" in expected:
            operations = {operation.operation for operation in (change.word_diff if change else [])}
            checks.append(("word_operations", set(expected["word_operations"]).issubset(operations)))
        if "temporal_kind" in expected:
            checks.append(("temporal_kind", bool(change and any(item.kind == expected["temporal_kind"] for item in change.temporal_changes))))
        if "mapping_old_key" in expected:
            mapping = next((item for item in report.article_mappings if item.old_key == expected["mapping_old_key"]), None)
            checks.extend([
                ("mapping_status", bool(mapping and mapping.status == expected["mapping_status"])),
                ("candidate_count", bool(mapping and len(mapping.candidates) == expected["candidate_count"])),
            ])
        if "section_path" in expected:
            section = _find_section(report.to_dict()["section_tree"], expected["section_path"])
            checks.append(("section_tree", bool(section and section["change_count"] == expected["section_change_count"])))
        results.append({
            "id": case["id"],
            "passed": all(value for _, value in checks),
            "assertions": {name: value for name, value in checks},
        })
    passed = sum(item["passed"] for item in results)
    return {
        "schema_version": "1.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "case_count": len(results),
        "passed": passed,
        "pass_rate": round(passed / len(results), 4) if results else 0.0,
        "results": results,
    }


def render_markdown(result: dict[str, Any]) -> str:
    lines = [
        "# GovernDiff Phase 3 focused benchmark",
        "",
        f"Generated: `{result['generated_at']}`",
        "",
        f"Result: **{result['passed']}/{result['case_count']}** focused cases passed.",
        "",
        "| Case | Result | Assertions |",
        "| --- | --- | --- |",
    ]
    for item in result["results"]:
        failed = [name for name, passed in item["assertions"].items() if not passed]
        lines.append(f"| `{item['id']}` | {'PASS' if item['passed'] else 'FAIL'} | {', '.join(failed) if failed else 'all'} |")
    lines.extend([
        "",
        "These are deterministic, project-reviewed acceptance slices, not an independent production-accuracy claim.",
        "",
    ])
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    result = evaluate()
    directory = ROOT / "benchmark" / "phase3"
    (directory / "results.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    (directory / "REPORT.md").write_text(render_markdown(result), encoding="utf-8", newline="\n")
    print(json.dumps({"passed": result["passed"], "case_count": result["case_count"], "pass_rate": result["pass_rate"]}))
    return 1 if args.strict and result["passed"] != result["case_count"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
