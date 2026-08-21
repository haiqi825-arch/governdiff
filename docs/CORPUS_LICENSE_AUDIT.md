# Corpus and bundled-asset licence audit

Audit date: 2026-08-13
Scope: material present in this working tree and the Phase 8 Python release
candidate. This is a release-control record, not legal advice.

## Release decision

**Public-main-repository decision (2026-08-21): synthetic-only.** The first
public history will not contain any primary or expansion corpus source,
extracted text, audit output, or derived Gold case, including material marked
“may publish” below. Existing corpus material remains in the private engineering
workspace. If external-source evaluation is published later, it will use a
separate repository or dataset release with a per-source licence record. This
keeps the launch boundary simple and prevents removed files from surviving in
public Git history.

The Python wheel and sdist contain GovernDiff Python code, the compiled Reviewer,
the loopback session server, the MIT licence, and third-party notices. They do
not contain `tests/policy_corpus`, `tests/expansion_corpus`, `node_modules`, Sites
configuration, or the three source/example corpora. The public demo uses only
synthetic text authored for GovernDiff.

This conservative boundary prevents an ambiguous source note from becoming an
unreviewed PyPI redistribution decision. A public repository may retain the
regression corpora only after the publication owner accepts the matrix below.

## Publication-safe material

| Material | Provenance | Licence decision |
|---|---|---|
| `examples/public-cases/` | Synthetic GovernDiff-authored policies | MIT; approved for public examples and media |
| GovernDiff source, schemas, docs | GovernDiff contributors | MIT |
| Contributor Covenant example | Organization for Ethical Source; source and hashes recorded in its README | CC BY-SA 4.0; retain attribution and share-alike notice if repository copy is published |
| Reviewer compiled assets | Built from lockfile dependencies | Include `reviewer-ui/THIRD_PARTY_NOTICES.md`; approved for wheel after inventory audit |

Every non-root entry in `reviewer-ui/package-lock.json` declares a licence.
Direct runtime dependencies—Ajv, Ajv Formats, Next.js, React, and
React DOM—declare MIT. The lockfile also contains permissive and weak-copyleft
licence identifiers for build/transitive packages; the release artifact contains
compiled output rather than `node_modules`, and the notice file is bundled.

## Primary policy corpus

| Pair | Manifest note | Public-repository decision |
|---|---|---|
| PRC Company Law | PRC law; official judicial/legislative sources | Source attribution present; retain for tests only pending owner acceptance of public redistribution |
| PRC Administrative Reconsideration Law | PRC law; official government sources | Same conservative hold |
| PRC State Secrets Law | PRC law; official judicial/legislative sources | Same conservative hold |
| PRC Emergency Response Law | PRC law; official government sources | Same conservative hold |
| PRC Science Popularization Law | PRC law; official ministry sources | Same conservative hold |
| Contributor Covenant 2.1/3.0 | CC BY-SA 4.0 | May publish with existing attribution and share-alike notice |
| Debian Social Contract 1.0/1.2 | Debian website terms; manifest claims derived use with attribution | Hold until the publication owner records the exact Debian terms/version relied upon |
| W3C Code of Conduct 2020/2024 | W3C permissive document licence | May publish with source links and W3C notice retained |
| OECD AI Principles 2019/2024 | Official public documents; attribution recorded | Hold until exact OECD reuse terms are recorded |
| UK Ministerial Code 2022/2025 | Open Government Licence v3.0 | May publish with Crown copyright attribution and OGL notice |

## Expansion corpus

| Pair | Manifest note | Public-repository decision |
|---|---|---|
| NIST CSF 1.1/2.0 | U.S. government work | May publish with NIST source attribution; do not imply NIST endorsement |
| NIST incident response guides | U.S. government work | Same decision |
| Django contribution guide | BSD-3-Clause project documentation | May publish with source and BSD notice retained |
| Rust contribution guide | MIT/Apache-2.0 project source | May publish with source and licence notice retained |
| PRC Accounting Law | PRC law; official ministry source | Test-only conservative hold pending owner acceptance |
| PRC Statistics Law | PRC law; official government sources | Test-only conservative hold pending owner acceptance |

## Controls

- `MANIFEST.in` prunes both corpus directories from sdist and wheel inputs.
- `scripts/verify_release_candidate.py` rejects deployment metadata and Node
  development dependency paths, verifies required notices, and tests the
  installed Reviewer.
- `examples/public-cases/manifest.json` records synthetic provenance and the MIT
  licence.
- `CONTRIBUTING.md` requires source URL, retrieval date, hashes, attribution, and
  a redistribution decision for future corpus additions.

For the first public repository, every external corpus row is resolved as
`retain-private`. Do not treat public availability or an official source URL as
a licence by itself.
