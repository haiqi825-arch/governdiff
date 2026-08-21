# GovernDiff input formats and preflight

GovernDiff 0.6 accepts digital-text PDF, DOCX, HTML, Markdown, and TXT files.
OCR is deliberately not bundled or invoked.

## Evidence contract

| Format | Structure retained | Evidence location | Tables |
| --- | --- | --- | --- |
| PDF | physical pages, extracted lines/paragraphs, simple headings and lists | page number, extracted paragraph index, page character interval | cells are not inferred from arbitrary visual layouts in the current release |
| DOCX | heading styles/outline levels, body paragraphs, real lists, tables | paragraph index and extracted character interval | row, column, spans, header flag and cell text |
| HTML | main/article/body structure, headings, paragraphs, lists and tables | extracted paragraph index and character interval | row, column, spans, header flag and cell text |
| Markdown/TXT | headings, articles, paragraphs and lists | source lines, paragraph index and source character interval | plain text in the current release |

Table cells are regular GovernDiff blocks, so they enter alignment, semantic
checks, fingerprints, confidence scoring, and reports. Report JSON includes the
full normalized table model under each document's `tables` field.

## Preflight

Run preflight without starting a comparison:

```bash
governdiff preflight policy.pdf
governdiff preflight policy.docx --format json
```

Every issue contains a stable code plus `reason`, `impact`, and `next_step`.
Errors stop parsing; warnings remain attached to the report.

| Code | Level | Meaning |
| --- | --- | --- |
| `file-not-found` / `file-unavailable` / `not-a-file` | error | path is missing, inaccessible, or not a regular file |
| `unsupported-format` | error | no supported evidence parser exists |
| `empty-file` / `empty-document` | error | no readable policy content |
| `file-too-large` | error | file is larger than 25 MB |
| `too-many-pages` | error | PDF is longer than 300 pages |
| `invalid-pdf` / `invalid-docx` / `invalid-html` | error | corrupt, incomplete, or unreadable source |
| `encrypted-pdf` | error | PDF is password protected |
| `suspected-scanned-pdf` | error | pages exist but no digital text is extractable |
| `garbled-text` | warning or error | invalid/control/private-use character rate is elevated |
| `low-text-coverage` | warning | fewer than 60% of PDF pages carry substantial text |
| `blank-pages` | warning | one or more PDF pages yielded no text |

## OCR boundary

GovernDiff does not run OCR locally or remotely in this phase. A wholly
image-only PDF returns `suspected-scanned-pdf` and recommends external OCR or a
digital source. Mixed PDFs continue with a warning so reviewers can see which
pages contributed no evidence.

## Noise suppression

- Repeated PDF first/last lines appearing on at least 60% of pages are removed
  as likely running headers or footers.
- Standalone page-number patterns are removed.
- DOCX header/footer parts do not enter body comparison.
- HTML `nav`, `header`, `footer`, `script`, `style`, `aside`, forms, SVG and
  other site furniture are excluded.
- Recognized table-of-contents blocks remain auditable as
  `document-noise-changed` with `info` severity and never count as Breaking.

Noise rules are intentionally conservative. Review the extracted evidence when
the preflight result is `warning`.

## Complex-layout limitations

- PDF evidence always uses physical page numbers. Printed page labels in page
  artwork are treated as text/noise and are not used as evidence coordinates.
- Rotated 90/180/270-degree digital-text pages and landscape pages are accepted;
  reviewers must still check extracted reading order.
- Arbitrary visual PDF columns and cross-page PDF tables are flattened to the
  text order returned by `pypdf`; GovernDiff 0.6 does not infer PDF table cells.
- Font ligatures are Unicode-normalized when the PDF exposes them as text, but
  custom font maps that do not expose valid Unicode may yield garbled-text or
  low-coverage diagnostics.
- DOCX pagination is not reconstructed. Page breaks and cross-page tables retain
  paragraph/table evidence, not Word's rendered physical page number.
- Symlinks and network shares are read as ordinary files after the operating
  system resolves them. Availability, credentials, concurrent remote writes,
  and platform-specific link policy remain the operator's responsibility;
  GovernDiff rejects a source whose file signature changes during parsing.
