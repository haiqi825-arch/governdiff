"""Install-matrix smoke test for the CLI and report generators."""

from __future__ import annotations

import json
import argparse
import platform
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default="")
    args = parser.parse_args(argv)
    with tempfile.TemporaryDirectory(prefix="governdiff-platform-") as directory:
        target = Path(directory)
        json_report = target / "report.json"
        html_report = target / "report.html"
        old = ROOT / "examples" / "contributor-covenant" / "v2.1.md"
        new = ROOT / "examples" / "contributor-covenant" / "v3.0.md"
        common = [sys.executable, "-m", "governdiff", "diff", str(old), str(new)]
        subprocess.run(
            [*common, "--format", "json", "--output", str(json_report)],
            check=True,
            capture_output=True,
            text=True,
        )
        subprocess.run(
            [*common, "--format", "html", "--output", str(html_report)],
            check=True,
            capture_output=True,
            text=True,
        )
        report = json.loads(json_report.read_text(encoding="utf-8"))
        html = html_report.read_text(encoding="utf-8")
        passed = (
            report["schema_version"] == "1.5"
            and report["summary"]["total_changes"] > 0
            and "<!doctype html>" in html.lower()
            and "GovernDiff" in html
        )
    result = {
        "schema_version": "governdiff-platform-smoke/1.0",
        "platform": platform.system().lower(),
        "python": platform.python_version(),
        "cli": "python -m governdiff",
        "reports": ["json", "html"],
        "passed": passed,
    }
    rendered = json.dumps(result, ensure_ascii=False, sort_keys=True) + "\n"
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
