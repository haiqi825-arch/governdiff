"""Verify an installed wheel across explicit Python runtimes."""

from __future__ import annotations

import argparse
import csv
import json
import subprocess
import tempfile
from pathlib import Path

from verify_release_candidate import _smoke_installed_reviewer


ROOT = Path(__file__).resolve().parents[1]


def _run(command: list[str], *, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=cwd,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )


def verify_runtime(python: Path) -> dict[str, object]:
    version = _run(
        [str(python), "-c", "import platform; print(platform.python_version())"],
        cwd=ROOT,
    ).stdout.strip()
    package_version = _run(
        [str(python), "-m", "governdiff", "--version"], cwd=ROOT
    ).stdout.strip()
    with tempfile.TemporaryDirectory(prefix=f"governdiff-python-{version}-") as temp:
        work = Path(temp)
        old = ROOT / "examples" / "public-cases" / "01-incident-deadline" / "old.md"
        new = ROOT / "examples" / "public-cases" / "01-incident-deadline" / "new.md"
        outputs = {
            "json": work / "report.json",
            "markdown": work / "report.md",
            "html": work / "report.html",
            "csv": work / "report.csv",
        }
        for format_name, output in outputs.items():
            _run(
                [
                    str(python),
                    "-m",
                    "governdiff",
                    "diff",
                    str(old),
                    str(new),
                    "--format",
                    format_name,
                    "--output",
                    str(output),
                ],
                cwd=work,
            )
        report = json.loads(outputs["json"].read_text(encoding="utf-8"))
        markdown = outputs["markdown"].read_text(encoding="utf-8")
        html = outputs["html"].read_text(encoding="utf-8")
        with outputs["csv"].open(encoding="utf-8", newline="") as handle:
            csv_rows = list(csv.DictReader(handle))
        formats_passed = (
            report["schema_version"] == "1.5"
            and report["summary"]["total_changes"] > 0
            and "GovernDiff" in markdown
            and "<!doctype html>" in html.casefold()
            and bool(csv_rows)
        )
        reviewer_work = work / "reviewer"
        reviewer_work.mkdir()
        reviewer = _smoke_installed_reviewer(python, reviewer_work)
    return {
        "python": version,
        "package": package_version,
        "formats": list(outputs),
        "formats_passed": formats_passed,
        "packaged_reviewer": reviewer,
        "passed": formats_passed and bool(reviewer["passed"]),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--python", action="append", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    runtimes = [verify_runtime(Path(value).resolve()) for value in args.python]
    result = {
        "schema_version": "governdiff-python-runtime-matrix/1.0",
        "runtimes": runtimes,
        "passed": all(bool(runtime["passed"]) for runtime in runtimes),
    }
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(rendered, encoding="utf-8", newline="\n")
    print(rendered, end="")
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
