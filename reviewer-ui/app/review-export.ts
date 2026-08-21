import type {
  AlignmentOverrides,
  Decisions,
  FieldEdits,
  PolicyChange,
  Report,
  ReviewExportPayload,
} from "./reviewer-types";

export function buildReviewExport(
  report: Report,
  decisions: Decisions,
  fieldEdits: FieldEdits,
  alignmentOverrides: AlignmentOverrides,
  visibleChanges: PolicyChange[],
  exportedAt = new Date().toISOString(),
): ReviewExportPayload {
  return {
    schema_version: "governdiff-review/1.1",
    report: {
      old_sha256: report.old_document.sha256,
      new_sha256: report.new_document.sha256,
      generated_at: report.generated_at,
    },
    exported_at: exportedAt,
    decisions: Object.entries(decisions).map(
      ([change_fingerprint, item]) => ({
        change_fingerprint,
        state: item.state,
        note: item.note,
        updated_at: item.updatedAt,
      }),
    ),
    field_edits: Object.values(fieldEdits),
    alignment_overrides: Object.values(alignmentOverrides).map((item) => ({
      ...item,
      updated_at: item.updatedAt,
    })),
    filters: {
      visible_change_fingerprints: visibleChanges.map(
        (change) => change.fingerprint,
      ),
    },
  };
}

export function buildWaiverExport(
  report: Report,
  decisions: Decisions,
  approver: string,
  expiry: string,
): { content: string; entryCount: number } {
  const waived = report.changes.filter(
    (change) => decisions[change.fingerprint]?.state === "waived",
  );
  if (!waived.length) {
    throw new Error("Mark at least one change as waived first.");
  }
  if (!approver.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(expiry)) {
    throw new Error(
      "Approver and an expiry date in YYYY-MM-DD format are required for waiver entries.",
    );
  }

  const entries = waived.flatMap((change) =>
    change.findings.map((finding) => ({
      finding,
      decision: decisions[change.fingerprint],
    })),
  );
  const lines = ["schema_version: governdiff-waiver/1.0", "waivers:"];
  entries.forEach(({ finding, decision }) =>
    lines.push(
      `  - fingerprint: ${JSON.stringify(finding.fingerprint)}`,
      `    reason: ${JSON.stringify(decision.note || "Reviewer-approved exception")}`,
      `    approved_by: ${JSON.stringify(approver.trim())}`,
      `    created_at: ${JSON.stringify(decision.updatedAt)}`,
      `    expires_at: ${JSON.stringify(expiry)}`,
    ),
  );
  return { content: `${lines.join("\n")}\n`, entryCount: entries.length };
}

export function downloadText(
  name: string,
  content: string,
  type: string,
): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
}
