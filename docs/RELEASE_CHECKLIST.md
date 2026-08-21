# GovernDiff release checklist

This checklist separates local release preparation from publication. Completing
the first section does not authorize any remote, tag, upload, release, or
deployment action.

The next window must repeat the final local acceptance in
`docs/PRE_RELEASE_FINAL_ACCEPTANCE_PLAN.zh-CN.md` and record the result in
`docs/PRE_RELEASE_FINAL_ACCEPTANCE_REPORT.zh-CN.md` before any publication
authorization is considered.

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
- [x] Local history/remote state was inspected without rewriting or creating a
  remote: branch `codex/phase-7-1-baseline`, no configured remote, and a dirty
  pre-release working tree that must be intentionally curated before publishing.

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

## Publication-only actions — explicit authorization required

- [ ] Review and approve the exact source diff and local history shape.
- [ ] Decide public repository owner/name and configure the remote.
- [ ] Create curated commits; push the release branch.
- [ ] Run and link hosted Windows/macOS/Linux, CodeQL, dependency, and artifact
  scan jobs.
- [ ] Choose the final public version. Do not infer `1.0.0` from the Action
  contract or change `0.6.0` without a release decision.
- [ ] Create the immutable version tag and, if approved, update the compatible
  Action `v1` tag according to `docs/ACTION_RELEASE_POLICY.md`.
- [ ] Upload the wheel and sdist to the approved PyPI destination; install back
  from that destination and repeat the five-minute quick start.
- [ ] Create the GitHub Release with hashes, compatibility notes, limitations,
  and the corpus notice.
- [ ] Deploy the public Reviewer from `reviewer-ui/` only after validating that
  no user document is uploaded and no telemetry is enabled.
- [ ] Replace placeholder security contact language and Issue Template security
  URL with the actual public repository advisory link.

## Abort conditions

Stop publication if the release-candidate gate is red, the working tree scope is
unclear, licence provenance is incomplete, a hosted gate is unavailable, or the
requested remote/version/deployment target has not been explicitly approved.
