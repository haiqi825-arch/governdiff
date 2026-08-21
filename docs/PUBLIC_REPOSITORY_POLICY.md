# Public repository policy

GovernDiff's first public repository is assembled from an explicit allowlist.
It is not a mirror of the private engineering workspace.

## Included

- GovernDiff source, schemas, packaging metadata, and composite Action
- Reviewer source, lockfile, tests, and third-party notices
- GovernDiff-authored synthetic examples, fixtures, and benchmark cases
- Public documentation, screenshots, demo reports, and release workflows
- Tests and checked-in evidence that do not contain external policy text or
  local machine paths

## Retained outside the public repository

- Primary and expansion corpora, extracted text, audits, and derived Gold cases
- Contributor Covenant and other third-party policy copies, even where
  redistribution may be permitted
- Internal handoffs, acceptance workpapers, raw local run logs, and machine paths
- `.openai` hosting configuration, caches, temporary files, build directories,
  local release candidates, and `node_modules`

This is a product and release-control boundary, not a claim that excluded
material cannot legally be redistributed. External-source evaluation may be
published later as a separately reviewed dataset with source-level licence and
attribution records.

## History model

The public repository starts from the assembled allowlist snapshot. The private
workspace and its existing Git history remain unchanged. Files excluded from the
snapshot therefore never appear in public commit history; no force-push or
history rewriting is required.

Run the local assembler from the private workspace:

```bash
python scripts/build_public_snapshot.py
```

The command refuses to overwrite an existing snapshot. It writes a
`PUBLICATION_MANIFEST.json` containing the path, size, and SHA-256 digest of
every copied file, then scans the result for forbidden paths and credential
patterns.
