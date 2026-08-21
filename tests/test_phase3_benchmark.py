from __future__ import annotations

import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from evaluate_phase3_benchmark import evaluate  # noqa: E402


class PhaseThreeBenchmarkTests(unittest.TestCase):
    def test_all_focused_phase_three_cases_pass(self) -> None:
        result = evaluate()
        self.assertEqual(result["passed"], result["case_count"], result["results"])
        self.assertEqual(result["case_count"], 7)


if __name__ == "__main__":
    unittest.main()
