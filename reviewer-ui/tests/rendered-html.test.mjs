import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const reviewerSourceUrls = [
  "../app/reviewer-workspace.tsx",
  "../app/persistence.ts",
  "../app/review-export.ts",
  "../app/report-import.ts",
  "../app/i18n.tsx",
  "../app/components/alignment-repair.tsx",
  "../app/components/collapsible-content.tsx",
  "../app/components/command-bar.tsx",
  "../app/components/change-list.tsx",
  "../app/components/confirmation-dialog.tsx",
  "../app/components/decision-panel.tsx",
  "../app/components/evidence-comparison.tsx",
  "../app/components/project-status.tsx",
  "../app/components/review-queue.tsx",
  "../app/components/review-summary.tsx",
  "../app/components/section-tree.tsx",
  "../app/components/word-evidence.tsx",
];

async function readReviewerSources() {
  return (await Promise.all(
    reviewerSourceUrls.map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  )).join("\n");
}

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the GovernDiff review workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>GovernDiff Reviewer<\/title>/i);
  assert.match(html, /GovernDiff/);
  assert.match(html, /Open project/);
  assert.match(html, /Save state/);
  assert.match(html, /Import review/);
  assert.match(html, /More operations/);
  assert.match(html, /complete report[^<]*1\.5 schema/i);
});

test("ships a valid Phase 5 reviewer sample report", async () => {
  const [raw, source] = await Promise.all([
    readFile(new URL("../public/sample-report.json", import.meta.url), "utf8"),
    readReviewerSources(),
  ]);
  const report = JSON.parse(raw);
  assert.equal(report.schema_version, "1.5");
  assert.ok(report.summary.high_confidence_breaking_findings > 0);
  assert.ok(report.article_mappings.length > 0);
  assert.ok(report.article_mappings.some((mapping) => mapping.status === "ambiguous" && mapping.candidates.length > 1));
  assert.ok(report.changes.some((change) => change.change_type === "split" && change.new_blocks.length === 2));
  assert.ok(report.changes.some((change) => change.word_diff.some((operation) => operation.operation === "replace")));
  assert.ok(report.changes.some((change) => change.temporal_changes.some((item) => item.kind === "effective_date")));
  assert.ok(report.section_tree.length > 0);
  assert.ok(report.changes.every((change) => change.confidence_level));
  assert.match(source, /governdiff-review\.json/);
  assert.match(source, /governdiff-review\/1\.1/);
  assert.match(source, /localStorage/);
  assert.match(source, /article_mapping/);
  assert.match(source, /alignment_overrides/);
  assert.match(source, /Unlink match/);
  assert.match(source, /Apply relink/);
  assert.match(source, /Review relink preview/);
  assert.match(source, /WordEvidence/);
  assert.match(source, /SectionTree/);
  assert.match(source, /Confirm selected/);
  assert.match(source, /Reject selected/);
  assert.match(source, /Hide format-only/);
  assert.match(source, /Select all visible/);
  assert.match(source, /Saved local views/);
  assert.match(source, /Risk queue/);
  assert.match(source, /and next/);
  assert.match(source, /Generate waiver file/);
  assert.match(source, /Clear local project/);
  assert.match(source, /quality warning/);
  assert.match(source, /field_edits/);
  assert.match(source, /machine_old_value/);
  await access(new URL("../public/governdiff-reviewer-og.png", import.meta.url));
});

test("declares a keyboard and screen-reader accessible review contract", async () => {
  const [source, styles] = await Promise.all([
    readReviewerSources(),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(source, /Skip to evidence review/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /aria-pressed=/);
  assert.match(source, /summary\.aria/);
  assert.match(source, /J\/K navigate/);
  assert.match(source, /deleted text/);
  assert.match(source, /inserted text/);
  assert.match(source, /role="tablist"/);
  assert.match(source, /mobile-panel-queue/);
  assert.match(source, /Block context/);
  assert.match(source, /governdiff-project\/1\.1/);
  assert.match(source, /governdiff-project\/1\.0/);
  assert.match(source, /indexedDB/);
  assert.match(source, /beforeunload/);
  assert.match(source, /Restore deleted project/);
  assert.match(source, /Import does not match this report/);
  assert.match(source, /role="alertdialog"/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /forced-colors/);
  assert.doesNotMatch(styles, /top-actions[^}]*display:\s*none/);
  assert.doesNotMatch(styles, /check-filter[^}]*display:\s*none/);
});
