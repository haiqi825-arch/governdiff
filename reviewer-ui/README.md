# GovernDiff Reviewer

Local-first review workspace for GovernDiff report schema 1.5.

## Capabilities

- browse and filter changes through the nested section tree;
- filter by type, confidence, Breaking status, review state, or text;
- inspect token-level additions, deletions, and replacements;
- inspect ranked article-mapping candidates and unresolved conflicts;
- unlink an automatic match or create one-to-one, one-to-many, and many-to-one
  manual relinks using stable block IDs;
- edit machine-extracted fields while retaining the original values;
- batch confirm or reject changes and hide format-only changes;
- keep parsing, scan, low-confidence, and mapping warnings outside filters;
- generate `.governdiff-waivers.yml` entries with reviewer metadata;
- clear the local report and review data in one action;
- use the full review flow by keyboard with visible focus and screen-reader labels;
- import/export `governdiff-review/1.1` JSON with decisions, field edits, and
  `alignment_overrides` for CLI round trips.
- run as an isolated `governdiff review OLD NEW` session whose atomic draft is
  held in the CLI temporary directory and whose Export returns directly to the
  waiting CLI.

The standalone app sends neither policy text nor review decisions to a backend.
The CLI session variant communicates only with its `127.0.0.1` parent process,
using an HttpOnly SameSite cookie, strict Host/Origin checks, no CORS grant, and
security response headers.

## Development

Node.js 22.13 or newer is required.

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test:components
npm test
npm run test:browser
npm run test:performance
```

`npm test` runs the type contract, component/domain tests, production build,
rendered HTML contract, and the Phase 7.6 real-Chrome acceptance gate. The
model-only `test:performance` command remains the fast first-layer regression.
The browser gate generates a deterministic 5,000-change report, exercises DOM,
layout, interaction, responsive, recovery and local-session paths, and runs
axe-core. Set `GOVERNDIFF_CHROME_PATH` when Chrome is installed outside its
default Windows path. Reviewer state,
persistence, report import, review export, and reusable view components are
kept in separate modules under `app/`.

Rebuild the checked-in sample after the Python report contract changes:

```bash
python ../scripts/build_reviewer_sample.py
```
