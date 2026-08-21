from __future__ import annotations

import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path

from governdiff.cli import main
from governdiff.config import DEFAULT_CHECKS, load_config


class ExtendedConfigContractTests(unittest.TestCase):
    def test_yaml_and_json_configs_are_equivalent(self) -> None:
        data = {
            "version": 1,
            "documents": [{"path": "policies/**/*.md", "language": "zh"}],
            "checks": {
                "enabled": ["definition-changed", "deadline-shortened"],
                "fail_on": "medium",
                "min_confidence": "high",
            },
            "review": {"waivers": "waivers.yml", "require_reason": True},
            "report": {
                "scope": "filtered",
                "redacted": True,
                "checks": ["definition-changed"],
                "review_states": ["unreviewed"],
            },
        }
        yaml = """version: 1
documents:
  - path: policies/**/*.md
    language: zh
checks:
  enabled:
    - definition-changed
    - deadline-shortened
  fail_on: medium
  min_confidence: high
review:
  waivers: waivers.yml
  require_reason: true
report:
  scope: filtered
  redacted: true
  checks:
    - definition-changed
  review_states:
    - unreviewed
"""
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            yaml_path = root / "config.yml"
            json_path = root / "config.json"
            yaml_path.write_text(yaml, encoding="utf-8")
            json_path.write_text(json.dumps(data), encoding="utf-8")
            self.assertEqual(load_config(yaml_path), load_config(json_path))

    def test_default_check_set_contains_every_prd_check(self) -> None:
        expected = {
            "modality-strengthened", "modality-weakened", "permission-removed",
            "prohibition-added", "scope-expanded", "scope-narrowed",
            "authority-shifted", "deadline-shortened", "deadline-extended",
            "threshold-changed", "exception-added", "exception-removed",
            "effective-date-shifted", "definition-changed", "reference-retargeted",
        }
        self.assertLessEqual(expected, DEFAULT_CHECKS)

    def test_unknown_fields_and_invalid_values_are_rejected(self) -> None:
        cases = [
            ({"version": 1, "mystery": True}, "Unknown top-level"),
            ({"version": 1, "checks": {"enabled": ["not-a-check"]}}, "Unknown checks.enabled"),
            ({"version": 1, "checks": {"fail_on": "urgent"}}, "checks.fail_on"),
            ({"version": 1, "checks": {"min_confidence": "certain"}}, "checks.min_confidence"),
            ({"version": 1, "documents": [{"path": "policies/[*.md"}]}, "valid glob"),
            ({"version": 1, "documents": [{"path": "x.md", "language": "fr"}]}, "language"),
            ({"version": 1, "report": {"scope": "some"}}, "report.scope"),
            ({"version": 1, "report": {"scope": "filtered"}}, "requires at least one"),
            ({"version": "1"}, "Unsupported config version"),
            ({"version": 1, "documents": "*.md"}, "documents must be an array"),
            ({"version": 1, "documents": ["*.md"]}, r"documents\[0\] must be an object"),
            ({"version": 1, "report": {"change_types": ["renamed"]}}, "report.change_types"),
            ({"version": 1, "report": {"checks": ["not-a-check"]}}, "report.checks"),
            ({"version": 1, "report": {"severities": ["urgent"]}}, "report.severities"),
            ({"version": 1, "report": {"confidence_levels": ["certain"]}}, "report.confidence_levels"),
            ({"version": 1, "report": {"review_states": ["approved"]}}, "report.review_states"),
            ({"version": 1, "report": {"redacted": "false"}}, "report.redacted"),
            ({"version": 1, "review": {"require_reason": "yes"}}, "review.require_reason"),
            ({"version": 1, "review": {"waivers": []}}, "review.waivers"),
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "config.json"
            for data, message in cases:
                with self.subTest(data=data):
                    path.write_text(json.dumps(data), encoding="utf-8")
                    with self.assertRaisesRegex(ValueError, message) as raised:
                        load_config(path)
                    self.assertIn("Impact:", str(raised.exception))
                    self.assertIn("Next step:", str(raised.exception))

    def test_cli_errors_use_stderr_and_success_uses_stdout(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            old = root / "old.md"
            new = root / "new.md"
            old.write_text("# Policy\n\nMembers may report.\n", encoding="utf-8")
            new.write_text("# Policy\n\nMembers must report.\n", encoding="utf-8")
            stdout = io.StringIO()
            stderr = io.StringIO()
            with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
                result = main(["diff", str(old), str(new), "--format", "json"])
            self.assertEqual(0, result)
            self.assertTrue(stdout.getvalue().lstrip().startswith("{"))
            self.assertEqual("", stderr.getvalue())

            bad = root / "bad.json"
            bad.write_text(json.dumps({"version": 1, "checks": {"fail_on": "urgent"}}), encoding="utf-8")
            stdout = io.StringIO()
            stderr = io.StringIO()
            with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
                with self.assertRaises(SystemExit) as caught:
                    main(["diff", str(old), str(new), "--config", str(bad)])
            self.assertEqual(1, caught.exception.code)
            self.assertEqual("", stdout.getvalue())
            self.assertIn("checks.fail_on", stderr.getvalue())
            self.assertNotIn(str(bad), stderr.getvalue())


if __name__ == "__main__":
    unittest.main()
