"""Build the Python wheel twice and smoke-test it in a clean environment."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DATE_EPOCH = "1704067200"


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _run(command: list[str], *, environment: dict[str, str] | None = None) -> None:
    subprocess.run(
        command,
        cwd=ROOT,
        env=environment,
        check=True,
        capture_output=True,
        text=True,
    )


def verify() -> dict[str, object]:
    environment = os.environ.copy()
    environment.update({
        "SOURCE_DATE_EPOCH": SOURCE_DATE_EPOCH,
        "PYTHONHASHSEED": "0",
        "PYTHONDONTWRITEBYTECODE": "1",
        "PIP_DISABLE_PIP_VERSION_CHECK": "1",
    })
    with tempfile.TemporaryDirectory(prefix="governdiff-reproducible-") as directory:
        root = Path(directory)
        outputs = [root / "wheel-a", root / "wheel-b"]
        for output in outputs:
            output.mkdir()
            _run([
                sys.executable,
                "-m",
                "pip",
                "wheel",
                ".",
                "--no-deps",
                "--no-build-isolation",
                "--wheel-dir",
                str(output),
            ], environment=environment)
        wheels = [next(output.glob("governdiff-*.whl")) for output in outputs]
        hashes = [_sha256(wheel) for wheel in wheels]
        with zipfile.ZipFile(wheels[0]) as archive:
            names = set(archive.namelist())
        reviewer_assets = {
            "governdiff/_reviewer/scripts/review-session.mjs",
            "governdiff/_reviewer/dist/server/index.js",
            "governdiff/_reviewer/THIRD_PARTY_NOTICES.md",
        }
        wheel_contains_reviewer = reviewer_assets <= names and not any(
            "/.openai/" in name or name.endswith("/.openai/hosting.json")
            for name in names
        )

        clean = root / "clean-environment"
        _run([sys.executable, "-m", "venv", str(clean)], environment=environment)
        clean_python = clean / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
        _run([
            str(clean_python), "-m", "pip", "install", "--no-deps", str(wheels[0])
        ], environment=environment)
        report = root / "clean-report.json"
        case = ROOT / "examples" / "public-cases" / "01-incident-deadline"
        _run([
            str(clean_python),
            "-m",
            "governdiff",
            "diff",
            str(case / "old.md"),
            str(case / "new.md"),
            "--format",
            "json",
            "--output",
            str(report),
        ], environment=environment)
        payload = json.loads(report.read_text(encoding="utf-8"))
        passed = (
            hashes[0] == hashes[1]
            and wheel_contains_reviewer
            and payload["summary"]["total_changes"] > 0
        )
        return {
            "schema_version": "governdiff-reproducible-build/1.0",
            "source_date_epoch": SOURCE_DATE_EPOCH,
            "artifact": wheels[0].name,
            "sha256": hashes[0],
            "second_sha256": hashes[1],
            "byte_identical": hashes[0] == hashes[1],
            "wheel_contains_reviewer": wheel_contains_reviewer,
            "clean_install_smoke": payload["schema_version"] == "1.5",
            "passed": passed,
        }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default="")
    args = parser.parse_args(argv)
    try:
        result = verify()
    except Exception as error:  # noqa: BLE001
        result = {
            "schema_version": "governdiff-reproducible-build/1.0",
            "error_type": error.__class__.__name__,
            "passed": False,
        }
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
