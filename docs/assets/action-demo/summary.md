## GovernDiff policy audit

**Gate: FAILED** — 2 active breaking finding(s) reached severity `high` and confidence `medium`.

- Files audited: **1**; changes: **1**; active findings: **2**
- Breaking at confidence threshold: **2**; gate findings: **2**; matched waivers: **0**
- Full JSON, HTML, CSV, and Markdown evidence: [governdiff-policy-review]({{GOVERNDIFF_ARTIFACT_URL}})

| File status | Policy file | Changes | Active findings | Breaking | Gate findings |
|---|---|---:|---:|---:|---:|
| modified | `examples\public-cases\01-incident-deadline\old.md → examples\public-cases\01-incident-deadline\new.md` | 1 | 2 | 2 | 2 |

### Highest-priority findings

- `GVD-CA93F47FA2` · **high** · `modality-strengthened` · high `0.92` — Normative force was strengthened. (`examples\public-cases\01-incident-deadline\old.md → examples\public-cases\01-incident-deadline\new.md`, paragraph 1 · chars 52-124)
- `GVD-FE2A1C4EB0` · **high** · `deadline-shortened` · high `0.94` — A deadline changed from 72 hours to 24 hours. (`examples\public-cases\01-incident-deadline\old.md → examples\public-cases\01-incident-deadline\new.md`, paragraph 1 · chars 52-124)
