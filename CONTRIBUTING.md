# Contributing to GovernDiff

GovernDiff is an evidence-first policy comparison tool. Contributions should
preserve deterministic output, source provenance, local-first privacy, and the
published report/review/waiver compatibility contracts.

## Development setup

Python 3.10+ and Node.js 22.13+ are required.

```bash
python -m pip install -e .
cd reviewer-ui
npm ci
npm test
```

From the repository root, run the Python suite and public-contract checks:

```bash
PYTHONPATH=src python -m unittest discover -s tests -v
PYTHONPATH=src python scripts/validate_schemas.py
PYTHONPATH=src python scripts/build_public_examples.py
```

## Pull requests

- Keep changes focused and explain the user-visible behavior.
- Add or update tests for every behavior change.
- Do not weaken evidence, privacy, accessibility, or deterministic-build gates.
- Treat report 1.5, review 1.1, waiver 1.0, and Action manifest 1.0 as public
  contracts; follow `schema/COMPATIBILITY.md` for additive or breaking changes.
- Do not add downloaded policy text without source, retrieval date, hashes, and
  a redistribution decision recorded in `docs/CORPUS_LICENSE_AUDIT.md`.
- Never put real policy text, reviewer notes, access tokens, or local absolute
  paths in issues, fixtures, screenshots, logs, or benchmark artifacts.

## Release preparation

The local release gate is:

```bash
cd reviewer-ui && npm ci && npm run build
cd ..
python scripts/verify_release_candidate.py
```

This builds wheel and sdist candidates, rebuilds a wheel from the sdist, installs
it in a clean environment, and proves that the bundled loopback Reviewer starts
and returns all four reviewed report formats. Publishing, tags, and remote
changes require explicit maintainer authorization and follow
`docs/RELEASE_CHECKLIST.md`.

By contributing, you agree that your contribution is licensed under the MIT
licence in `LICENSE`.
