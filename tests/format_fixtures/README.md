# Phase 2 format fixtures

These deterministic fixtures exercise the P0 input contract.

| Fixture | Purpose |
| --- | --- |
| `digital_policy_old.pdf` / `digital_policy_new.pdf` | three-page digital PDF, physical page evidence, TOC and repeated header/footer suppression |
| `policy_old.docx` / `policy_new.docx` | headings, real lists, paragraph indices, fixed-geometry table, headers/footers and a page break |
| `policy_old.html` / `policy_new.html` | main content extraction, navigation/script/style removal, lists, TOC and table model |
| `toc_noise_old.html` / `toc_noise_new.html` | TOC-only change downgraded to info/non-Breaking |
| `mixed_text_coverage.pdf` | one text page plus two blank pages |
| `scanned_like.pdf` | page with no digital text; OCR-negative acceptance case |
| `encrypted.pdf` | password-protected PDF (`governdiff-test`) |
| `corrupt.pdf` / `corrupt.docx` | invalid container diagnostics |
| `empty.txt` / `garbled.txt` | empty and invalid-character diagnostics |

Rebuild from the repository root with:

```bash
python scripts/build_format_fixtures.py
```

The source PDF and DOCX pairs were rendered page-by-page and visually checked
for headings, lists, tables, page furniture, clipping, overlap, and missing
glyphs. Generated PNG/PDF QA intermediates are intentionally not checked in.
