from __future__ import annotations

import csv
import io
import json
import tempfile
import unittest
from pathlib import Path

from governdiff import analyze_texts
from governdiff.document import parse_document, parse_text
from governdiff.report import render_csv, render_html, render_json, render_markdown


class ExtendedSecurityBoundaryTests(unittest.TestCase):
    def test_html_escapes_active_content_from_every_evidence_side(self) -> None:
        payloads = [
            "<script>alert(1)</script>",
            "</script><img src=x onerror=alert(1)>",
            "<svg onload=alert(1)>",
            "<a href=javascript:alert(1)>click</a>",
            "</style><style>body{display:none}</style>",
        ]
        for payload in payloads:
            with self.subTest(payload=payload):
                report = analyze_texts(
                    "# Policy\n\nSafe text.\n",
                    f"# Policy\n\n{payload}\n",
                )
                html = render_html(report).casefold()
                self.assertNotIn("<script", html)
                self.assertNotIn("<svg", html)
                self.assertNotIn("<img", html)
                self.assertNotIn("<a href=javascript:", html)
                self.assertIn("&lt;", html)

    def test_csv_prefixes_formula_like_user_values(self) -> None:
        for prefix in ("=", "+", "-", "@"):
            with self.subTest(prefix=prefix):
                report = analyze_texts(
                    "# Policy\n\nMembers may submit text.\n",
                    f"# Policy\n\n{prefix}SUM(1,1) Members must submit text.\n",
                )
                rows = list(csv.DictReader(io.StringIO(render_csv(report))))
                self.assertTrue(rows)
                for row in rows:
                    for value in row.values():
                        self.assertFalse((value or "").lstrip().startswith(("=", "+", "-", "@")))

    def test_markdown_link_destinations_and_external_images_are_not_retained(self) -> None:
        document = parse_text(
            "# Policy\n\n[Policy](javascript:alert(1)) ![tracker](https://example.invalid/x.png)\n"
        )
        text = "\n".join(block.text for block in document.blocks)
        self.assertIn("Policy", text)
        self.assertIn("tracker", text)
        report = analyze_texts("# Policy\n\nSafe.\n", f"# Policy\n\n{text}\n")
        rendered = render_markdown(report)
        self.assertNotIn("](javascript:", rendered)
        self.assertNotIn("](https://", rendered)
        self.assertNotIn("![", rendered)

    def test_html_parser_does_not_retain_script_style_or_external_resource_urls(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "malicious.html"
            path.write_text(
                "<html><body><main><h1>Policy</h1>"
                "<script>fetch('https://evil.invalid')</script>"
                "<style>@import url(https://evil.invalid/x.css)</style>"
                "<img src='https://evil.invalid/pixel'>"
                "<p onclick='alert(1)'>Members must report incidents.</p>"
                "</main></body></html>",
                encoding="utf-8",
            )
            document = parse_document(path)
        text = "\n".join(block.text for block in document.blocks)
        self.assertEqual("Members must report incidents.", text)
        self.assertNotIn("evil.invalid", text)
        self.assertNotIn("onclick", text)

    def test_deep_json_like_and_prototype_keys_remain_inert_text(self) -> None:
        payload = json.dumps({"__proto__": {"polluted": True}, "constructor": {"prototype": {"x": 1}}})
        report = analyze_texts("# P\n\nOld.\n", f"# P\n\n{payload}\n")
        before = getattr(object, "polluted", None)
        for renderer in (render_json, render_markdown, render_html, render_csv):
            self.assertTrue(renderer(report))
        self.assertEqual(before, getattr(object, "polluted", None))

    def test_long_unbroken_and_bidi_text_is_bounded_by_rendering_contract(self) -> None:
        payload = "https://example.invalid/" + ("A" * 100_000) + "\u202eexe.txt"
        report = analyze_texts("# P\n\nOld.\n", f"# P\n\n{payload}\n")
        html = render_html(report)
        markdown = render_markdown(report)
        self.assertIn("overflow-wrap:anywhere", html)
        self.assertLess(len(markdown), 20_000)


if __name__ == "__main__":
    unittest.main()
