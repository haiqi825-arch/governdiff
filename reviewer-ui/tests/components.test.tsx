import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChangeList } from "../app/components/change-list";
import { CommandBar } from "../app/components/command-bar";
import { ConfirmationDialog } from "../app/components/confirmation-dialog";
import { DecisionPanel } from "../app/components/decision-panel";
import { EvidenceComparison } from "../app/components/evidence-comparison";
import { ReviewerIcon } from "../app/components/reviewer-icon";
import { ProjectStatus } from "../app/components/project-status";
import { ReviewSummary } from "../app/components/review-summary";
import { SectionTree } from "../app/components/section-tree";
import { WordEvidence } from "../app/components/word-evidence";
import type { PolicyChange, Report } from "../app/reviewer-types";

const change: PolicyChange = {
  fingerprint: "chg-1",
  change_type: "modified",
  similarity: 0.8,
  severity: "high",
  section: "Article 1",
  section_path: ["Article 1"],
  old_article: "Article 1",
  new_article: "Article 1",
  article_mapping: null,
  confidence_score: 0.91,
  confidence_level: "high",
  confidence_reasons: ["stable heading"],
  old_block: {
    block_id: "old-1",
    section_label: "Article 1",
    text: "must report",
    line_start: 1,
    line_end: 1,
  },
  new_block: {
    block_id: "new-1",
    section_label: "Article 1",
    text: "shall report",
    line_start: 1,
    line_end: 1,
  },
  word_diff: [
    { operation: "replace", old_text: "must", new_text: "shall" },
    { operation: "equal", old_text: " report", new_text: " report" },
  ],
  findings: [
    {
      fingerprint: "finding-1",
      check_id: "modal-strength",
      field: "modality",
      severity: "high",
      breaking: true,
      summary: "Duty wording changed",
      explanation: "The modal verb changed.",
      old_value: "must",
      new_value: "shall",
      old_evidence: "must report",
      new_evidence: "shall report",
      confidence_score: 0.91,
      confidence_level: "high",
      confidence_reasons: ["explicit replacement"],
      waived: false,
    },
  ],
};

const report: Report = {
  schema_version: "1.5",
  generated_at: "2026-08-11T00:00:00Z",
  old_document: { path: "old.md", sha256: "old", block_count: 1 },
  new_document: { path: "new.md", sha256: "new", block_count: 1 },
  summary: {
    total_changes: 1,
    active_findings: 1,
    breaking_findings: 1,
    high_confidence_breaking_findings: 1,
  },
  article_mappings: [],
  changes: [change],
};

describe("Reviewer components", () => {
  it("renders accessible icons without exposing decorative SVG text", () => {
    const { container } = render(<ReviewerIcon name="upload" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders word-level evidence for both document sides", () => {
    const { rerender } = render(<WordEvidence change={change} side="old" />);
    expect(screen.getByLabelText("deleted text")).toHaveTextContent("must");
    rerender(<WordEvidence change={change} side="new" />);
    expect(screen.getByLabelText("inserted text")).toHaveTextContent("shall");
  });

  it("keeps long evidence blocks readable and expandable", async () => {
    const longText = Array.from(
      { length: 18 },
      (_, index) => `Sentence ${index + 1} preserves policy evidence across multiple visual lines.`,
    ).join(" ");
    const longChange = {
      ...change,
      old_block: { ...change.old_block!, text: longText },
      new_block: { ...change.new_block!, text: `${longText} Updated.` },
    };
    render(<EvidenceComparison change={longChange} />);
    const copies = document.querySelectorAll(".evidence-block-copy");
    expect(copies).toHaveLength(2);
    expect(copies[0]).toHaveClass("is-collapsed");
    expect(copies[0].textContent).toContain("Sentence 18");
    expect(screen.getAllByRole("button", { name: /Show full text/i })).toHaveLength(2);
  });

  it("keeps section selection and nested counts in a standalone tree", () => {
    const onSelect = vi.fn();
    render(
      <SectionTree
        nodes={[{
          section_id: "section-1",
          title: "Article 1",
          path: ["Article 1"],
          change_count: 1,
          children: [],
        }]}
        selected=""
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Article 1/ }));
    expect(onSelect).toHaveBeenCalledWith(["Article 1"]);
  });

  it("routes change selection and batch selection through callbacks", () => {
    const onSelect = vi.fn();
    const onToggleBatch = vi.fn();
    render(
      <ChangeList
        changes={[change]}
        selectedId=""
        batchIds={[]}
        decisions={{}}
        onSelect={onSelect}
        onToggleBatch={onToggleBatch}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Duty wording changed/ }));
    fireEvent.click(screen.getByLabelText("Select chg-1 for batch review"));
    expect(onSelect).toHaveBeenCalledWith("chg-1");
    expect(onToggleBatch).toHaveBeenCalledWith("chg-1", true);
  });

  it("keeps statistics and quality warnings in a collapsed summary", () => {
    render(
      <ReviewSummary
        report={report}
        warnings={["One warning"]}
        reviewedCount={1}
        lowConfidenceCount={0}
        mappingConflicts={0}
        queueTotal={1}
        queueReviewed={1}
      />,
    );
    expect(screen.getByText("Breaking")).toBeVisible();
    expect(screen.getByText("Queue progress")).toBeVisible();
    expect(screen.getByText("Report progress")).toBeVisible();
    expect(screen.getByText("1 quality warning(s)")).toBeVisible();
    expect(screen.getByText("One warning")).not.toBeVisible();
  });

  it("renders every split block with page, section, and context", () => {
    const split = {
      ...change,
      change_type: "split",
      old_blocks: [change.old_block!],
      new_blocks: [
        { ...change.new_block!, block_id: "new-1", text: "Part one", page_start: 4, section: ["Article 1", "A"] },
        { ...change.new_block!, block_id: "new-2", text: "Part two", page_start: 5, section: ["Article 1", "B"] },
      ],
    } satisfies PolicyChange;
    render(<EvidenceComparison change={split} />);
    expect(screen.getByText("2 block(s)")).toBeVisible();
    expect(screen.getByText("Part one")).toBeVisible();
    expect(screen.getByText("Part two")).toBeVisible();
    expect(screen.getAllByText("Page 4").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Article 1 › B").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Block context")).toHaveLength(3);
  });

  it("keeps every core project command reachable", () => {
    render(
      <CommandBar
        report={report}
        onOpenReport={vi.fn()}
        onSaveState={vi.fn()}
        onImportReview={vi.fn()}
        onExportReview={vi.fn()}
        onClearProject={vi.fn()}
        onLanguageChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Open project")).toBeVisible();
    expect(screen.getByRole("button", { name: "Save state" })).toBeVisible();
    expect(screen.getByText("Import review")).toBeVisible();
    expect(screen.getByRole("button", { name: /Export/ })).toBeVisible();
    expect(screen.getByText("More operations")).toBeVisible();
  });

  it("contains waiver metadata inside the Waive decision flow", () => {
    render(
      <DecisionPanel
        state="waived"
        note="approved exception"
        approver="Policy team"
        waiverExpiry="2026-12-31"
        onDecision={vi.fn()}
        onNote={vi.fn()}
        onApprover={vi.fn()}
        onWaiverExpiry={vi.fn()}
        onGenerateWaiver={vi.fn()}
        onDecisionAndNext={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Waiver details")).toBeVisible();
    expect(screen.getByDisplayValue("Policy team")).toBeVisible();
    expect(screen.getByRole("button", { name: "Generate waiver file" })).toBeVisible();
  });

  it("shows saved, export, mismatch, recovery, and bounded undo states", () => {
    const onRestore = vi.fn();
    const onUndo = vi.fn();
    render(
      <ProjectStatus
        saveStatus="saved"
        dirty={false}
        exportStatus={{
          state: "exported",
          last_exported_at: "2026-08-11T12:00:00Z",
          exported_revision: 4,
        }}
        integrityStatus="identity-mismatch"
        updatedAt="2026-08-11T12:00:00Z"
        hasRecovery
        undoLabel="batch confirmed"
        onRestore={onRestore}
        onUndo={onUndo}
      />,
    );
    expect(screen.getByText("Saved")).toBeVisible();
    expect(screen.getByText("Exported")).toBeVisible();
    expect(screen.getByText("Import does not match this report")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Restore deleted project" }));
    fireEvent.click(screen.getByRole("button", { name: "Undo batch confirmed" }));
    expect(onRestore).toHaveBeenCalledOnce();
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it("requires an explicit confirmation for protected mutations", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmationDialog
        title="Delete this local project?"
        detail="A recovery record will remain available."
        confirmLabel="Delete project"
        destructive
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    expect(screen.getByRole("alertdialog")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Delete project" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
