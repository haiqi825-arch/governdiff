from __future__ import annotations

import contextlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from governdiff.cli import main


ROOT = Path(__file__).resolve().parents[1]


def _invoke(arguments: list[str]) -> tuple[int, str, str]:
    stdout = io.StringIO()
    stderr = io.StringIO()
    try:
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            code = main(arguments)
    except SystemExit as error:
        code = int(error.code)
    return code, stdout.getvalue(), stderr.getvalue()


class ExtendedCliSopAcceptanceTests(unittest.TestCase):
    def test_all_formats_scopes_redaction_and_overwrite_contract(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            root = Path(directory) / "空 格😀"
            root.mkdir()
            old = root / "旧 政策😀.md"
            new = root / "新 政策😀.md"
            old.write_text("# Policy\n\nMembers may report within 30 days.\n", encoding="utf-8")
            new.write_text("# Policy\n\nMembers must report within 10 days.\n", encoding="utf-8")
            for output_format in ("json", "markdown", "html", "csv"):
                with self.subTest(format=output_format):
                    output = root / f"report.{output_format}"
                    code, stdout, stderr = _invoke([
                        "diff", str(old), str(new), "--format", output_format,
                        "--output", str(output),
                    ])
                    self.assertEqual((code, stdout, stderr), (0, "", ""))
                    self.assertGreater(output.stat().st_size, 0)
                    output.write_text("stale", encoding="utf-8")
                    code, _, stderr = _invoke([
                        "diff", str(old), str(new), "--format", output_format,
                        "--output", str(output),
                    ])
                    self.assertEqual((code, stderr), (0, ""))
                    self.assertNotEqual(output.read_text(encoding="utf-8"), "stale")

            for scope in ("all", "breaking", "confirmed", "unreviewed"):
                with self.subTest(scope=scope):
                    code, stdout, stderr = _invoke([
                        "diff", str(old), str(new), "--format", "json", "--scope", scope,
                    ])
                    self.assertEqual((code, stderr), (0, ""))
                    payload = json.loads(stdout)
                    self.assertEqual(payload["selection"]["scope"], scope)

            code, stdout, stderr = _invoke([
                "diff", str(old), str(new), "--format", "json", "--scope", "filtered",
                "--filter-check", "deadline-shortened", "--redacted",
            ])
            self.assertEqual((code, stderr), (0, ""))
            payload = json.loads(stdout)
            self.assertTrue(payload["redacted"])
            self.assertEqual(payload["selection"]["scope"], "filtered")

    def test_preflight_success_failure_and_command_layering(self) -> None:
        fixture = ROOT / "tests" / "format_fixtures"
        code, stdout, stderr = _invoke([
            "preflight", str(fixture / "policy_old.docx"), "--format", "json",
        ])
        self.assertEqual((code, stderr), (0, ""))
        self.assertEqual(json.loads(stdout)["status"], "ok")
        code, stdout, stderr = _invoke([
            "preflight", str(fixture / "corrupt.pdf"), "--format", "json",
        ])
        # Preflight is a diagnostic command: it returns structured error status
        # with exit 1 instead of throwing away the details.
        self.assertEqual(code, 1)
        self.assertEqual(stderr, "")
        self.assertEqual(json.loads(stdout)["status"], "error")

        old = ROOT / "examples" / "public-cases" / "01-incident-deadline" / "old.md"
        new = ROOT / "examples" / "public-cases" / "01-incident-deadline" / "new.md"
        results = {}
        for command in ("diff", "changelog", "breaking"):
            code, stdout, stderr = _invoke([command, str(old), str(new), "--format", "json"])
            self.assertEqual((code, stderr), (0, ""))
            results[command] = json.loads(stdout)
        self.assertEqual(results["diff"]["selection"]["scope"], "all")
        self.assertEqual(results["changelog"]["selection"]["scope"], "filtered")
        self.assertNotIn("format_only", results["changelog"]["selection"]["filters"]["change_types"])
        self.assertEqual(results["breaking"]["selection"]["scope"], "breaking")
        self.assertLessEqual(
            results["breaking"]["selection"]["selected_finding_count"],
            results["diff"]["selection"]["selected_finding_count"],
        )

    def test_config_cli_precedence_and_error_redaction(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            root = Path(directory)
            old = root / "old.md"
            new = root / "new.md"
            old.write_text("# Policy\n\nMembers may file.\n", encoding="utf-8")
            new.write_text("# Policy\n\nMembers must file.\n", encoding="utf-8")
            config = root / "config.json"
            config.write_text(json.dumps({
                "version": 1,
                "report": {"scope": "breaking", "redacted": True},
            }), encoding="utf-8")
            code, stdout, stderr = _invoke([
                "diff", str(old), str(new), "--config", str(config),
                "--scope", "all", "--format", "json",
            ])
            self.assertEqual((code, stderr), (0, ""))
            payload = json.loads(stdout)
            self.assertEqual(payload["selection"]["scope"], "all")
            # Redaction is fail-safe: the CLI cannot turn off a true config value.
            self.assertTrue(payload["redacted"])

            missing = root / "绝密 missing config.json"
            code, stdout, stderr = _invoke([
                "diff", str(old), str(new), "--config", str(missing), "--format", "json",
            ])
            self.assertEqual((code, stdout), (1, ""))
            self.assertIn("[redacted-path]", stderr)
            self.assertNotIn(str(root), stderr)
            self.assertNotIn(missing.name, stderr)

    def test_check_exit_codes_zero_one_two_in_real_temporary_git_repository(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            repo = Path(directory)
            subprocess.run(["git", "init", "-q"], cwd=repo, check=True)
            subprocess.run(["git", "config", "user.name", "GovernDiff Test"], cwd=repo, check=True)
            subprocess.run(["git", "config", "user.email", "test@example.invalid"], cwd=repo, check=True)
            policy = repo / "policy.md"
            policy.write_text("# Policy\n\nMembers may file a report.\n", encoding="utf-8")
            subprocess.run(["git", "add", "policy.md"], cwd=repo, check=True)
            subprocess.run(["git", "commit", "-q", "-m", "baseline"], cwd=repo, check=True)
            config = repo / ".governdiff.yml"
            config.write_text(
                "version: 1\ndocuments:\n  - path: policy.md\nchecks:\n"
                "  enabled:\n    - modality-strengthened\n  fail_on: high\n"
                "  min_confidence: low\n",
                encoding="utf-8",
            )
            previous = Path.cwd()
            try:
                os.chdir(repo)
                code, _, stderr = _invoke(["check", "--base", "HEAD", "--config", str(config)])
                self.assertEqual((code, stderr), (0, ""))
                policy.write_text("# Policy\n\nMembers must file a report.\n", encoding="utf-8")
                code, stdout, stderr = _invoke(["check", "--base", "HEAD", "--config", str(config)])
                self.assertEqual((code, stderr), (2, ""))
                self.assertIn("modality-strengthened", stdout)
                bad = repo / "bad.yml"
                bad.write_text("version: 1\nchecks:\n  fail_on: urgent\n", encoding="utf-8")
                code, stdout, stderr = _invoke(["check", "--base", "HEAD", "--config", str(bad)])
                self.assertEqual((code, stdout), (1, ""))
                self.assertIn("checks.fail_on", stderr)
            finally:
                os.chdir(previous)

    def test_locked_output_is_actionable_and_does_not_corrupt_existing_file(self) -> None:
        if os.name != "nt":
            self.skipTest("Windows file locking contract")
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            root = Path(directory)
            old = root / "old.md"
            new = root / "new.md"
            output = root / "locked.json"
            old.write_text("# P\n\nMembers may file.\n", encoding="utf-8")
            new.write_text("# P\n\nMembers must file.\n", encoding="utf-8")
            output.write_text("retained", encoding="utf-8")
            with output.open("r+", encoding="utf-8") as handle:
                import msvcrt

                msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
                try:
                    code, stdout, stderr = _invoke([
                        "diff", str(old), str(new), "--format", "json", "--output", str(output),
                    ])
                finally:
                    handle.seek(0)
                    msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
            self.assertEqual((code, stdout), (1, ""))
            self.assertIn("governdiff: error:", stderr)
            self.assertEqual(output.read_text(encoding="utf-8"), "retained")

    def test_two_cli_instances_complete_without_shared_state_or_output_collision(self) -> None:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            root = Path(directory)
            old = root / "old.md"
            new = root / "new.md"
            old.write_text("# P\n\nMembers may file within 30 days.\n", encoding="utf-8")
            new.write_text("# P\n\nMembers must file within 10 days.\n", encoding="utf-8")
            environment = os.environ.copy()
            environment["PYTHONPATH"] = str(ROOT / "src")
            processes = [
                subprocess.Popen(
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
                        str(root / f"report-{index}.json"),
                    ],
                    cwd=ROOT,
                    env=environment,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    encoding="utf-8",
                )
                for index in range(2)
            ]
            completed = [process.communicate(timeout=30) for process in processes]
            self.assertEqual([process.returncode for process in processes], [0, 0])
            self.assertEqual([stderr for _, stderr in completed], ["", ""])
            reports = [
                json.loads((root / f"report-{index}.json").read_text(encoding="utf-8"))
                for index in range(2)
            ]
            self.assertEqual(reports[0]["summary"], reports[1]["summary"])
            self.assertEqual(
                [change["fingerprint"] for change in reports[0]["changes"]],
                [change["fingerprint"] for change in reports[1]["changes"]],
            )


if __name__ == "__main__":
    unittest.main()
