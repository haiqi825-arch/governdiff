from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import governdiff.review_session as review_session


ROOT = Path(__file__).resolve().parents[1]


class PhaseEightReleaseTests(unittest.TestCase):
    def test_installed_reviewer_layout_precedes_source_layout(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            package = Path(temporary) / "site-packages" / "governdiff"
            (package / "_reviewer" / "scripts").mkdir(parents=True)
            (package / "_reviewer" / "dist" / "server").mkdir(parents=True)
            (package / "_reviewer" / "scripts" / "review-session.mjs").write_text(
                "// test", encoding="utf-8"
            )
            (package / "_reviewer" / "dist" / "server" / "index.js").write_text(
                "// test", encoding="utf-8"
            )
            with (
                patch.object(review_session, "__file__", str(package / "review_session.py")),
                patch.dict("os.environ", {}, clear=True),
            ):
                self.assertEqual(
                    review_session._reviewer_root(),
                    package / "_reviewer",
                )

    def test_explicit_reviewer_root_remains_supported(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "scripts").mkdir()
            (root / "dist" / "server").mkdir(parents=True)
            (root / "scripts" / "review-session.mjs").write_text("// test")
            (root / "dist" / "server" / "index.js").write_text("// test")
            with patch.dict("os.environ", {"GOVERNDIFF_REVIEWER_ROOT": str(root)}):
                self.assertEqual(review_session._reviewer_root(), root.resolve())

    def test_reviewer_lockfile_declares_every_dependency_license(self) -> None:
        lock = json.loads(
            (ROOT / "reviewer-ui" / "package-lock.json").read_text(encoding="utf-8")
        )
        packages = [value for key, value in lock["packages"].items() if key]
        self.assertGreater(len(packages), 100)
        self.assertFalse([item for item in packages if not item.get("license")])

    def test_three_public_cases_declare_expected_checks(self) -> None:
        manifest = json.loads(
            (ROOT / "examples" / "public-cases" / "manifest.json").read_text(
                encoding="utf-8"
            )
        )
        self.assertEqual(len(manifest["cases"]), 3)
        for case in manifest["cases"]:
            self.assertTrue(case["expected_checks"])
            directory = ROOT / "examples" / "public-cases" / case["id"]
            self.assertTrue((directory / "old.md").is_file())
            self.assertTrue((directory / "new.md").is_file())
            self.assertTrue((directory / "report.json").is_file())


if __name__ == "__main__":
    unittest.main()
