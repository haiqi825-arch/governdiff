# GovernDiff public demo and launch media

All product screenshots, reports, and launch graphics use synthetic GovernDiff
data. No external corpus, real policy, reviewer note, account, or user path is
shown.

| Asset | Purpose | Size |
|---|---|---:|
| `governdiff-social-preview-v2.png` | Recommended GitHub social preview | 1280×640, under 1 MB |
| `governdiff-producthunt-thumbnail.png` | Product Hunt / square social thumbnail | 240×240 |
| `governdiff-gallery-cover.png` | Product Hunt gallery and article cover | 1270×760 |
| `reviewer-demo.gif` | Reviewer workflow preview | 1440×1064 |
| `reviewer-queue.png` | Queue and evidence screenshot | 1440×1000 |
| `reviewer-evidence.png` | Evidence comparison screenshot | 1440×1000 |
| `reviewer-decision.png` | Confirmed-decision screenshot | 1440×1000 |
| `demo-incident-deadline.html` | Self-contained synthetic deadline report | HTML |
| `demo-access-scope.html` | Self-contained synthetic scope report | HTML |
| `demo-exception-authority.html` | Self-contained synthetic authority/exception report | HTML |
| `action-demo/` | Generated Action manifest, summary, and four report formats | Directory |

The `*-source*.png` files retain the original image-generation output for
future crops. Use the normalized files without `source` for publication.

Regenerate Reviewer screenshots and GIF from synthetic fixtures with:

```bash
cd reviewer-ui
node scripts/capture-public-demo.mjs
cd ..
python scripts/build_demo_gif.py
```
