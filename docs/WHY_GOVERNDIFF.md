# Why GovernDiff instead of ordinary document diff?

Policy review needs more than colored insertions and deletions. Reviewers need to
know whether an obligation became stricter, a deadline moved, a governed scope
expanded, or an exception changed—and they need evidence they can verify.

| Capability | Plain text diff | Track Changes | Generic LLM review | GovernDiff |
|---|---|---|---|---|
| PDF, DOCX, HTML, Markdown, TXT | Usually text only | Primarily editor-native files | Depends on upload/parser | Yes, digital text |
| Clause moves, splits, and merges | No semantic alignment | Document-specific | Model-dependent | Deterministic alignment |
| Bilingual policy-change checks | No | No | Prompt-dependent | 15 explicit English/Chinese checks |
| Before/after source evidence | Character/line context | Visual edit history | Often summarized | Paragraph/page/cell/line evidence |
| Stable finding identity | No | No | No stable contract | `GVD-*` fingerprints |
| Confidence with reasons | No | No | Model-specific | High/medium/low with machine-readable reasons |
| PR gate and complete artifact | Manual integration | No | Custom integration | Composite GitHub Action |
| Portable reviewer decisions | No | Editor-specific | Usually service-specific | `governdiff-review/1.1` |
| Reproducible, AI-off output | Yes for raw diff | Tool-dependent | No | Yes |
| Policy text remains local | Yes | Usually | Often requires a service | Yes; no telemetry or remote store |

## The difference in one example

Before:

> Vendors may report incidents within 72 hours.

After:

> Vendors must report incidents within 24 hours.

A plain diff shows two word replacements. GovernDiff additionally emits:

- `modality-strengthened` — permissive language became mandatory;
- `deadline-shortened` — 72 hours became 24 hours;
- stable fingerprints, severity, confidence, evidence locations, and review state;
- a CI gate result plus JSON, Markdown, HTML, and CSV evidence.

## Where GovernDiff fits

Use it when policies, governance documents, standards, codes of conduct, or
security rules are maintained like versioned assets and important changes need
an auditable review step.

Do not use it as a substitute for legal analysis, policy ownership, source
verification, or a responsible human decision.
