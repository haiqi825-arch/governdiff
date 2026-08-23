# PyPI release path

GovernDiff publishes the already tested GitHub Release artifacts rather than
rebuilding them inside the privileged publishing job. The workflow verifies the
release `SHA256SUMS.txt`, passes exactly one wheel and one sdist through a
one-day GitHub artifact, and uses PyPI Trusted Publishing. No long-lived PyPI
token is stored in GitHub.

## One-time PyPI account setup

Create a pending Trusted Publisher for the not-yet-created `governdiff` project
with these exact values:

- PyPI project name: `governdiff`
- GitHub owner: `haiqi825-arch`
- GitHub repository: `governdiff`
- Workflow filename: `pypi-publish.yml`
- Environment name: `pypi`

The account holder must complete this step on PyPI. It creates an external
publisher identity and cannot be inferred from repository authorization.

## Publish and verify v0.6.0

1. Open **Actions → Publish verified Python release to PyPI → Run workflow**.
2. Run the workflow from `main`; it is intentionally locked to `v0.6.0`.
3. Confirm both SHA-256 checks pass and the publish job reports attestations.
4. Install from the public index in a clean environment:

   ```bash
   python -m venv .verify-governdiff
   .verify-governdiff/bin/python -m pip install --no-cache-dir governdiff==0.6.0
   .verify-governdiff/bin/governdiff diff \
     examples/public-cases/01-incident-deadline/old.md \
     examples/public-cases/01-incident-deadline/new.md \
     --format html --output report.html
   ```

On Windows, use `.verify-governdiff\Scripts\python.exe` and
`.verify-governdiff\Scripts\governdiff.exe`.

Do not rerun the workflow for an already published version. PyPI distributions
are immutable; publish a new version if any artifact must change.
