"""Assemble a synthetic-only GovernDiff public source snapshot.

The source workspace is intentionally dirty and contains private release evidence
and external policy corpora. This script copies only an explicit allowlist into a
new directory, refuses overwrite, and emits a hash manifest for review.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "publication" / "governdiff"

TREE_ALLOWLIST = (
    "src",
    "schema",
    "examples/public-cases",
    "benchmark/phase3",
    "site",
    "tests/format_fixtures",
    "reviewer-ui/app",
    "reviewer-ui/build",
    "reviewer-ui/dist",
    "reviewer-ui/public",
    "reviewer-ui/tests",
    "reviewer-ui/worker",
    "docs/assets/action-demo",
)

FILE_ALLOWLIST = (
    ".gitattributes",
    ".gitignore",
    ".github/dependabot.yml",
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/feature_request.yml",
    ".github/pull_request_template.md",
    ".github/workflows/codeql.yml",
    ".github/workflows/governdiff.yml",
    ".github/workflows/pages.yml",
    ".github/workflows/pypi-publish.yml",
    ".github/workflows/quality-gates.yml",
    "LICENSE",
    "README.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "ROADMAP.md",
    "SECURITY.md",
    "GOVERNDIFF_PRD.md",
    "MANIFEST.in",
    "action.yml",
    "governdiff.example.yml",
    "pyproject.toml",
    "setup.py",
    "benchmark/ANNOTATION_GUIDE.md",
    "benchmark/PHASE_7_6_BROWSER.json",
    "benchmark/PHASE_7_DEPENDENCY_AUDIT.json",
    "benchmark/PHASE_7_PERFORMANCE.json",
    "benchmark/PHASE_7_PYTHON_BUILD.json",
    "benchmark/PHASE_7_REVIEWER_BUILD.json",
    "benchmark/PHASE_7_UI_PERFORMANCE.json",
    "benchmark/PHASE_7_WINDOWS_PLATFORM.json",
    "benchmark/PHASE_7_ZERO_EGRESS.json",
    "benchmark/schema/gold-case.schema.json",
    "docs/ACTION_RELEASE_POLICY.md",
    "docs/CORPUS_LICENSE_AUDIT.md",
    "docs/INPUT_FORMATS.md",
    "docs/LAUNCH_DEMO.md",
    "docs/PHASE_7_6_COMPLETION.zh-CN.md",
    "docs/PHASE_7_COMPLETION.zh-CN.md",
    "docs/PUBLIC_DEMO_READINESS.md",
    "docs/PUBLIC_REPOSITORY_POLICY.md",
    "docs/PYPI_RELEASE.md",
    "docs/RELEASE_CHECKLIST.md",
    "docs/REQUIREMENTS_TRACEABILITY_MATRIX.zh-CN.md",
    "docs/WHY_GOVERNDIFF.md",
    "docs/assets/README.md",
    "docs/assets/demo-access-scope.html",
    "docs/assets/demo-exception-authority.html",
    "docs/assets/demo-incident-deadline.html",
    "docs/assets/governdiff-gallery-cover.png",
    "docs/assets/governdiff-producthunt-thumbnail.png",
    "docs/assets/governdiff-social-preview-v2.png",
    "docs/assets/reviewer-decision.png",
    "docs/assets/reviewer-demo.gif",
    "docs/assets/reviewer-evidence.png",
    "docs/assets/reviewer-queue.png",
    "reviewer-ui/.gitignore",
    "reviewer-ui/README.md",
    "reviewer-ui/THIRD_PARTY_NOTICES.md",
    "reviewer-ui/eslint.config.mjs",
    "reviewer-ui/next.config.ts",
    "reviewer-ui/package-lock.json",
    "reviewer-ui/package.json",
    "reviewer-ui/scripts/benchmark-ui.mjs",
    "reviewer-ui/scripts/browser-gate.mjs",
    "reviewer-ui/scripts/build-browser-fixtures.mjs",
    "reviewer-ui/scripts/capture-public-demo.mjs",
    "reviewer-ui/scripts/preview.mjs",
    "reviewer-ui/scripts/review-session.mjs",
    "reviewer-ui/scripts/verify-reproducible-build.mjs",
    "reviewer-ui/tsconfig.json",
    "reviewer-ui/vite.config.ts",
    "reviewer-ui/vitest.config.ts",
    "scripts/benchmark_phase7.py",
    "scripts/build_demo_gif.py",
    "scripts/build_format_fixtures.py",
    "scripts/build_public_examples.py",
    "scripts/build_pages_site.py",
    "scripts/build_public_snapshot.py",
    "scripts/build_reviewer_sample.py",
    "scripts/check_pages_site.py",
    "scripts/check_public_documentation.py",
    "scripts/evaluate_phase3_benchmark.py",
    "scripts/github_action.py",
    "scripts/platform_smoke.py",
    "scripts/validate_schemas.py",
    "scripts/verify_python_runtime_matrix.py",
    "scripts/verify_release_candidate.py",
    "scripts/verify_reproducible_builds.py",
    "scripts/verify_zero_egress.py",
    "tests/test_checks.py",
    "tests/test_confidence_articles.py",
    "tests/test_config_fingerprints.py",
    "tests/test_document_alignment.py",
    "tests/test_extended_breaking_contract.py",
    "tests/test_extended_cli_config_contract.py",
    "tests/test_extended_cli_sop.py",
    "tests/test_extended_format_boundaries.py",
    "tests/test_extended_platform_paths.py",
    "tests/test_extended_security_boundaries.py",
    "tests/test_multiformat.py",
    "tests/test_phase3.py",
    "tests/test_phase3_benchmark.py",
    "tests/test_phase4.py",
    "tests/test_phase5.py",
    "tests/test_phase6.py",
    "tests/test_phase7.py",
    "tests/test_phase7_5.py",
    "tests/test_phase8.py",
)

FORBIDDEN_PARTS = {
    ".git",
    ".openai",
    ".agents",
    ".codex",
    ".npm-cache",
    ".pytest_cache",
    ".venv",
    ".vinext",
    "__pycache__",
    "browser-fixtures",
    "node_modules",
    "policy_corpus",
    "expansion_corpus",
}

FORBIDDEN_PATH_FRAGMENTS = (
    "benchmark/cases/",
    "examples/contributor-covenant/",
    "release-candidate",
    "window_handoff",
    "frontend_ui_polish_handoff",
)

_LOCAL_USERNAME = re.escape(Path.home().name.encode("utf-8"))
SECRET_PATTERNS = {
    "private key": re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "GitHub token": re.compile(rb"gh[pousr]_[A-Za-z0-9_]{20,}"),
    "AWS access key": re.compile(rb"AKIA[0-9A-Z]{16}"),
    "local username": re.compile(
        rb"(?i)(?:C:[\\/]Users[\\/]" + _LOCAL_USERNAME
        + rb"|/Users/" + _LOCAL_USERNAME + rb"|/home/" + _LOCAL_USERNAME + rb")"
    ),
}

BINARY_SUFFIXES = {
    ".docx",
    ".gif",
    ".ico",
    ".jpg",
    ".jpeg",
    ".pdf",
    ".png",
    ".woff",
    ".woff2",
    ".zip",
}


def _copy_public_file(source: Path, destination: Path, relative: Path) -> None:
    """Copy one file using the same text boundary declared by .gitattributes."""

    destination.parent.mkdir(parents=True, exist_ok=True)
    normalized = relative.as_posix()
    if (
        source.suffix.casefold() in BINARY_SUFFIXES
        or normalized.startswith("tests/format_fixtures/")
    ):
        shutil.copy2(source, destination)
        return

    payload = source.read_bytes()
    try:
        text = payload.decode("utf-8")
    except UnicodeDecodeError:
        shutil.copy2(source, destination)
        return
    normalized_text = text.replace("\r\n", "\n").replace("\r", "\n")
    destination.write_bytes(normalized_text.encode("utf-8"))


def _relative_files() -> list[Path]:
    selected: set[Path] = set()
    missing: list[str] = []

    for raw in FILE_ALLOWLIST:
        relative = Path(raw)
        source = ROOT / relative
        if not source.is_file():
            missing.append(raw)
        else:
            selected.add(relative)

    for raw in TREE_ALLOWLIST:
        tree = ROOT / raw
        if not tree.is_dir():
            missing.append(raw + "/")
            continue
        for source in tree.rglob("*"):
            if not source.is_file() or source.is_symlink():
                continue
            relative = source.relative_to(ROOT)
            if FORBIDDEN_PARTS.intersection(relative.parts) or any(
                part.endswith(".egg-info") for part in relative.parts
            ):
                continue
            selected.add(relative)

    if missing:
        raise RuntimeError("allowlisted source paths are missing: " + ", ".join(missing))

    for relative in selected:
        normalized = relative.as_posix().casefold()
        if FORBIDDEN_PARTS.intersection(relative.parts) or any(
            part.endswith(".egg-info") for part in relative.parts
        ):
            raise RuntimeError(f"forbidden path selected: {relative.as_posix()}")
        if any(fragment in normalized for fragment in FORBIDDEN_PATH_FRAGMENTS):
            raise RuntimeError(f"forbidden path selected: {relative.as_posix()}")
    return sorted(selected, key=lambda path: path.as_posix())


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build(output: Path) -> dict[str, object]:
    output = output.resolve()
    if output.exists():
        raise RuntimeError(f"refusing to overwrite existing output: {output}")
    output.mkdir(parents=True)

    copied: list[dict[str, object]] = []
    for relative in _relative_files():
        source = ROOT / relative
        destination = output / relative
        _copy_public_file(source, destination, relative)
        copied.append(
            {
                "path": relative.as_posix(),
                "bytes": destination.stat().st_size,
                "sha256": _sha256(destination),
            }
        )

    violations: list[str] = []
    for item in copied:
        path = output / str(item["path"])
        content = path.read_bytes()
        for label, pattern in SECRET_PATTERNS.items():
            if pattern.search(content):
                violations.append(f"{label}: {item['path']}")
    if violations:
        raise RuntimeError("publication scan failed: " + "; ".join(violations))

    manifest = {
        "schema_version": "governdiff-publication-manifest/1.0",
        "policy": "synthetic-only-explicit-allowlist",
        "file_count": len(copied),
        "files": copied,
        "excluded_categories": [
            "external policy corpora and derived Gold cases",
            "internal handoffs and raw acceptance workpapers",
            "hosting configuration and local machine state",
            "unapproved build outputs, release candidates, caches, and temporary files",
        ],
    }
    (output / "PUBLICATION_MANIFEST.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    try:
        result = build(args.output)
    except (OSError, RuntimeError) as error:
        parser.error(str(error))
    print(
        json.dumps(
            {
                "output": str(args.output.resolve()),
                "file_count": result["file_count"],
                "policy": result["policy"],
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
