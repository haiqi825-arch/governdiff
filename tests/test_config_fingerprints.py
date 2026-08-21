from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from governdiff import analyze_texts
from governdiff.config import load_config, load_waivers


class ConfigAndFingerprintTests(unittest.TestCase):
    def test_documented_yaml_shape(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".governdiff.yml"
            path.write_text(
                "version: 1\n"
                "documents:\n"
                "  - path: policies/*.md\n"
                "    language: en\n"
                "checks:\n"
                "  enabled:\n"
                "    - duty-added\n"
                "  fail_on: medium\n"
                "review:\n"
                "  waivers: waivers.yml\n"
                "  require_reason: true\n",
                encoding="utf-8",
            )
            config = load_config(path)
            self.assertEqual(config.documents[0].path, "policies/*.md")
            self.assertEqual(config.enabled_checks, {"duty-added"})
            self.assertEqual(config.fail_on, "medium")

    def test_waiver_reason_is_required(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "waivers.yml"
            path.write_text("waivers:\n  - fingerprint: GVD-123\n", encoding="utf-8")
            with self.assertRaises(ValueError):
                load_waivers(path, require_reason=True)

    def test_fingerprint_ignores_line_movement(self) -> None:
        old_a = "# Rules\n\nMembers may file a report.\n"
        new_a = "# Rules\n\nMembers must file a report.\n"
        old_b = "# Rules\n\nUnrelated preface.\n\nMembers may file a report.\n"
        new_b = "# Rules\n\nUnrelated preface.\n\nMembers must file a report.\n"
        first = analyze_texts(old_a, new_a)
        second = analyze_texts(old_b, new_b)
        id_a = next(f.fingerprint for c in first.changes for f in c.findings if f.check_id == "modality-strengthened")
        id_b = next(f.fingerprint for c in second.changes for f in c.findings if f.check_id == "modality-strengthened")
        self.assertEqual(id_a, id_b)

    def test_fingerprint_ignores_newline_locale_and_timezone_environment(self) -> None:
        old_lf = "# Rules\n\nMembers may file within 30 days.\n"
        new_lf = "# Rules\n\nMembers must file within 10 days.\n"
        old_crlf = old_lf.replace("\n", "\r\n")
        new_crlf = new_lf.replace("\n", "\r\n")

        def findings(old: str, new: str) -> list[tuple[str, str]]:
            report = analyze_texts(old, new)
            return sorted(
                (item.check_id, item.fingerprint)
                for change in report.changes
                for item in change.findings
            )

        original = {name: os.environ.get(name) for name in ("TZ", "LC_ALL", "LANG")}
        try:
            os.environ.update({"TZ": "Pacific/Honolulu", "LC_ALL": "C", "LANG": "C"})
            first = findings(old_lf, new_lf)
            os.environ.update({"TZ": "Asia/Shanghai", "LC_ALL": "zh_CN.UTF-8", "LANG": "zh_CN.UTF-8"})
            second = findings(old_crlf, new_crlf)
        finally:
            for name, value in original.items():
                if value is None:
                    os.environ.pop(name, None)
                else:
                    os.environ[name] = value
        self.assertEqual(first, second)

    def test_substantive_values_change_the_fingerprint(self) -> None:
        old = "# Rules\n\nMembers may file within 30 days.\n"
        first = analyze_texts(old, "# Rules\n\nMembers must file within 10 days.\n")
        second = analyze_texts(old, "# Rules\n\nMembers must file within 5 days.\n")
        fingerprints_a = {
            finding.fingerprint
            for change in first.changes
            for finding in change.findings
            if finding.check_id == "deadline-shortened"
        }
        fingerprints_b = {
            finding.fingerprint
            for change in second.changes
            for finding in change.findings
            if finding.check_id == "deadline-shortened"
        }
        self.assertTrue(fingerprints_a and fingerprints_b)
        self.assertNotEqual(fingerprints_a, fingerprints_b)


if __name__ == "__main__":
    unittest.main()
