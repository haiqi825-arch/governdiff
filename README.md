# GovernDiff

![GovernDiff Policy CI: a policy deadline changes and the CI gate blocks it](docs/assets/governdiff-social-preview-v2.png)

**Policy changes, reviewed like code.**

GovernDiff is local-first Policy CI for PDF, DOCX, HTML, Markdown, and text. It
aligns clauses even when they move, detects review-worthy changes to duties,
scope, deadlines, exceptions, and authority, and produces evidence a person can
verify. No document upload or LLM is required.

[Live demo](https://haiqi825-arch.github.io/governdiff/) ·
[PyPI](https://pypi.org/project/governdiff/) ·
[GitHub Action Marketplace](https://github.com/marketplace/actions/governdiff-policy-review) ·
[Release](https://github.com/haiqi825-arch/governdiff/releases/tag/v0.6.0) ·
[Feedback / boundary cases](https://github.com/haiqi825-arch/governdiff/discussions/10) ·
[Technical article](https://haiqi825-arch.github.io/governdiff/articles/policy-ci-without-uploading-documents.html) ·
[30-second walkthrough](docs/LAUNCH_DEMO.md) ·
[Why GovernDiff?](docs/WHY_GOVERNDIFF.md) ·
[Input boundaries](docs/INPUT_FORMATS.md) ·
[Public repository policy](docs/PUBLIC_REPOSITORY_POLICY.md) ·
[GitHub Action](#github-action)

```text
Before: Vendors may report incidents within 72 hours.
After:  Vendors must report incidents within 24 hours.

GovernDiff: modality-strengthened · deadline-shortened · CI gate failed
```

### Try it now

Install the published package and generate a self-contained HTML report from
two local policy files:

```bash
python -m pip install governdiff
governdiff diff old-policy.md new-policy.md --format html --output report.html
```

[Try the synthetic demo](https://haiqi825-arch.github.io/governdiff/demo/incident-deadline.html) ·
[Use the GitHub Action](https://github.com/marketplace/actions/governdiff-policy-review)

### What you get

- Deterministic English and Chinese checks with stable `GVD-*` fingerprints
- Before/after evidence locations, confidence reasons, and four report formats
- A local Reviewer for human decisions, field corrections, and portable waivers
- A pull-request gate that retains complete evidence even when the check fails

> `Breaking` is a deterministic review cue, not a legal-risk, policy-effect, or
> compliance conclusion. A responsible human reviewer must verify important
> changes and their source evidence.

> 中文简介：GovernDiff 把政策、章程、行为准则等自然语言文件当作“可审查代码”，
> 识别新增义务、限制、权限主体、范围、例外、期限和数值阈值的变化，并可在 CI 中阻断
> 未经审查的高风险变更。完整产品定义见 [GOVERNDIFF_PRD.md](GOVERNDIFF_PRD.md)。

## What works in v0.6

The authoritative v0.6 release boundary and all FR/NFR dispositions are recorded
in [`docs/REQUIREMENTS_TRACEABILITY_MATRIX.zh-CN.md`](docs/REQUIREMENTS_TRACEABILITY_MATRIX.zh-CN.md).
Longer-term PRD items are not implied release promises.

- Digital PDF parsing with physical pages, paragraph evidence, scan detection, and repeated header/footer suppression
- DOCX headings, paragraphs, real lists, tables, and paragraph indices
- HTML policy-body extraction with site-chrome, script, and style removal
- Markdown and text parsing with section, line, paragraph, and character evidence
- Actionable preflight for empty, corrupt, encrypted, garbled, low-coverage, and image-only inputs
- A shared table/cell model whose DOCX and HTML cells participate in comparison
- 25 MB and 300-page hard limits with reason, impact, and next-step diagnostics
- Clause alignment across edits, moves, one-to-many splits, and many-to-one merges
- Added, removed, modified, split, merged, moved, and format-only classification
- Token-level equal/insert/delete/replace spans for English and Chinese evidence
- Explainable English and Chinese breaking checks
- The 15-check v0.6 contract: modality strengthened/weakened, permission removed,
  prohibition added, scope expanded/narrowed, authority shifted, deadline
  shortened/extended, threshold changed, exception added/removed, effective date
  shifted, definition changed, and reference retargeted
- Stable `GVD-*` finding fingerprints and dated, approver-attributed waivers
- Explainable `high` / `medium` / `low` confidence on every change and finding
- Evidence-backed article-number remapping, including ranked candidates, competition scores, and unresolved conflict states
- Cross-reference retargeting and structured effective-date/deadline changes
- A report-level chapter tree with change, Breaking, type, and confidence counts
- JSON, Markdown, self-contained HTML, and one-finding-per-row CSV reports
- Shared `all` / `breaking` / `confirmed` / `unreviewed` / `filtered` export scopes
- Redacted exports that remove full block/table text and bound evidence excerpts
- Generator, timestamp, complete document hashes, scope metadata, and the non-legal-advice disclaimer in every format
- Published report 1.5, review 1.1, and waiver 1.0 JSON Schemas with checked-in examples and a compatibility policy
- `diff`, `changelog`, `breaking`, one-command local `review`, and Git-baseline `check` commands
- A release-ready composite GitHub Action with automatic PR-base globs, added/deleted files,
  compact Job Summary, complete artifacts, and confidence-aware gating
- Standard `unreviewed` / `confirmed` / `rejected` / `modified` / `waived` review states in report schema 1.5
- Machine/effective dual values for human-edited actor, deadline, scope, and other extracted fields
- Portable `governdiff-review/1.1` export and CLI re-import, including alignment repair and reviewer notes
- A browser Reviewer UI with batch decisions, persistent quality warnings, waiver generation, project clearing, and keyboard/screen-reader support
- Three synthetic end-to-end fixtures covering deadlines, scope, exceptions, and authority

OCR, URL import, optional AI, result caching, public Reviewer hosting, and direct
PR-page review interactions remain outside the current release. The CLI, Action,
and local-first review workflow are usable with all five supported formats.

## Supported environment and current verification

| Surface | Declared support | Pre-release verification boundary |
|---|---|---|
| Python CLI | CPython 3.10–3.13 | Windows local matrix; hosted Ubuntu and macOS remain release gates |
| Local Reviewer | Node.js 22.13 or newer | Node 22.13, latest 22 LTS, and latest 24 LTS on Windows |
| Inputs | PDF, DOCX, HTML, Markdown, plain text | Digital text only; image-only PDF is diagnosed and OCR is not performed |
| Reports | JSON, Markdown, self-contained HTML, CSV | Browser printing/PDF is not a supported export contract |
| Browser review | Current Chrome/Chromium | Automated DOM, layout, keyboard, axe, and performance gates; visible Chrome and assistive-technology sign-off remain manual release gates |

Policy text and reviewer decisions stay local. GovernDiff has no telemetry,
account, remote document store, or public processing service in this release.

## Quick start

Python 3.10+ is required. The interactive local Reviewer additionally requires
Node.js 22.13+. Install the current release from PyPI:

```bash
python -m pip install governdiff
governdiff diff old-policy.md new-policy.md --format html --output report.html
governdiff review old-policy.md new-policy.md --output-dir reviewed
```

From a source checkout, install the current tree directly:

```bash
python -m pip install .
```

For contributors working from this source tree:

```bash
python -m pip install -e .
governdiff breaking \
  examples/public-cases/01-incident-deadline/old.md \
  examples/public-cases/01-incident-deadline/new.md
```

Without installing, run directly from a clone:

```bash
PYTHONPATH=src python -m governdiff diff old-policy.md new-policy.md
```

PowerShell equivalent:

```powershell
$env:PYTHONPATH = "src"
python -m governdiff diff old-policy.md new-policy.md
```

Uninstall the package with:

```bash
python -m pip uninstall governdiff
```

If a command fails, first run `governdiff preflight <document> --format json`.
Each input diagnostic includes a reason, impact, and next step. A local review
that was closed before export must be started again; completed final reports
are never stored on a remote service. If an output file is locked or its
directory is read-only, choose a writable output path and rerun the command—the
previous valid file is left intact.

Generate JSON for another tool:

```bash
governdiff diff old.md new.md --format json --output report.json
```

Generate a single-file HTML report that opens without a server, or a CSV with
one finding per data row:

```bash
governdiff diff old.md new.md --format html --output report.html
governdiff diff old.md new.md --format csv --output findings.csv
```

Every format uses the same scope and filter model:

```bash
governdiff diff old.md new.md --scope confirmed --format html --output confirmed.html
governdiff diff old.md new.md --scope unreviewed --format csv --output queue.csv
governdiff diff old.md new.md --scope filtered \
  --filter-check deadline-shortened --filter-severity high --format json
```

To export exactly the changes visible in the Reviewer, export its review JSON,
re-import it with `--review`, and select `--scope filtered`. The review file
carries the visible change fingerprints. Add `--redacted` to any format to
remove full block/table text and bound evidence/value excerpts.

Re-apply a Reviewer decision log so decisions and human field edits affect the
CLI report:

```bash
governdiff diff old.md new.md --review governdiff-review.json --format json --output reviewed-report.json
```

Run the complete local review loop without manually moving report or review
files:

```bash
governdiff review old.pdf new.pdf --output-dir reviewed
```

This preflights and compares both inputs, starts the Reviewer only on
`127.0.0.1`, opens the generated report, receives the exported review, reapplies
it, and writes final JSON, Markdown, self-contained HTML, and CSV reports. Use
`--port`, `--language`, `--config`, `--review`, `--no-open`, or `--redacted` as
needed. The random session token is passed over child-process stdin and stored
only in an HttpOnly, SameSite cookie; it never appears in the URL. Temporary
artifacts are removed after confirmation, or can be retained explicitly with
`--keep-session`.

Preflight a document before comparison:

```bash
governdiff preflight policy.pdf
governdiff preflight handbook.docx --format json
```

Image-only PDFs are identified, but GovernDiff does not run OCR. See
[`docs/INPUT_FORMATS.md`](docs/INPUT_FORMATS.md) for evidence fields, limits,
error codes, and the explicit OCR boundary.

Show only unwaived breaking findings:

```bash
governdiff breaking old.md new.md --min-confidence medium
```

Every score is accompanied by machine-readable reasons. `high` begins at
`0.80`, `medium` at `0.62`; lower scores remain visible rather than being
silently discarded. Article mappings are emitted at report level and attached
to affected changes, for example `Article 4 → Article 5` or `第二条 → 第三条`.

## Policy CI

Copy `governdiff.example.yml` to `.governdiff.yml`, adjust the document globs,
then compare working-tree policies with a Git baseline:

```bash
governdiff check --base origin/main --config .governdiff.yml
```

Exit codes are `0` for pass, `1` for a tool/configuration error, and `2` when an
active finding reaches both `checks.fail_on` and `checks.min_confidence`.

Waivers live in `.governdiff-waivers.yml`:

```yaml
schema_version: governdiff-waiver/1.0
waivers:
  - fingerprint: GVD-0123456789
    reason: Approved by the governance council in decision 2026-08.
    approved_by: Governance Council
    created_at: 2026-08-09T08:14:00+00:00
    expires_at: 2027-08-09
```

`reason`, `approved_by`, `created_at`, and `expires_at` are required. Expired
waivers are not applied and appear as explicit report diagnostics. The 0.6
loader still accepts legacy `approver` as a migration alias.

## Public schemas

Versioned contracts and examples live under [`schema/`](schema/):

- [`report.schema.json`](schema/report.schema.json) — report `1.5`;
- [`review.schema.json`](schema/review.schema.json) — `governdiff-review/1.1`;
- [`waiver.schema.json`](schema/waiver.schema.json) — `governdiff-waiver/1.0`;
- [`action-manifest.schema.json`](schema/action-manifest.schema.json) —
  `governdiff-action/1.0` aggregate Action runs;
- [`COMPATIBILITY.md`](schema/COMPATIBILITY.md) — additive 1.x changes,
  deprecation, and 2.0 conditions.

Validate all checked-in examples plus a live engine report without installing a
schema-validation dependency:

```bash
PYTHONPATH=src python scripts/validate_schemas.py
```

## GitHub Action

Use the stable `v1` channel as a composite Action. In a pull request it resolves
the base SHA automatically, selects only changed files matching a single path or
glob, and handles modified, added, deleted, and renamed policies. Each
file gets full JSON, Markdown, self-contained HTML, and CSV reports.

```yaml
steps:
  - uses: actions/checkout@v6
  - uses: haiqi825-arch/governdiff@v1
    with:
      paths: |
        GOVERNANCE.md
        SECURITY.md
        policies/**/*.md
        policies/**/*.pdf
        policies/**/*.docx
        policies/**/*.html
      min-confidence: medium
      fail-on-severity: high
      fail-on-breaking: "true"
```

The compact Job Summary reports gate reason, per-file counts, stable finding
fingerprints, and the actual uploaded artifact URL. The artifact contains
`manifest.json`, `summary.md`, and four complete formats under each file's
report directory. Outputs include `action-schema`, `release-channel`,
`gate-failed`, `files-audited`, `breaking-count`, `report-manifest`,
`report-summary`, `report-dir`, and `artifact-url`. The legacy `old`/`new`
inputs and single-file report outputs remain available for explicit version
pairs. Set `fail-on-breaking: "false"` for an advisory rollout while retaining
annotations and complete evidence.

See [`docs/ACTION_RELEASE_POLICY.md`](docs/ACTION_RELEASE_POLICY.md) for immutable
`v1.x.y`, compatible `v1`, and commit-SHA pinning rules.

The bundled artifact step uses `actions/upload-artifact@v7` and therefore
targets GitHub.com/GitHub Enterprise Cloud. GitHub Enterprise Server does not
currently support `upload-artifact@v4+`; GHES consumers must replace or disable
that step rather than assuming artifact parity.

## Reviewer UI

The standalone app lives in `reviewer-ui/` and opens any GovernDiff
`report.json`. It supports chapter, change-type, confidence, Breaking,
review-status, and text filters; displays word-level evidence and competing
article mappings; edits extracted fields without overwriting machine values;
performs batch decisions; keeps quality warnings visible; stores review and
manual alignment decisions in an atomic IndexedDB project; generates waiver YAML; and
imports or exports a portable `governdiff-review/1.1` decision log. The CLI
accepts that log with `--review`. When started through `governdiff review`, the
workspace uses an isolated, loopback-backed temporary session rather than the
normal IndexedDB project, and returns Export directly to the waiting CLI.

```bash
cd reviewer-ui
npm ci
npm run dev
```

No policy text or reviewer decision leaves the machine. The CLI session server
has no CORS permission and rejects non-loopback Host, cross-origin requests,
invalid session cookies, and unexpected methods.

Three synthetic end-to-end examples live under
[`examples/public-cases/`](examples/public-cases/). Publication-safe screenshots
and a short demo are under [`docs/assets/`](docs/assets/); external regression
corpora are not included in Python release artifacts. See
[`docs/CORPUS_LICENSE_AUDIT.md`](docs/CORPUS_LICENSE_AUDIT.md) before publishing
any repository snapshot or corpus file.

## Tests

```bash
PYTHONPATH=src python -m unittest discover -s tests -v
```

The Phase 2 format fixtures and failure cases live in
[`tests/format_fixtures/`](tests/format_fixtures/). Rebuild them with
`python scripts/build_format_fixtures.py`.

The focused Phase 3 benchmark covers split, merge, word replacement,
cross-reference, effective-date, mapping-conflict, and section-tree behavior:

```bash
python scripts/evaluate_phase3_benchmark.py --strict
```

The Phase 6 suite creates an isolated real Git repository with two commits and
tests modified, added, deleted, renamed, and ignored files without mocking Git:

```bash
PYTHONPATH=src python -m unittest tests.test_phase6 -v
```

Phase 7 adds strict privacy, performance, platform, supply-chain, and clean-build
gates. The local evidence can be reproduced with:

```bash
PYTHONPATH=src python -m unittest tests.test_phase7 -v
python scripts/verify_zero_egress.py
python scripts/benchmark_phase7.py --strict
python scripts/verify_reproducible_builds.py
cd reviewer-ui
npm run test:performance
npm run test:browser
npm run test:reproducible
npm audit --audit-level=high
```

The checked-in CI matrix installs the package and generates JSON/HTML reports
on Windows, macOS, and Linux. It also runs Dependabot, CodeQL, Python/npm audits,
and an Anchore scan over the assembled Python wheel and Reviewer build. See
[`docs/PHASE_7_COMPLETION.zh-CN.md`](docs/PHASE_7_COMPLETION.zh-CN.md) for the
measured results and the current no-remote hosted-run boundary.

Phase 7.6 promotes the Reviewer gate to a real Chrome/React/DOM/layout test with
a deterministic 5,000-change report, bounded list rendering, recovery and local
session paths, responsive checks, keyboard/focus assertions, and axe-core. See
[`docs/PHASE_7_6_COMPLETION.zh-CN.md`](docs/PHASE_7_6_COMPLETION.zh-CN.md) and
[`benchmark/PHASE_7_6_BROWSER.json`](benchmark/PHASE_7_6_BROWSER.json).

Phase 8 release preparation adds a combined wheel/sdist with the built Reviewer,
a clean-install loopback smoke test, publication-safe examples and media, and
the open-source collaboration/release documents. Run the local release gate with:

```bash
python scripts/verify_release_candidate.py
```

It does not upload, tag, push, deploy, or otherwise publish anything. The
publication-only checklist is in [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md).

## Validation benchmark

The public repository uses synthetic, GovernDiff-authored cases for its
repeatable release and regression gates. They evaluate change types, clause
pairing, semantic checks, Breaking classification, article remapping, confidence
calibration, formats, and failure boundaries without redistributing third-party
policy corpora.

```bash
python scripts/evaluate_phase3_benchmark.py --strict
PYTHONPATH=src python -m unittest discover -s tests -v
```

External-source evaluation material is maintained outside the public release
snapshot until every source has an explicit redistribution decision. Public
availability alone is not treated as a licence.

## Accuracy contract

GovernDiff findings are evidence-backed review cues. A deterministic match such
as `scope-expanded` says why the text triggered a rule; it does not claim to
replace legal interpretation. Low-confidence semantic changes remain visible as
`substantive-text-changed` instead of being silently discarded.

## License

GovernDiff source code, synthetic examples, and public demo material are MIT
licensed. Third-party dependency notices are recorded in
[`reviewer-ui/THIRD_PARTY_NOTICES.md`](reviewer-ui/THIRD_PARTY_NOTICES.md).
