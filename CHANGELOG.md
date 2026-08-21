# Changelog

All notable changes are recorded here. The format follows Keep a Changelog and
versions follow Semantic Versioning after public release.

## [Unreleased]

### Added

- Phase 8 local release preparation: Python wheel/sdist packaging with the
  built-in local Reviewer, clean-install loopback smoke testing, and release
  artifact inspection.
- Three synthetic, publication-safe end-to-end examples with deterministic
  reports, screenshots, and demo GIF assets.
- Contributing, security, roadmap, release checklist, corpus licence audit, and
  GitHub issue/pull-request templates.
- Evidence-first Reviewer visual system with revised typography, colour,
  information hierarchy, queue layout, evidence comparison, and decision flow.
- A release-scope decision and 86-row FR/NFR traceability matrix.
- Exact bilingual contract tests for all 15 v0.6 Breaking Checks and strict
  configuration-schema tests.
- Boundary coverage at 299/300/301 pages and 24.9/25.0/25.1 MB, plus encoding,
  line-ending, hidden-HTML, complex-DOCX, and complex-PDF cases.

### Changed

- Release candidates exclude Sites deployment configuration, external policy
  corpora, Node development dependencies, and local development artifacts.
- CI release assembly now verifies the combined Python-plus-Reviewer artifact.
- Preflight now warns when PDF annotations/forms/attachments/signatures or DOCX
  revisions/comments/notes/fields/images/protection/signatures cannot be fully
  represented in clause evidence.
- HTML extraction excludes template content and elements explicitly hidden with
  HTML, ARIA, or inline CSS.
- Configuration v1 rejects unknown keys, check IDs, invalid values, and malformed
  document declarations instead of silently accepting misspellings.

### Security

- Installed Reviewer discovery prefers the wheel-contained resource directory
  while preserving the explicit development override.
- Markdown and CSV exports neutralize active-link/image and spreadsheet-formula
  payloads; HTML remains escaped and self-contained.

## [0.6.0] - 2026-08-11

- Published report 1.5, review 1.1, and waiver 1.0 contracts.
- Added multi-format reports, redaction and scoped exports, production composite
  Action behavior, and the local Reviewer decision loop.

Release links are intentionally omitted until a public remote exists.
