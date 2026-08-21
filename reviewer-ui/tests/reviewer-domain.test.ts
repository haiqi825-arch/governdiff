import { describe, expect, it } from "vitest";

import { buildReviewExport } from "../app/review-export";
import { createProject } from "../app/persistence";
import { defaultFilters, initialReviewerState, reviewerReducer } from "../app/reviewer-reducer";
import {
  parseReport,
  parseReviewImport,
  ReportValidationError,
  ReviewValidationError,
} from "../app/report-import";
import { buildReviewQueue, nextQueueFingerprint } from "../app/reviewer-model.mjs";
import type { PolicyChange, Report } from "../app/reviewer-types";
import sampleReport from "../public/sample-report.json";

const report = {
  schema_version: "1.5",
  generated_at: "2026-08-11T00:00:00Z",
  old_document: { path: "old.md", sha256: "old-sha", block_count: 0 },
  new_document: { path: "new.md", sha256: "new-sha", block_count: 0 },
  summary: {
    total_changes: 0,
    active_findings: 0,
    breaking_findings: 0,
    high_confidence_breaking_findings: 0,
  },
  article_mappings: [],
  changes: [],
} satisfies Report;

describe("Reviewer domain contract", () => {
  it("loads a report into one deterministic reducer state", () => {
    const next = reviewerReducer(initialReviewerState, {
      type: "load-project",
      project: createProject({ report }),
      persisted: false,
    });
    expect(next.report).toBe(report);
    expect(next.filters).toEqual(initialReviewerState.filters);
    expect(next.loadError).toBe("");
  });

  it("tracks saved, dirty, unexported, and exported revisions", () => {
    const project = createProject({
      report,
      revision: 3,
      exportStatus: {
        state: "exported",
        last_exported_at: "2026-08-11T11:00:00Z",
        exported_revision: 3,
      },
    });
    const loaded = reviewerReducer(initialReviewerState, {
      type: "load-project",
      project,
      persisted: true,
    });
    const changed = reviewerReducer(loaded, {
      type: "set-decision",
      fingerprint: "GVC-TEST",
      decision: {
        state: "confirmed",
        note: "checked",
        updatedAt: "2026-08-11T12:00:00Z",
      },
    });
    expect(changed.projectRevision).toBe(4);
    expect(changed.savedRevision).toBe(3);
    expect(changed.exportStatus.state).toBe("unexported");

    const exported = reviewerReducer(changed, {
      type: "mark-exported",
      exportedAt: "2026-08-11T12:05:00Z",
    });
    expect(exported.projectRevision).toBe(5);
    expect(exported.exportStatus).toEqual({
      state: "exported",
      last_exported_at: "2026-08-11T12:05:00Z",
      exported_revision: 5,
    });
  });

  it("clears hidden batch scope when filters change and preserves sort on clear-all", () => {
    const loaded = reviewerReducer(initialReviewerState, {
      type: "load-project",
      project: createProject({ report }),
      persisted: true,
    });
    const selected = reviewerReducer(loaded, { type: "set-batch", fingerprints: ["hidden", "visible"] });
    const risk = reviewerReducer(selected, { type: "set-filter", name: "sortBy", value: "risk" });
    expect(risk.batchIds).toEqual([]);
    const filtered = reviewerReducer(risk, { type: "set-filter", name: "breakingOnly", value: true });
    const cleared = reviewerReducer(filtered, { type: "reset-filters" });
    expect(cleared.filters).toEqual({ ...defaultFilters, sortBy: "risk" });
  });

  it("normalizes legacy review/1.0 decisions", () => {
    const imported = parseReviewImport({
      schema_version: "governdiff-review/1.0",
      report: { old_sha256: "old-sha", new_sha256: "new-sha" },
      decisions: [{
        change_fingerprint: "chg-1",
        state: "accepted",
        note: "checked",
        updated_at: "2026-08-11T00:00:00Z",
      }],
      field_edits: [],
      alignment_overrides: [],
    }, report);
    expect(imported.decisions["chg-1"].state).toBe("confirmed");
  });

  it("validates current review imports against canonical review/1.1", () => {
    const currentReport = sampleReport as Report;
    const imported = parseReviewImport({
      schema_version: "governdiff-review/1.1",
      report: {
        old_sha256: currentReport.old_document.sha256,
        new_sha256: currentReport.new_document.sha256,
        generated_at: currentReport.generated_at,
      },
      exported_at: "2026-08-11T12:00:00Z",
      decisions: [],
      field_edits: [],
      alignment_overrides: [],
    }, currentReport);
    expect(imported).toEqual({
      decisions: {},
      fieldEdits: {},
      alignmentOverrides: {},
    });
  });

  it("returns field-level schema paths for invalid current reviews", () => {
    const currentReport = sampleReport as Report;
    try {
      parseReviewImport({
        schema_version: "governdiff-review/1.1",
        report: {
          old_sha256: currentReport.old_document.sha256,
          new_sha256: currentReport.new_document.sha256,
          generated_at: currentReport.generated_at,
        },
        decisions: [],
        field_edits: [],
        alignment_overrides: [],
      }, currentReport);
      throw new Error("Expected validation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(ReviewValidationError);
      expect((error as ReviewValidationError).issues).toContainEqual(
        expect.objectContaining({ path: "/exported_at" }),
      );
      expect((error as Error).message).toMatch(/Export a fresh review JSON/);
    }
  });

  it("retains the review/1.1 export contract", () => {
    const payload = buildReviewExport(
      report,
      { "chg-1": { state: "confirmed", note: "ok", updatedAt: "now" } },
      {},
      {},
      [],
      "exported",
    );
    expect(payload.schema_version).toBe("governdiff-review/1.1");
    expect(payload.report.old_sha256).toBe("old-sha");
    expect(payload.decisions[0].updated_at).toBe("now");
  });

  it("validates the complete checked-in report against canonical report/1.5", () => {
    expect(parseReport(sampleReport).schema_version).toBe("1.5");
  });

  it("uses stable document, risk, and unreviewed-first queue ordering", () => {
    const seed = (sampleReport as Report).changes[0];
    const changes: PolicyChange[] = [
      { ...seed, fingerprint: "doc-1", severity: "low", confidence_score: 0.99, findings: seed.findings.map((finding) => ({ ...finding, breaking: false })) },
      { ...seed, fingerprint: "doc-2", severity: "high", confidence_score: 0.70, findings: seed.findings.map((finding) => ({ ...finding, breaking: true })) },
      { ...seed, fingerprint: "doc-3", severity: "high", confidence_score: 0.95, findings: seed.findings.map((finding) => ({ ...finding, breaking: true })) },
    ];
    expect(buildReviewQueue(changes, defaultFilters, {}).map((change) => change.fingerprint)).toEqual(["doc-1", "doc-2", "doc-3"]);
    expect(buildReviewQueue(changes, { ...defaultFilters, sortBy: "risk" }, {}).map((change) => change.fingerprint)).toEqual(["doc-3", "doc-2", "doc-1"]);
    expect(buildReviewQueue(changes, { ...defaultFilters, sortBy: "unreviewed" }, { "doc-1": { state: "confirmed", note: "", updatedAt: "now" } }).map((change) => change.fingerprint)).toEqual(["doc-2", "doc-3", "doc-1"]);
  });

  it("advances within the current queue and ends cleanly after the last item", () => {
    const queue = (sampleReport as Report).changes.slice(0, 3);
    expect(nextQueueFingerprint(queue, queue[0].fingerprint)).toBe(queue[1].fingerprint);
    expect(nextQueueFingerprint(queue, queue.at(-1)!.fingerprint)).toBe("");
  });

  it("returns field-level schema paths for invalid reports", () => {
    const invalid = structuredClone(sampleReport) as Record<string, unknown>;
    const oldDocument = invalid.old_document as Record<string, unknown>;
    delete oldDocument.language;
    try {
      parseReport(invalid);
      throw new Error("Expected validation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(ReportValidationError);
      expect((error as ReportValidationError).issues).toContainEqual(
        expect.objectContaining({ path: "/old_document/language" }),
      );
      expect((error as Error).message).toMatch(/Regenerate the JSON/);
    }
  });
});
