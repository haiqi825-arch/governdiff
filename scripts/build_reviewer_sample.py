"""Build the Reviewer UI sample from the current public report contract."""

from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from governdiff import analyze_texts  # noqa: E402
from governdiff.report import render_json  # noqa: E402


OLD = """# GovernDiff Grant Policy

## Article 4 Review period

The Secretariat must issue an eligibility decision within 20 business days pursuant to Article 7.

## Article 7 Covered entities

Registered nonprofit organizations may apply for a grant.

## Article 9 Commencement

This policy takes effect on 2026-01-01.

## Article 12 Reporting

Recipients must submit an annual report within 30 days. They must notify the Secretariat.

## Article 20 Disclosures

Alpha governance disclosure remains unchanged.

Beta governance disclosure remains unchanged.
"""

NEW = """# GovernDiff Grant Policy

## Article 5 Review period

The Secretariat must issue an eligibility decision within 10 business days pursuant to Article 8.

## Article 8 Covered entities

Any registered organization, including for-profit entities, may apply for a grant.

## Article 10 Commencement

This policy takes effect on 2026-02-01.

## Article 13 Reporting

Recipients must submit an annual report within 30 days.

They must notify the Secretariat.

## Article 21 Disclosures

Alpha governance disclosure remains unchanged.

## Article 22 Disclosures

Beta governance disclosure remains unchanged.
"""


def main() -> None:
    report = analyze_texts(
        OLD,
        NEW,
        old_path="policies/grants-policy-2025.md",
        new_path="policies/grants-policy-2026.md",
        language="en",
    )
    output = ROOT / "reviewer-ui" / "public" / "sample-report.json"
    output.write_text(render_json(report), encoding="utf-8", newline="\n")
    print(output)


if __name__ == "__main__":
    main()
