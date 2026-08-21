from __future__ import annotations

import ast
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


class ExtendedPlatformPathTests(unittest.TestCase):
    def test_cli_stdout_reconfigures_legacy_windows_encoding_to_utf8(self) -> None:
        root = Path(__file__).resolve().parents[1]
        environment = os.environ.copy()
        environment["PYTHONIOENCODING"] = "gbk"
        environment["PYTHONPATH"] = str(root / "src")
        process = subprocess.run(
            [
                sys.executable,
                "-m",
                "governdiff",
                "breaking",
                str(root / "examples" / "public-cases" / "01-incident-deadline" / "old.md"),
                str(root / "examples" / "public-cases" / "01-incident-deadline" / "new.md"),
            ],
            cwd=root,
            env=environment,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        self.assertEqual(process.returncode, 0, process.stderr.decode("utf-8"))
        rendered = process.stdout.decode("utf-8")
        self.assertIn("GovernDiff report", rendered)
        self.assertIn("→", rendered)

    def test_python_sources_parse_with_declared_3_10_grammar(self) -> None:
        source_root = Path(__file__).resolve().parents[1] / "src"
        for source in source_root.rglob("*.py"):
            with self.subTest(source=source.relative_to(source_root)):
                ast.parse(
                    source.read_text(encoding="utf-8"),
                    filename=str(source),
                    feature_version=(3, 10),
                )

    def _run_diff(self, directory: Path) -> dict[str, object]:
        directory.mkdir(parents=True, exist_ok=True)
        old = directory / "旧 policy 😀 old.md"
        new = directory / "新 policy 😀 new.md"
        output = directory / "结果 report 😀.json"
        old.write_text("# Policy\n\nMembers may submit within 30 days.\n", encoding="utf-8")
        new.write_text("# Policy\n\nMembers must submit within 15 days.\n", encoding="utf-8")
        completed = subprocess.run(
            [
                sys.executable,
                "-m",
                "governdiff",
                "diff",
                str(old),
                str(new),
                "--format",
                "json",
                "--output",
                str(output),
            ],
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertTrue(output.is_file())
        return json.loads(output.read_text(encoding="utf-8"))

    def test_cli_accepts_space_cjk_and_emoji_paths(self) -> None:
        with tempfile.TemporaryDirectory(prefix="governdiff-platform-") as temp:
            report = self._run_diff(Path(temp) / "space path 空间 😀")
        self.assertEqual(report["schema_version"], "1.5")
        self.assertGreater(report["summary"]["total_changes"], 0)

    @unittest.skipUnless(os.name == "nt", "Windows long-path acceptance")
    def test_cli_accepts_windows_path_longer_than_260_characters(self) -> None:
        with tempfile.TemporaryDirectory(prefix="governdiff-long-path-") as temp:
            segment = "governdiff-long-path-segment-" + ("x" * 24)
            directory = Path(temp).joinpath(segment, segment, segment, segment, segment)
            self.assertGreater(len(str(directory / "结果 report 😀.json")), 260)
            report = self._run_diff(directory)
        self.assertEqual(report["schema_version"], "1.5")


if __name__ == "__main__":
    unittest.main()
