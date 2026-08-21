# GovernDiff public end-to-end cases

These three compact cases are the publication-safe path from input documents to
CLI report and Reviewer inspection. All policy wording is synthetic and covered
by the repository MIT licence; no external corpus text is reproduced.

Build or refresh the deterministic reports:

```bash
PYTHONPATH=src python scripts/build_public_examples.py
```

Run one case through the CLI:

```bash
governdiff diff \
  examples/public-cases/01-incident-deadline/old.md \
  examples/public-cases/01-incident-deadline/new.md \
  --format json --output report.json
```

Open the same case in the local review loop:

```bash
governdiff review \
  examples/public-cases/01-incident-deadline/old.md \
  examples/public-cases/01-incident-deadline/new.md \
  --output-dir reviewed
```

Each case directory contains `old.md`, `new.md`, and a checked-in `report.json`.
The expected checks in `manifest.json` are enforced by the build script and the
Phase 8 test suite.
