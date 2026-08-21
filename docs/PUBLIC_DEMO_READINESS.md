# Public Reviewer demo readiness

The local Reviewer build is technically ready for a public demo, but deployment
is intentionally not performed in Phase 8 preparation.

## Ready

- The default demo report is synthetic and contains no personal or confidential
  policy text.
- The site can run without accounts, remote document storage, or telemetry.
- The UI exposes local JSON open/import/export, review decisions, saved views,
  keyboard operation, responsive layouts, and the English/Chinese interface.
- Real-browser gates enforce a 5,000-change bounded DOM, interaction P95 under
  200 ms, no serious/critical axe violation, and long evidence wrapping without
  horizontal overflow.
- Screenshots and GIF in `docs/assets/` are generated from synthetic data.

Regenerate the media with:

```bash
cd reviewer-ui
node scripts/capture-public-demo.mjs
cd ..
python scripts/build_demo_gif.py
```

## Deployment conditions

- Confirm the hosting project and public URL.
- Re-run `npm ci`, full tests, build reproducibility, dependency audit, and the
  real-browser gate in hosted CI.
- Verify response headers, content security policy, cache behavior, and the
  absence of telemetry/network calls at the deployed origin.
- Publish a privacy statement stating that standalone documents remain in the
  browser's local IndexedDB and are not uploaded by GovernDiff.
- Link the exact release commit and its dependency inventory.

No public URL is claimed until those publication actions are explicitly
authorized and completed.
