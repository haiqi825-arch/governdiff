from __future__ import annotations

import importlib.util
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import patch

from governdiff.cli import main as cli_main
from governdiff.privacy import redact_log_message


ROOT = Path(__file__).resolve().parents[1]
ACTION_SPEC = importlib.util.spec_from_file_location(
    "governdiff_phase7_action", ROOT / "scripts" / "github_action.py"
)
assert ACTION_SPEC and ACTION_SPEC.loader
ACTION = importlib.util.module_from_spec(ACTION_SPEC)
sys.modules[ACTION_SPEC.name] = ACTION
ACTION_SPEC.loader.exec_module(ACTION)

BENCHMARK_SPEC = importlib.util.spec_from_file_location(
    "governdiff_phase7_benchmark", ROOT / "scripts" / "benchmark_phase7.py"
)
assert BENCHMARK_SPEC and BENCHMARK_SPEC.loader
BENCHMARK = importlib.util.module_from_spec(BENCHMARK_SPEC)
sys.modules[BENCHMARK_SPEC.name] = BENCHMARK
BENCHMARK_SPEC.loader.exec_module(BENCHMARK)


class Phase7PrivacyTests(unittest.TestCase):
    def test_log_redaction_removes_paths_filenames_and_secrets(self) -> None:
        secret = "sk_phase7_private_123456789"
        github_token = "ghp_" + "1234567890abcdef"
        value = (
            "Failed C:\\private\\Board Policy.json and /srv/policies/board-policy.md; "
            f"API_KEY={secret} token={github_token}"
        )
        redacted = redact_log_message(value, environment={"SERVICE_API_KEY": secret})

        self.assertNotIn("C:\\private", redacted)
        self.assertNotIn("/srv/policies", redacted)
        self.assertNotIn("Board Policy.json", redacted)
        self.assertNotIn("board-policy.md", redacted)
        self.assertNotIn(secret, redacted)
        self.assertNotIn(github_token, redacted)
        self.assertIn("[redacted-", redacted)

    def test_cli_runtime_error_does_not_echo_document_identity(self) -> None:
        missing = str(ROOT / "private-fixtures" / "董事会绝密政策.md")
        error_output = io.StringIO()
        with redirect_stderr(error_output), self.assertRaises(SystemExit):
            cli_main(["diff", missing, missing, "--format", "json"])
        logged = error_output.getvalue()
        self.assertNotIn(str(ROOT), logged)
        self.assertNotIn("董事会绝密政策.md", logged)
        self.assertIn("[redacted-path]", logged)

    def test_action_annotations_default_to_privacy_safe_metadata(self) -> None:
        policy_text = "INTERNAL-POLICY-BODY-DO-NOT-LOG"
        api_key = "phase7-secret-api-value"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            old = root / "Secret Old Policy.md"
            new = root / "Secret New Policy.md"
            old.write_text(f"# Access\n\nMembers may publish. {policy_text}\n", encoding="utf-8")
            new.write_text(
                f"# Access\n\nMembers must obtain approval. {policy_text}\n",
                encoding="utf-8",
            )
            args = ACTION.build_parser().parse_args([
                "--old", str(old),
                "--new", str(new),
                "--report-dir", str(root / "reports"),
                "--fail-on-severity", "medium",
            ])
            output = io.StringIO()
            with patch.dict(os.environ, {"GOVERNDIFF_API_KEY": api_key}, clear=False):
                with redirect_stdout(output):
                    ACTION.run(args)
            logged = output.getvalue()

        self.assertNotIn(str(root), logged)
        self.assertNotIn(old.name, logged)
        self.assertNotIn(new.name, logged)
        self.assertNotIn(policy_text, logged)
        self.assertNotIn(api_key, logged)
        self.assertIn("Full evidence is available in the report artifact", logged)

    def test_ai_off_core_flow_has_zero_network_events(self) -> None:
        process = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "verify_zero_egress.py")],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        result = json.loads(process.stdout)
        self.assertTrue(result["passed"])
        self.assertEqual(result["network_attempts"], 0)
        self.assertEqual(result["formats"], ["docx", "html", "markdown", "pdf", "text"])


class Phase7PerformanceAndSupplyChainTests(unittest.TestCase):
    def test_two_100_page_documents_finish_within_90_seconds(self) -> None:
        result = BENCHMARK.benchmark(100, 90.0)
        self.assertTrue(result["passed"], result)
        self.assertEqual(result["result"]["old_page_count"], 100)
        self.assertEqual(result["result"]["new_page_count"], 100)
        self.assertLessEqual(result["result"]["elapsed_seconds"], 90.0)
        self.assertLessEqual(result["machine"]["benchmark_affinity"]["effective_logical_cores"], 4)
        self.assertLessEqual(result["result"]["peak_traced_memory_mib"], 8192)

    def test_phase7_ci_contract_covers_every_release_gate(self) -> None:
        workflow = (ROOT / ".github" / "workflows" / "quality-gates.yml").read_text(encoding="utf-8")
        codeql = (ROOT / ".github" / "workflows" / "codeql.yml").read_text(encoding="utf-8")
        dependabot = (ROOT / ".github" / "dependabot.yml").read_text(encoding="utf-8")

        for platform_name in ("windows-latest", "macos-latest", "ubuntu-latest"):
            self.assertIn(platform_name, workflow)
        for gate in (
            "verify_zero_egress.py",
            "benchmark_phase7.py",
            "test:performance",
            "gh-action-pip-audit@v1.1.0",
            "npm audit --audit-level=high",
            "verify_reproducible_builds.py",
            "test:reproducible",
            "anchore/scan-action@v7",
        ):
            self.assertIn(gate, workflow)
        self.assertIn("github/codeql-action/init@v4", codeql)
        self.assertIn("github/codeql-action/analyze@v4", codeql)
        for ecosystem in ("pip", "npm", "github-actions"):
            self.assertIn(f"package-ecosystem: {ecosystem}", dependabot)

    def test_checked_in_benchmark_and_build_evidence_passes(self) -> None:
        for name in (
            "PHASE_7_PERFORMANCE.json",
            "PHASE_7_UI_PERFORMANCE.json",
            "PHASE_7_PYTHON_BUILD.json",
            "PHASE_7_REVIEWER_BUILD.json",
            "PHASE_7_DEPENDENCY_AUDIT.json",
            "PHASE_7_ZERO_EGRESS.json",
            "PHASE_7_WINDOWS_PLATFORM.json",
        ):
            result = json.loads((ROOT / "benchmark" / name).read_text(encoding="utf-8"))
            self.assertTrue(result["passed"], name)


if __name__ == "__main__":
    unittest.main()
