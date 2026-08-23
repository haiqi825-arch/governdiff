# GovernDiff release checklist

This checklist records both completed v0.6.0 publication evidence and the few
account-bound steps that remain. A checked box must have a public or reproducible
evidence path; it is not a substitute for a passing release gate.

## Local release candidate

- [x] Phase 1–7 regression, privacy, performance, accessibility, and schema gates
  have checked-in evidence.
- [x] Reviewer production assets are embedded in wheel and sdist candidates.
- [x] The sdist rebuilds a wheel without Node.js and the clean-installed wheel
  starts the loopback Reviewer and writes JSON/Markdown/HTML/CSV outputs.
- [x] Deployment metadata, external corpora, `node_modules`, caches, and local
  logs are excluded from Python artifacts.
- [x] Three synthetic public cases and expected checks are reproducible.
- [x] CONTRIBUTING, SECURITY, CHANGELOG, ROADMAP, issue forms, and PR template
  exist.
- [x] Corpus redistribution and dependency-licence decisions are documented.
- [x] Reviewer screenshots and demo GIF use synthetic sample data.
- [x] The public snapshot was assembled from an explicit synthetic-only allowlist
  and began with curated history that excludes the private engineering workspace.

Run the gate from the repository root:

```bash
cd reviewer-ui
npm ci
npm test
cd ..
PYTHONPATH=src python -m unittest discover -s tests -v
PYTHONPATH=src python scripts/validate_schemas.py
python scripts/verify_release_candidate.py
```

The release result is written to `release-candidate/` and is intentionally
ignored by Git. Record the wheel/sdist SHA-256 values in the release notes.

## Publication status

- [x] Review and approve the exact source diff and local history shape.
- [x] Publish `haiqi825-arch/governdiff` with curated commits.
- [x] Run and link hosted Windows/macOS/Linux, CodeQL, dependency, and artifact
  scan jobs.
- [x] Publish the tested Python artifacts as GitHub Release `v0.6.0`.
- [x] Create immutable Action tag `v1.0.2` and update the compatible
  Action `v1` tag according to `docs/ACTION_RELEASE_POLICY.md`.
- [ ] Bind the PyPI pending Trusted Publisher described in
  `docs/PYPI_RELEASE.md`, run the OIDC workflow, then install back from PyPI and
  repeat the five-minute quick start.
- [x] Publish GitHub Pages with the synthetic demo, social image, and technical
  article.
- [ ] Accept the GitHub Marketplace Developer Agreement and publish the prepared
  `v1.0.2` Action release draft.
- [ ] Deploy the public Reviewer from `reviewer-ui/` only after validating that
  no user document is uploaded and no telemetry is enabled.
- [x] Use the repository private vulnerability-reporting path for security
  disclosures.

## Abort conditions

Stop publication if the release-candidate gate is red, the working tree scope is
unclear, licence provenance is incomplete, a hosted gate is unavailable, or the
requested remote/version/deployment target has not been explicitly approved.
