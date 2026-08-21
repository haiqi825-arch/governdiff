# GovernDiff Gold Benchmark annotation guide

Version: 1.0

## Purpose

The benchmark measures four separate questions:

1. Did GovernDiff align the correct old and new policy blocks?
2. Did it classify the structural change correctly?
3. Did it emit the expected rule-change findings without extra claims?
4. Does the reported confidence correspond to empirical correctness?

Engine output is a candidate for inspection, never the source of truth. Gold
labels are justified from the evidence text and the rules below.

## Benchmark unit

Each case is a focused old/new document pair containing one review decision.
The text is excerpted verbatim from a source snapshot in
`tests/policy_corpus/`. Each `gold.json` records the source pair, source block
IDs, original source-change fingerprint, snapshot paths, and annotation notes.

Focused cases are used because a wrong label can be inspected directly and
because they avoid turning a large document's current automatic alignment into
ground truth.

## Alignment labels

- `added`: no old policy block expresses the new clause.
- `removed`: an old policy block has no successor.
- `modified`: the blocks retain the same policy identity but their operative
  text changes.
- `moved`: operative text is unchanged but section, article, or order changes.
- `format_only`: policy identity and operative text are unchanged; only
  punctuation, whitespace, or rendering changes.
- `unchanged`: both content and structural position are unchanged.

Article markers are structural metadata. A pure `第六条 → 第九条` change with
identical operative text is `moved`, not a substantive modification.

## Article-remapping labels

An article mapping is correct only when the old and new blocks retain the same
policy identity. Similar vocabulary is insufficient. Record:

- exact expected old and new article labels;
- `required: true` when a changed marker must be emitted;
- an ambiguity note when multiple target articles are plausible.

For list items inside the same remapped article, validate the parent article
identity as well as the individual item correspondence.

## Finding labels

`expected_checks` is the complete set of justified findings for the focused
case. An emitted check outside the set is a false positive; a missing expected
check is a false negative.

- `modality-strengthened` / `modality-weakened`: normative force changes, such
  as may → must or must → should. Equivalent contractions such as “won't” and
  “will not” do not change force.
- `deadline-*` and `threshold-changed`: the same governed quantity and unit
  change; unrelated numbers must not be paired.
- `scope-expanded` / `scope-narrowed`: governed actors, objects, situations, or
  protected interests materially broaden or contract.
- `exception-*`: a true exception to the operative rule appears or disappears.
- `authority-shifted`: the actor responsible for an operative duty changes.
- `restriction-added`, `duty-added`, `protection-removed`: use only when the
  whole clause is genuinely one-sided, not when alignment merely failed.
- `article-remapped`: structural identity is preserved under a changed article
  marker; it is never breaking by itself.
- `substantive-text-changed`: a review cue when text changes but no more
  specific deterministic rule is justified.
- `policy-clause-added` / `policy-clause-removed`: one-sided substantive text
  without a more specific rule classification.

Preambles, dates, tables of contents, citations, and publication metadata do
not become rights or protections merely because they contain words such as
“privacy”, “right”, or “security”.

## Breaking label

`expected_breaking` answers whether at least one expected finding is a
potential breaking policy change under GovernDiff's documented rules. It is a
review-priority label, not a legal conclusion.

## Confidence correctness

For calibration, every emitted finding is marked correct when its `check_id`
is in `expected_checks`. Confidence measures the probability that the emitted
finding is correct, not policy impact. Missed Gold findings contribute to
recall but have no emitted confidence score.

The report must include:

- precision/recall/F1 by confidence layer;
- bucket accuracy and coverage;
- Brier score for emitted findings;
- monotonicity check (`high` accuracy ≥ `medium` ≥ `low`);
- a threshold recommendation clearly marked as provisional for a 30-case set.

## Review protocol

1. Evidence pass: read only old/new excerpts and assign labels.
2. Provenance pass: verify excerpts and hashes against the source snapshots.
3. Engine pass: run GovernDiff and compare predictions to Gold.
4. Adjudication pass: inspect disagreements and change Gold only when the
   evidence—not the engine—shows the original label was wrong.

At least six cases carry `review_passes: 2`. This is a two-pass project review,
not a claim of independent human inter-annotator agreement. Public Beta still
requires external human annotation on a larger sample.
