import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from governdiff.engine import analyze_document_versions


ROOT = Path(__file__).resolve().parents[1]
ACTION_SCRIPT = ROOT / "scripts" / "github_action.py"
SPEC = importlib.util.spec_from_file_location("governdiff_github_action", ACTION_SCRIPT)
assert SPEC and SPEC.loader
ACTION = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = ACTION
SPEC.loader.exec_module(ACTION)
VALIDATOR_SPEC = importlib.util.spec_from_file_location(
    "governdiff_schema_validator", ROOT / "scripts" / "validate_schemas.py"
)
assert VALIDATOR_SPEC and VALIDATOR_SPEC.loader
VALIDATOR = importlib.util.module_from_spec(VALIDATOR_SPEC)
sys.modules[VALIDATOR_SPEC.name] = VALIDATOR
VALIDATOR_SPEC.loader.exec_module(VALIDATOR)


def _git(repository: Path, *arguments: str) -> str:
    process = subprocess.run(
        ["git", "-C", str(repository), *arguments],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    if process.returncode != 0:
        raise AssertionError(process.stderr or process.stdout)
    return process.stdout.strip()


class Phase6EngineTests(unittest.TestCase):
    def test_added_and_deleted_versions_keep_lifecycle_semantics(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            policy = Path(temporary) / "policy.md"
            policy.write_text(
                "# Access\n\nMembers must submit a security review before release.\n",
                encoding="utf-8",
            )

            added = analyze_document_versions(
                None,
                policy,
                old_logical_path="policy.md",
                new_logical_path="policy.md",
            )
            deleted = analyze_document_versions(
                policy,
                None,
                old_logical_path="policy.md",
                new_logical_path="policy.md",
            )

        self.assertTrue(added.changes)
        self.assertEqual({item.change_type for item in added.changes}, {"added"})
        self.assertEqual(added.old_document.source_format, "markdown")
        self.assertEqual(added.old_document.blocks, [])
        self.assertEqual({item.change_type for item in deleted.changes}, {"removed"})
        self.assertEqual(deleted.new_document.source_format, "markdown")
        self.assertEqual(deleted.new_document.blocks, [])


class Phase6ActionTests(unittest.TestCase):
    def test_repository_globs_do_not_let_star_cross_directories(self) -> None:
        self.assertTrue(ACTION._matches("policies/access.md", "policies/*.md"))
        self.assertFalse(ACTION._matches("policies/archive/access.md", "policies/*.md"))
        self.assertTrue(ACTION._matches("policies/archive/access.md", "policies/**/*.md"))
        self.assertTrue(ACTION._matches("GOVERNANCE.md", "**/*.md"))
        self.assertTrue(ACTION._matches("GOVERNANCE.md", "GOVERNANCE.md"))

    def test_explicit_pair_writes_all_four_reports_and_compact_summary(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            old = root / "old.md"
            new = root / "new.md"
            output = root / "output"
            github_output = root / "github-output.txt"
            old.write_text("# Access\n\nMembers may publish.\n", encoding="utf-8")
            new.write_text(
                "# Access\n\nMembers must obtain approval before publishing.\n",
                encoding="utf-8",
            )
            args = ACTION.build_parser().parse_args([
                "--old", str(old),
                "--new", str(new),
                "--report-dir", str(output),
                "--fail-on-severity", "medium",
            ])
            with patch.dict(os.environ, {"GITHUB_OUTPUT": str(github_output)}, clear=False):
                _, values = ACTION.run(args)

            manifest = json.loads((output / "manifest.json").read_text(encoding="utf-8"))
            summary = (output / "summary.md").read_text(encoding="utf-8")
            github_values = github_output.read_text(encoding="utf-8")
            schema = json.loads(
                (ROOT / "schema" / "action-manifest.schema.json").read_text(encoding="utf-8")
            )
            VALIDATOR.validate_instance(manifest, schema)

        self.assertEqual(manifest["schema_version"], "governdiff-action/1.0")
        self.assertEqual(manifest["mode"], "pair")
        self.assertEqual(manifest["summary"]["files"], 1)
        for kind in ("json", "markdown", "html", "csv"):
            self.assertTrue(values[f"report-{kind}"].endswith(f"report.{ 'md' if kind == 'markdown' else kind}"))
        self.assertIn("{{GOVERNDIFF_ARTIFACT_URL}}", summary)
        self.assertNotIn("## Changes", summary)
        self.assertIn("report-manifest=", github_values)

    def test_real_git_repository_pr_base_handles_modified_added_deleted_and_ignored(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            repository = Path(temporary) / "fixture-repository"
            repository.mkdir()
            _git(repository, "init")
            _git(repository, "config", "user.email", "phase6@example.invalid")
            _git(repository, "config", "user.name", "Phase 6 Integration")
            (repository / "policies").mkdir()
            (repository / "docs").mkdir()
            (repository / "policies" / "modified.md").write_text(
                "# Access\n\nMembers may publish releases.\n", encoding="utf-8"
            )
            (repository / "policies" / "deleted.md").write_text(
                "# Safety\n\nMembers must report incidents within 48 hours.\n",
                encoding="utf-8",
            )
            (repository / "policies" / "renamed.md").write_text(
                "# Records\n\nMaintainers must retain approval records.\n",
                encoding="utf-8",
            )
            (repository / "docs" / "ignored.md").write_text(
                "# Notes\n\nNot a selected policy.\n", encoding="utf-8"
            )
            _git(repository, "add", ".")
            _git(repository, "commit", "-m", "base policy set")
            base = _git(repository, "rev-parse", "HEAD")

            (repository / "policies" / "modified.md").write_text(
                "# Access\n\nMembers must obtain approval before publishing releases.\n",
                encoding="utf-8",
            )
            (repository / "policies" / "deleted.md").unlink()
            (repository / "policies" / "added.md").write_text(
                "# Security\n\nMaintainers must rotate credentials every 30 days.\n",
                encoding="utf-8",
            )
            (repository / "policies" / "renamed.md").rename(
                repository / "policies" / "renamed-current.md"
            )
            (repository / "docs" / "ignored.md").write_text(
                "# Notes\n\nThis unrelated file changed.\n", encoding="utf-8"
            )
            _git(repository, "add", "-A")
            _git(repository, "commit", "-m", "pull request changes")

            output = repository / "governdiff-report"
            environment = os.environ.copy()
            environment["PYTHONPATH"] = str(ROOT / "src")
            process = subprocess.run(
                [
                    shutil.which("python") or sys.executable,
                    str(ACTION_SCRIPT),
                    "--base", base,
                    "--paths", "policies/*.md",
                    "--report-dir", str(output),
                    "--fail-on-breaking", "false",
                ],
                cwd=repository,
                env=environment,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=False,
            )
            self.assertEqual(process.returncode, 0, process.stderr or process.stdout)
            manifest = json.loads((output / "manifest.json").read_text(encoding="utf-8"))

            self.assertEqual(manifest["mode"], "git-base")
            self.assertEqual(manifest["base_commit"], base)
            self.assertFalse(manifest["gate"]["enabled"])
            self.assertIn("Advisory mode", manifest["gate"]["reason"])
            self.assertEqual(manifest["summary"]["files"], 4)
            self.assertEqual(
                {item["status"] for item in manifest["files"]},
                {"added", "deleted", "modified", "renamed"},
            )
            self.assertNotIn("docs/ignored.md", json.dumps(manifest))
            for item in manifest["files"]:
                self.assertEqual(set(item["reports"]), {"json", "markdown", "html", "csv"})
                for relative in item["reports"].values():
                    self.assertTrue((output / relative).is_file(), relative)
            added = next(item for item in manifest["files"] if item["status"] == "added")
            deleted = next(item for item in manifest["files"] if item["status"] == "deleted")
            self.assertEqual(added["old_sha256"], ACTION.hashlib.sha256(b"").hexdigest())
            self.assertEqual(deleted["new_sha256"], ACTION.hashlib.sha256(b"").hexdigest())

    def test_publish_summary_uses_the_uploaded_artifact_url(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "summary.md"
            target = root / "github-summary.md"
            source.write_text(
                "Full reports: [governdiff-report]({{GOVERNDIFF_ARTIFACT_URL}})\n",
                encoding="utf-8",
            )
            args = ACTION._publish_parser().parse_args([
                "--summary-file", str(source),
                "--artifact-url", "https://github.example/artifacts/42",
            ])
            with patch.dict(os.environ, {"GITHUB_STEP_SUMMARY": str(target)}, clear=False):
                published = ACTION.publish_summary(args)

            self.assertIn("https://github.example/artifacts/42", published)
            self.assertNotIn("GOVERNDIFF_ARTIFACT_URL", published)
            self.assertEqual(target.read_text(encoding="utf-8"), published)

    def test_gate_exit_code_is_two_after_reports_are_written(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            old = root / "old.md"
            new = root / "new.md"
            output = root / "report"
            old.write_text(
                "# Submission\n\nMembers may submit a request within 30 days.\n",
                encoding="utf-8",
            )
            new.write_text(
                "# Submission\n\nMembers must submit a request within 10 days.\n",
                encoding="utf-8",
            )
            code = ACTION.main([
                "--old", str(old),
                "--new", str(new),
                "--report-dir", str(output),
                "--min-confidence", "low",
                "--fail-on-severity", "medium",
            ])

            self.assertEqual(code, 2)
            self.assertTrue((output / "manifest.json").is_file())
            manifest = json.loads((output / "manifest.json").read_text(encoding="utf-8"))
            self.assertTrue(manifest["gate"]["failed"])
            self.assertGreater(manifest["gate"]["finding_count"], 0)

    def test_action_contract_exposes_production_inputs_outputs_and_upload_link(self) -> None:
        manifest = (ROOT / "action.yml").read_text(encoding="utf-8")
        for input_name in ("paths:", "base:", "old:", "new:", "artifact-name:"):
            self.assertIn(input_name, manifest)
        for output_name in (
            "report-manifest:", "report-summary:", "report-html:",
            "report-csv:", "artifact-url:", "files-audited:",
            "action-schema:", "release-channel:",
        ):
            self.assertIn(output_name, manifest)
        self.assertIn("id: report", manifest)
        self.assertIn("steps.report.outputs.artifact-url", manifest)
        self.assertIn("publish-summary", manifest)
        self.assertIn("actions/setup-python@v6", manifest)
        self.assertIn("actions/upload-artifact@v7", manifest)
        self.assertIn("GOVERNDIFF_INPUT_PATHS: ${{ inputs.paths }}", manifest)
        self.assertNotIn('--paths "${{ inputs.paths }}"', manifest)


if __name__ == "__main__":
    unittest.main()
