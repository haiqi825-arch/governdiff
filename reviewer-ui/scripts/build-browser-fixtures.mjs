import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sample = JSON.parse(await readFile(resolve(root, "public", "sample-report.json"), "utf8"));
const source = sample.changes.filter((change) => change.change_type !== "unchanged");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function suffixId(value, index) {
  const base = String(value).replace(/[^A-Z0-9]/gi, "").toUpperCase();
  const suffix = `${base.slice(3)}${index.toString(36).toUpperCase().padStart(5, "0")}`;
  return base.startsWith("GVC") || base.startsWith("GVD")
    ? `${base.slice(0, 3)}-${suffix}`
    : `${base}${index.toString(36).toUpperCase().padStart(5, "0")}`;
}

function blockCopy(block, index, side, part) {
  if (!block) return null;
  return {
    ...clone(block),
    block_id: suffixId(`BLK${side}${part}`, index),
    ordinal: index,
    line_start: index * 3 + part,
    line_end: index * 3 + part,
    paragraph_start: index + part,
    paragraph_end: index + part,
    evidence_label: `paragraph ${index + part}`,
  };
}

const changes = Array.from({ length: 5000 }, (_, index) => {
  const change = clone(source[index % source.length]);
  const changeId = suffixId("GVC", index);
  const oldBlock = blockCopy(change.old_block, index, "O", 1);
  const newBlock = blockCopy(change.new_block, index, "N", 1);
  change.fingerprint = changeId;
  change.section = `${change.section} benchmark-${index}`;
  change.section_path = ["Browser benchmark", `Batch ${Math.floor(index / 100)}`, `Clause ${index}`];
  change.section_id = suffixId("SEC", index);
  const evidenceFixture = index === 0 || index === 17 || index === 18;
  change.old_block = evidenceFixture ? oldBlock : null;
  change.new_block = evidenceFixture ? newBlock : null;
  change.old_blocks = evidenceFixture && oldBlock ? [oldBlock] : [];
  change.new_blocks = evidenceFixture && newBlock ? [newBlock] : [];
  change.article_mapping = null;
  change.word_diff = [];
  change.temporal_changes = [];
  change.confidence_reasons = ["browser acceptance fixture"];
  if (index === 17) {
    change.change_type = "split";
    change.new_blocks = [
      newBlock,
      blockCopy(change.new_block, index, "N", 2),
      blockCopy(change.new_block, index, "N", 3),
    ].filter(Boolean);
  }
  if (index === 18) {
    change.change_type = "merged";
    change.old_blocks = [
      oldBlock,
      blockCopy(change.old_block, index, "O", 2),
      blockCopy(change.old_block, index, "O", 3),
    ].filter(Boolean);
  }
  change.findings = index % 10 === 0 ? change.findings.slice(0, 1).map((finding, findingIndex) => ({
    ...finding,
    fingerprint: suffixId(`GVD${findingIndex}`, index),
    summary: `Browser finding benchmark-${index}`,
    explanation: "Deterministic browser acceptance evidence.",
    old_evidence: "Previous policy evidence.",
    new_evidence: "Current policy evidence.",
    confidence_reasons: ["browser acceptance fixture"],
  })) : [];
  return change;
});

const report = clone(sample);
report.generated_at = "2026-08-13T00:00:00+00:00";
report.old_document.path = "browser-benchmark-old.md";
report.new_document.path = "browser-benchmark-new.md";
report.old_document.source_name = "Browser benchmark old";
report.new_document.source_name = "Browser benchmark new";
report.old_document.block_count = changes.reduce((sum, change) => sum + change.old_blocks.length, 0);
report.new_document.block_count = changes.reduce((sum, change) => sum + change.new_blocks.length, 0);
report.summary.total_changes = changes.length;
report.summary.findings = changes.reduce((sum, change) => sum + change.findings.length, 0);
report.summary.active_findings = changes.reduce(
  (sum, change) => sum + change.findings.filter((finding) => finding.active).length,
  0,
);
report.summary.breaking_findings = changes.reduce(
  (sum, change) => sum + change.findings.filter((finding) => finding.active && finding.breaking).length,
  0,
);
report.summary.high_confidence_breaking_findings = changes.reduce(
  (sum, change) => sum + change.findings.filter(
    (finding) => finding.active && finding.breaking && finding.confidence_level === "high",
  ).length,
  0,
);
report.summary.review_states = {
  unreviewed: changes.length,
  confirmed: 0,
  rejected: 0,
  modified: 0,
  waived: 0,
};
report.summary.change_types = Object.fromEntries(
  ["added", "removed", "modified", "split", "merged", "moved", "format_only"].map(
    (type) => [type, changes.filter((change) => change.change_type === type).length],
  ),
);
report.summary.confidence.changes = Object.fromEntries(
  ["high", "medium", "low"].map((level) => [
    level,
    changes.filter((change) => change.confidence_level === level).length,
  ]),
);
report.summary.confidence.findings = Object.fromEntries(
  ["high", "medium", "low"].map((level) => [
    level,
    changes.flatMap((change) => change.findings).filter((finding) => finding.confidence_level === level).length,
  ]),
);
report.section_tree = [];
report.article_mappings = [];
report.summary.article_mappings = 0;
report.summary.renumbered_article_mappings = 0;
report.summary.article_mapping_conflicts = 0;
report.changes = changes;
report.selection.selected_change_count = changes.length;
report.selection.selected_finding_count = report.summary.findings;
report.unfiltered_summary = clone(report.summary);

const mismatch = {
  schema_version: "governdiff-review/1.1",
  report: {
    old_sha256: "0".repeat(64),
    new_sha256: "1".repeat(64),
    generated_at: report.generated_at,
  },
  exported_at: "2026-08-13T00:00:00+00:00",
  decisions: [],
  field_edits: [],
  alignment_overrides: [],
  filters: { visible_change_fingerprints: [] },
};

const fixtureDirectory = resolve(root, "tests", "browser-fixtures");
await mkdir(fixtureDirectory, { recursive: true });
await Promise.all([
  writeFile(resolve(fixtureDirectory, "report-5000.json"), `${JSON.stringify(report)}\n`, "utf8"),
  writeFile(resolve(fixtureDirectory, "review-mismatch.json"), `${JSON.stringify(mismatch, null, 2)}\n`, "utf8"),
]);

process.stdout.write(`built browser fixtures: ${changes.length} changes\n`);
