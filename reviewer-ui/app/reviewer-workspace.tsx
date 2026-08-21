"use client";

import {
  type DragEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { CommandBar } from "./components/command-bar";
import { AlignmentRepair } from "./components/alignment-repair";
import { CollapsibleContent } from "./components/collapsible-content";
import { ConfirmationDialog } from "./components/confirmation-dialog";
import { confidenceClass, formatScore } from "./components/change-list";
import { DecisionPanel } from "./components/decision-panel";
import { EvidenceComparison } from "./components/evidence-comparison";
import { ReviewerIcon as Icon } from "./components/reviewer-icon";
import { ProjectStatus } from "./components/project-status";
import { ReviewQueue } from "./components/review-queue";
import { ReviewSummary } from "./components/review-summary";
import { createTranslator, I18nProvider } from "./i18n";
import {
  clearLegacyStoredReview,
  createProject,
  deleteProjectWithRecovery,
  loadActiveProject,
  loadDeletionRecord,
  loadProjectForReport,
  ProjectCorruptionError,
  readLegacyStoredReview,
  reportIdentityMatches,
  restoreDeletedProject,
  saveProject,
} from "./persistence";
import {
  buildReviewExport,
  buildWaiverExport,
  downloadText,
} from "./review-export";
import {
  buildReviewQueue,
  nextQueueFingerprint,
  normalizeState,
  selectChange,
  uniqueBlocks,
} from "./reviewer-model.mjs";
import { initialReviewerState, reviewerReducer } from "./reviewer-reducer";
import {
  parseReport,
  parseReviewImport,
  readJsonFile,
  ReviewIdentityMismatchError,
} from "./report-import";
import type {
  Finding,
  PolicyChange,
  Project,
  ProjectDeletionRecord,
  ProjectIntegrityStatus,
  ProjectSaveStatus,
  ReviewDataSnapshot,
  ReviewerFilters,
  ReviewState,
  SavedView,
  InterfaceLanguage,
} from "./reviewer-types";

type MobilePane = "queue" | "evidence" | "decision";

type ConfirmationRequest = {
  title: string;
  detail: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

type UndoEntry = {
  key: string;
  label: string;
  snapshot: ReviewDataSnapshot;
};

type ReviewSessionBootstrap = {
  schema_version: "governdiff-review-session/1.0";
  language: "en" | "zh";
  report: unknown;
  review?: unknown;
  workspace?: {
    filters?: ReviewerFilters;
    saved_views?: SavedView[];
    interface_language?: InterfaceLanguage;
    selected_fingerprint?: string;
  } | null;
};

const MAX_UNDO_ENTRIES = 10;
const AUTOSAVE_DELAY_MS = 350;

export default function ReviewerWorkspace() {
  const [state, dispatch] = useReducer(reviewerReducer, initialReviewerState);
  const {
    report,
    loadError,
    notice,
    filters,
    savedViews,
    interfaceLanguage,
    selectedId,
    batchIds,
    decisions,
    fieldEdits,
    alignmentOverrides,
    projectUpdatedAt,
    projectRevision,
    savedRevision,
    exportStatus,
  } = state;
  const [alignmentEditorOpen, setAlignmentEditorOpen] = useState(false);
  const [alignmentNotice, setAlignmentNotice] = useState("");
  const [approver, setApprover] = useState("");
  const [waiverExpiry, setWaiverExpiry] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>("queue");
  const [saveStatus, setSaveStatus] = useState<ProjectSaveStatus>("restoring");
  const [integrityStatus, setIntegrityStatus] =
    useState<ProjectIntegrityStatus>("ready");
  const [deletionRecord, setDeletionRecord] =
    useState<ProjectDeletionRecord | null>(null);
  const [confirmation, setConfirmation] =
    useState<ConfirmationRequest | null>(null);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [sessionMode, setSessionMode] = useState(false);
  const stateRef = useRef(state);
  const sessionModeRef = useRef(false);
  const evidenceFocusRef = useRef<HTMLDivElement>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const legacyMigrationProjectRef = useRef<string | null>(null);
  stateRef.current = state;
  const t = useMemo(() => createTranslator(interfaceLanguage), [interfaceLanguage]);
  const mobilePanes: Array<{ id: MobilePane; label: string }> = [
    { id: "queue", label: t("tabs.queue") },
    { id: "evidence", label: t("tabs.evidence") },
    { id: "decision", label: t("tabs.decision") },
  ];

  useLayoutEffect(() => {
    document.documentElement.lang = interfaceLanguage;
  }, [interfaceLanguage]);

  const persistProjectSnapshot = useCallback(
    async (snapshot = stateRef.current, manual = false): Promise<boolean> => {
      if (!snapshot.report) return false;
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
      const project = createProject({
        report: snapshot.report,
        decisions: snapshot.decisions,
        fieldEdits: snapshot.fieldEdits,
        alignmentOverrides: snapshot.alignmentOverrides,
        filters: snapshot.filters,
        savedViews: snapshot.savedViews,
        interfaceLanguage: snapshot.interfaceLanguage,
        exportStatus: snapshot.exportStatus,
        revision: snapshot.projectRevision,
        createdAt: snapshot.projectCreatedAt,
        updatedAt: new Date().toISOString(),
      });
      setSaveStatus("saving");
      const operation = saveQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (!sessionModeRef.current) return saveProject(project);
          const review = buildReviewExport(
            snapshot.report!,
            snapshot.decisions,
            snapshot.fieldEdits,
            snapshot.alignmentOverrides,
            snapshot.report!.changes,
          );
          const response = await fetch("/api/review-session/state", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              review,
              workspace: {
                filters: snapshot.filters,
                saved_views: snapshot.savedViews,
                interface_language: snapshot.interfaceLanguage,
                selected_fingerprint: snapshot.selectedId,
              },
            }),
          });
          if (!response.ok) throw new Error("The local review session could not be saved.");
          return project;
        });
      saveQueueRef.current = operation.then(() => undefined).catch(() => undefined);
      try {
        const savedProject = await operation;
        dispatch({
          type: "mark-saved",
          revision: savedProject.revision,
          updatedAt: savedProject.updated_at,
        });
        if (legacyMigrationProjectRef.current === savedProject.id) {
          clearLegacyStoredReview(savedProject.report);
          legacyMigrationProjectRef.current = null;
        }
        setSaveStatus(
          stateRef.current.projectRevision > savedProject.revision
            ? "saving"
            : "saved",
        );
        if (manual) {
          dispatch({
            type: "set-notice",
            message: createTranslator(stateRef.current.interfaceLanguage)("notice.saved"),
          });
        }
        return true;
      } catch (error) {
        setSaveStatus("error");
        dispatch({
          type: "set-load-error",
          message:
            error instanceof Error
              ? error.message
              : "The local project could not be saved.",
        });
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const initialT = createTranslator("en");
    async function restoreOrLoadSample() {
      setSaveStatus("restoring");
      try {
        const sessionResponse = await fetch("/api/review-session", {
          cache: "no-store",
        });
        if (
          sessionResponse.ok &&
          String(sessionResponse.headers.get("content-type")).includes("application/json")
        ) {
          const candidate = (await sessionResponse.json()) as Partial<ReviewSessionBootstrap>;
          if (candidate.schema_version === "governdiff-review-session/1.0") {
            const sessionReport = parseReport(candidate.report);
            const imported = candidate.review
              ? parseReviewImport(candidate.review, sessionReport)
              : { decisions: {}, fieldEdits: {}, alignmentOverrides: {} };
            const workspace = candidate.workspace ?? null;
            const language: InterfaceLanguage =
              workspace?.interface_language ?? (candidate.language === "zh" ? "zh-CN" : "en");
            const project = createProject({
              report: sessionReport,
              decisions: imported.decisions,
              fieldEdits: imported.fieldEdits,
              alignmentOverrides: imported.alignmentOverrides,
              filters: workspace?.filters,
              savedViews: workspace?.saved_views,
              interfaceLanguage: language,
            });
            if (cancelled) return;
            sessionModeRef.current = true;
            setSessionMode(true);
            dispatch({ type: "load-project", project, persisted: true });
            if (
              workspace?.selected_fingerprint &&
              sessionReport.changes.some(
                (change) => change.fingerprint === workspace.selected_fingerprint,
              )
            ) {
              dispatch({ type: "select-change", fingerprint: workspace.selected_fingerprint });
            }
            setSaveStatus("saved");
            setIntegrityStatus("ready");
            return;
          }
        }
        const [loaded, deleted] = await Promise.all([
          loadActiveProject(),
          loadDeletionRecord(),
        ]);
        if (cancelled) return;
        setDeletionRecord(deleted);
        if (loaded.project) {
          dispatch({ type: "load-project", project: loaded.project, persisted: true });
          setSaveStatus("saved");
          if (loaded.corruptionDetected) {
            setIntegrityStatus("corrupt");
            dispatch({
              type: "set-notice",
              message: createTranslator(loaded.project.interface_language)("notice.corruptRestored"),
            });
          }
          return;
        }
        if (loaded.corruptionDetected) {
          setIntegrityStatus("corrupt");
          setSaveStatus("error");
          dispatch({
            type: "set-load-error",
            message: initialT("error.corrupt"),
          });
          return;
        }
        if (deleted) {
          setSaveStatus("saved");
          return;
        }
        const response = await fetch("/sample-report.json");
        if (!response.ok) throw new Error(initialT("error.sample"));
        await activateReport(parseReport(await response.json()));
      } catch (error) {
        if (cancelled) return;
        setSaveStatus("error");
        dispatch({
          type: "set-load-error",
          message:
            error instanceof Error ? error.message : initialT("error.recovery"),
        });
      }
    }
    void restoreOrLoadSample();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sessionMode) return;
    const heartbeat = () => {
      void fetch("/api/review-session/heartbeat", { method: "POST" }).catch(
        () => undefined,
      );
    };
    heartbeat();
    const timer = window.setInterval(heartbeat, 5_000);
    return () => window.clearInterval(timer);
  }, [sessionMode]);

  useEffect(() => {
    if (!report || projectRevision <= savedRevision) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      autosaveTimerRef.current = null;
      void persistProjectSnapshot();
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
    };
  }, [persistProjectSnapshot, projectRevision, report, savedRevision]);

  const changes = useMemo(
    () => buildReviewQueue(report?.changes ?? [], filters, decisions),
    [report, filters, decisions],
  );
  const progressQueue = useMemo(
    () => buildReviewQueue(
      report?.changes ?? [],
      { ...filters, unreviewedOnly: false },
      decisions,
    ),
    [report, filters, decisions],
  );
  const selected = selectChange(changes, selectedId, report?.changes ?? []);
  const dirty = projectRevision > savedRevision;
  const hasReviewWork =
    Object.keys(decisions).length > 0 ||
    Object.keys(fieldEdits).length > 0 ||
    Object.keys(alignmentOverrides).length > 0;
  const hasUnexportedWork =
    hasReviewWork && (dirty || exportStatus.state === "unexported");

  useEffect(() => {
    if (!hasUnexportedWork) return;
    const protectNavigation = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", protectNavigation);
    return () => window.removeEventListener("beforeunload", protectNavigation);
  }, [hasUnexportedWork]);

  const warnings = useMemo(() => {
    if (!report) return [] as string[];
    const values: string[] = [];
    (["old", "new"] as const).forEach((side) => {
      const document = side === "old" ? report.old_document : report.new_document;
      (document.preflight?.issues ?? []).forEach((issue) =>
        values.push(
          `${side.toUpperCase()} ${issue.code}: ${issue.reason} Impact: ${issue.impact} Next: ${issue.next_step}`,
        ),
      );
      if (
        document.preflight?.suspected_scanned &&
        !(document.preflight.issues ?? []).some((issue) => issue.code.includes("SCAN"))
      ) {
        values.push(t("warning.scan", { side: side.toUpperCase() }));
      }
    });
    const low = report.changes.filter(
      (change) =>
        change.change_type !== "unchanged" && change.confidence_level === "low",
    ).length;
    const conflicts = report.article_mappings.filter(
      (mapping) => (mapping.status ?? "unique") !== "unique",
    ).length;
    if (low) values.push(t("warning.low", { count: low }));
    if (conflicts) values.push(t("warning.conflicts", { count: conflicts }));
    return values;
  }, [report, t]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.matches("input, textarea, select")) return;
      const index = changes.findIndex(
        (item) => item.fingerprint === selected?.fingerprint,
      );
      if (event.key.toLowerCase() === "j" && changes[index + 1]) {
        dispatch({
          type: "select-change",
          fingerprint: changes[index + 1].fingerprint,
        });
      }
      if (event.key.toLowerCase() === "k" && changes[index - 1]) {
        dispatch({
          type: "select-change",
          fingerprint: changes[index - 1].fingerprint,
        });
      }
      const nextState = (
        {
          "0": "unreviewed",
          "1": "confirmed",
          "2": "rejected",
          "3": "modified",
          "4": "waived",
        } as Record<string, ReviewState>
      )[event.key];
      if (nextState && selected) setDecision(selected.fingerprint, nextState);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  async function activateReport(data: Project["report"]) {
    const storedProject = await loadProjectForReport(data);
    if (storedProject) {
      dispatch({ type: "load-project", project: storedProject, persisted: true });
      setSaveStatus("saved");
    } else {
      const legacy = readLegacyStoredReview(data);
      const project = createProject({
        report: data,
        decisions: legacy.decisions,
        fieldEdits: legacy.fieldEdits,
        alignmentOverrides: legacy.alignmentOverrides,
      });
      if (legacy.found) legacyMigrationProjectRef.current = project.id;
      dispatch({ type: "load-project", project, persisted: false });
      setSaveStatus("saving");
    }
    setIntegrityStatus("ready");
    setUndoStack([]);
    setMobilePane("queue");
  }

  function currentReviewSnapshot(): ReviewDataSnapshot {
    const current = stateRef.current;
    return {
      decisions: current.decisions,
      fieldEdits: current.fieldEdits,
      alignmentOverrides: current.alignmentOverrides,
      filters: current.filters,
      savedViews: current.savedViews,
    };
  }

  function pushUndo(key: string, label: string) {
    const entry: UndoEntry = {
      key,
      label,
      snapshot: currentReviewSnapshot(),
    };
    setUndoStack((current) => {
      if (current.at(-1)?.key === key) return current;
      return [...current, entry].slice(-MAX_UNDO_ENTRIES);
    });
  }

  function undoLastChange() {
    const entry = undoStack.at(-1);
    if (!entry) return;
    dispatch({ type: "restore-review-data", snapshot: entry.snapshot });
    dispatch({ type: "set-notice", message: t("notice.undo", { label: entry.label }) });
    setUndoStack((current) => current.slice(0, -1));
  }

  function setDecision(
    fingerprint: string,
    reviewState: ReviewState,
    note?: string,
    undoKey = `decision:${fingerprint}`,
    undoLabel = "review decision",
    recordUndo = true,
  ) {
    if (recordUndo) pushUndo(undoKey, undoLabel);
    dispatch({
      type: "set-decision",
      fingerprint,
      decision: {
        state: reviewState,
        note: note ?? decisions[fingerprint]?.note ?? "",
        updatedAt: new Date().toISOString(),
      },
    });
  }

  function applyBatchDecision(reviewState: "confirmed" | "rejected") {
    const visible = new Set(changes.map((change) => change.fingerprint));
    const scopedIds = batchIds.filter((fingerprint) => visible.has(fingerprint));
    if (!scopedIds.length) {
      dispatch({ type: "set-notice", message: t("notice.selectBatch") });
      return;
    }
    pushUndo(`batch:${Date.now()}`, `batch ${reviewState}`);
    const updatedAt = new Date().toISOString();
    const nextDecisions = {
      ...decisions,
      ...Object.fromEntries(
        scopedIds.map((fingerprint) => {
          const hasFieldEdit = Object.values(fieldEdits).some(
            (edit) => edit.change_fingerprint === fingerprint,
          );
          const effectiveState: ReviewState =
            reviewState === "confirmed" && hasFieldEdit ? "modified" : reviewState;
          return [
            fingerprint,
            {
              state: effectiveState,
              note: decisions[fingerprint]?.note ?? "",
              updatedAt,
            },
          ];
        }),
      ),
    };
    dispatch({ type: "set-decisions", decisions: nextDecisions });
    dispatch({
      type: "set-notice",
      message: t("notice.batch", { count: scopedIds.length, state: reviewState }),
    });
  }

  function setBatchDecision(reviewState: "confirmed" | "rejected") {
    if (!batchIds.length) {
      dispatch({ type: "set-notice", message: t("notice.selectBatch") });
      return;
    }
    setConfirmation({
      title: t("dialog.batchTitle", { action: reviewState === "confirmed" ? t("decision.confirmed") : t("decision.rejected") }),
      detail: t("dialog.batchDetail", { count: batchIds.length }),
      confirmLabel: reviewState === "confirmed" ? t("queue.confirmSelected") : t("queue.rejectSelected"),
      onConfirm: () => applyBatchDecision(reviewState),
    });
  }

  function updateField(
    change: PolicyChange,
    finding: Finding,
    side: "old" | "new",
    value: string,
  ) {
    pushUndo(`field:${finding.fingerprint}`, `${finding.field} field edit`);
    const existing = fieldEdits[finding.fingerprint];
    dispatch({
      type: "set-field-edit",
      fingerprint: finding.fingerprint,
      edit: {
        change_fingerprint: change.fingerprint,
        finding_fingerprint: finding.fingerprint,
        field: finding.field,
        machine_old_value: finding.old_value,
        machine_new_value: finding.new_value,
        reviewed_old_value:
          side === "old"
            ? value || null
            : existing?.reviewed_old_value ?? finding.old_value,
        reviewed_new_value:
          side === "new"
            ? value || null
            : existing?.reviewed_new_value ?? finding.new_value,
        updated_at: new Date().toISOString(),
      },
    });
    setDecision(
      change.fingerprint,
      "modified",
      undefined,
      `field:${finding.fingerprint}`,
      `${finding.field} field edit`,
      false,
    );
    dispatch({
      type: "set-notice",
      message: t("notice.fieldEdit", { field: finding.field }),
    });
  }

  async function readReportFile(file?: File) {
    if (!file) return;
    try {
      const data = parseReport(await readJsonFile(file));
      if (report && reportIdentityMatches(report, data)) {
        dispatch({
          type: "set-notice",
          message: t("notice.sameReport"),
        });
        return;
      }
      if (report) {
        setConfirmation({
          title: t("dialog.openTitle"),
          detail:
            hasReviewWork && exportStatus.state === "unexported"
              ? t("dialog.openUnexported")
              : t("dialog.openSaved"),
          confirmLabel: t("dialog.openConfirm"),
          onConfirm: async () => {
            const saved = await persistProjectSnapshot(stateRef.current);
            if (saved) await activateReport(data);
          },
        });
      } else {
        await activateReport(data);
      }
    } catch (error) {
      if (error instanceof ProjectCorruptionError) setIntegrityStatus("corrupt");
      dispatch({
        type: "set-load-error",
        message: error instanceof Error ? error.message : t("error.invalidReport"),
      });
    }
  }

  async function importReviewFile(file?: File) {
    if (!file || !report) return;
    try {
      const review = parseReviewImport(await readJsonFile(file), report);
      setIntegrityStatus("ready");
      const applyImport = () => {
        pushUndo(`import:${Date.now()}`, "review import");
        dispatch({ type: "import-review", review });
        dispatch({ type: "set-notice", message: t("notice.imported") });
      };
      if (hasReviewWork) {
        setConfirmation({
          title: t("dialog.importTitle"),
          detail:
            exportStatus.state === "unexported"
              ? t("dialog.importUnexported")
              : t("dialog.importSaved"),
          confirmLabel: t("dialog.importConfirm"),
          onConfirm: applyImport,
        });
      } else {
        applyImport();
      }
    } catch (error) {
      if (error instanceof ReviewIdentityMismatchError) {
        setIntegrityStatus("identity-mismatch");
      }
      dispatch({
        type: "set-load-error",
        message: error instanceof Error ? error.message : t("error.invalidReview"),
      });
    }
  }

  function saveState() {
    if (!report) return;
    void persistProjectSnapshot(stateRef.current, true);
  }

  async function exportReview() {
    if (!report) return;
    const exportedAt = new Date().toISOString();
    const payload = buildReviewExport(
      report,
      decisions,
      fieldEdits,
      alignmentOverrides,
      changes,
      exportedAt,
    );
    if (sessionModeRef.current) {
      try {
        const response = await fetch("/api/review-session/export", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("The local review session did not accept the export.");
      } catch (error) {
        dispatch({
          type: "set-load-error",
          message: error instanceof Error ? error.message : "Review export failed.",
        });
        return;
      }
    } else {
      downloadText(
        "governdiff-review.json",
        JSON.stringify(payload, null, 2),
        "application/json",
      );
    }
    dispatch({ type: "mark-exported", exportedAt });
    dispatch({
      type: "set-notice",
      message: t("notice.exported"),
    });
  }

  function exportWaivers() {
    if (!report) return;
    try {
      const waiver = buildWaiverExport(report, decisions, approver, waiverExpiry);
      downloadText(".governdiff-waivers.yml", waiver.content, "application/yaml");
      dispatch({
        type: "set-notice",
        message: t("notice.waiver", { count: waiver.entryCount }),
      });
    } catch (error) {
      dispatch({
        type: "set-notice",
        message:
          error instanceof Error ? error.message : "Unable to generate waivers.",
      });
    }
  }

  async function deleteCurrentProject() {
    const current = stateRef.current;
    if (!current.report) return;
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    await saveQueueRef.current.catch(() => undefined);
    const project = createProject({
      report: current.report,
      decisions: current.decisions,
      fieldEdits: current.fieldEdits,
      alignmentOverrides: current.alignmentOverrides,
      filters: current.filters,
      savedViews: current.savedViews,
      interfaceLanguage: current.interfaceLanguage,
      exportStatus: current.exportStatus,
      revision: current.projectRevision,
      createdAt: current.projectCreatedAt,
      updatedAt: new Date().toISOString(),
    });
    try {
      const deleted = await deleteProjectWithRecovery(project);
      setDeletionRecord(deleted);
      dispatch({ type: "clear-project" });
      dispatch({ type: "set-notice", message: t("notice.deleted") });
      setSaveStatus("saved");
      setIntegrityStatus("ready");
      setUndoStack([]);
      setMobilePane("queue");
    } catch (error) {
      setSaveStatus("error");
      dispatch({
        type: "set-load-error",
        message:
          error instanceof Error ? error.message : "The local project was not deleted.",
      });
    }
  }

  function clearLocalProject() {
    if (!report) return;
    setConfirmation({
      title: t("dialog.deleteTitle"),
      detail: t("dialog.deleteDetail"),
      confirmLabel: t("dialog.deleteConfirm"),
      destructive: true,
      onConfirm: deleteCurrentProject,
    });
  }

  async function restoreRecoveryRecord() {
    if (report) {
      const saved = await persistProjectSnapshot(stateRef.current);
      if (!saved) return;
    }
    try {
      const restored = await restoreDeletedProject();
      if (!restored) {
        setDeletionRecord(null);
        dispatch({ type: "set-notice", message: t("notice.noRecovery") });
        return;
      }
      dispatch({ type: "load-project", project: restored, persisted: true });
      setDeletionRecord(null);
      setSaveStatus("saved");
      setIntegrityStatus("ready");
      setUndoStack([]);
      setMobilePane("queue");
      dispatch({ type: "set-notice", message: t("notice.restored") });
    } catch (error) {
      setSaveStatus("error");
      dispatch({
        type: "set-load-error",
        message:
          error instanceof Error ? error.message : "The deleted project was not restored.",
      });
    }
  }

  function requestRecovery() {
    if (report) {
      setConfirmation({
        title: t("dialog.restoreTitle"),
        detail: t("dialog.restoreDetail"),
        confirmLabel: t("dialog.restoreConfirm"),
        onConfirm: restoreRecoveryRecord,
      });
    } else {
      void restoreRecoveryRecord();
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void readReportFile(event.dataTransfer.files?.[0]);
  }

  const oldBlocks = useMemo(
    () => report
      ? uniqueBlocks([
          ...(report.old_document.blocks ?? []),
          ...report.changes.flatMap((change) => change.old_blocks ?? [change.old_block]),
        ])
      : [],
    [report],
  );
  const newBlocks = useMemo(
    () => report
      ? uniqueBlocks([
          ...(report.new_document.blocks ?? []),
          ...report.changes.flatMap((change) => change.new_blocks ?? [change.new_block]),
        ])
      : [],
    [report],
  );

  function beginAlignmentEdit() {
    setAlignmentEditorOpen(true);
    setAlignmentNotice("");
  }

  function saveAlignment(change: PolicyChange, oldBlockIds: string[], newBlockIds: string[]) {
    if (!oldBlockIds.length || !newBlockIds.length) {
      setAlignmentNotice(
        t("alignment.choose"),
      );
      return;
    }
    setConfirmation({
      title: t("alignment.confirmTitle"),
      detail: t("alignment.confirmDetail", { oldCount: oldBlockIds.length, newCount: newBlockIds.length }),
      confirmLabel: t("alignment.apply"),
      onConfirm: () => {
        pushUndo(`alignment:${Date.now()}`, "manual relink");
        dispatch({
          type: "set-alignment",
          fingerprint: change.fingerprint,
          alignment: {
            action: "relink",
            original_change_fingerprint: change.fingerprint,
            old_block_ids: oldBlockIds,
            new_block_ids: newBlockIds,
            updatedAt: new Date().toISOString(),
          },
        });
        setAlignmentEditorOpen(false);
        setAlignmentNotice(
          t("alignment.saved"),
        );
      },
    });
  }

  function unlinkAlignment(change: PolicyChange) {
    setConfirmation({
      title: t("alignment.unlinkTitle"),
      detail: t("alignment.unlinkDetail"),
      confirmLabel: t("alignment.unlink"),
      destructive: true,
      onConfirm: () => {
        pushUndo(`alignment:${Date.now()}`, "alignment unlink");
        dispatch({
          type: "set-alignment",
          fingerprint: change.fingerprint,
          alignment: {
            action: "unlink",
            original_change_fingerprint: change.fingerprint,
            old_block_ids: (change.old_blocks ?? [change.old_block])
              .filter(Boolean)
              .map((block) => block!.block_id),
            new_block_ids: (change.new_blocks ?? [change.new_block])
              .filter(Boolean)
              .map((block) => block!.block_id),
            updatedAt: new Date().toISOString(),
          },
        });
        setAlignmentEditorOpen(false);
        setAlignmentNotice(
          t("alignment.unlinked"),
        );
      },
    });
  }

  function updateFilter<K extends keyof ReviewerFilters>(
    name: K,
    value: ReviewerFilters[K],
  ) {
    dispatch({ type: "set-filter", name, value });
  }

  function saveView(name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 40) {
      dispatch({ type: "set-notice", message: t("view.invalid") });
      return false;
    }
    const now = new Date().toISOString();
    const duplicate = savedViews.find((view) => view.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase());
    const next: SavedView[] = duplicate
      ? savedViews.map((view) => view.id === duplicate.id ? { ...view, name: trimmed, filters: { ...filters }, updated_at: now } : view)
      : [...savedViews, { id: `view-${Date.now().toString(36)}`, name: trimmed, filters: { ...filters }, created_at: now, updated_at: now }];
    dispatch({ type: "set-saved-views", savedViews: next });
    dispatch({ type: "set-notice", message: t("view.saved", { name: trimmed }) });
    return true;
  }

  function applyView(id: string) {
    const view = savedViews.find((item) => item.id === id);
    if (!view) return;
    dispatch({ type: "apply-filters", filters: { ...view.filters } });
    dispatch({ type: "set-notice", message: t("view.applied", { name: view.name }) });
  }

  function deleteView(id: string) {
    const view = savedViews.find((item) => item.id === id);
    if (!view) return;
    setConfirmation({
      title: interfaceLanguage === "zh-CN" ? `删除保存视图“${view.name}”？` : `Delete saved view “${view.name}”?`,
      detail: interfaceLanguage === "zh-CN" ? "只会删除本地保存的筛选与排序，不会删除任何审阅决定。" : "Only the locally saved filters and sort will be deleted; review decisions are not affected.",
      confirmLabel: interfaceLanguage === "zh-CN" ? "删除视图" : "Delete view",
      destructive: true,
      onConfirm: () => {
        dispatch({ type: "set-saved-views", savedViews: savedViews.filter((item) => item.id !== id) });
        dispatch({ type: "set-notice", message: t("view.deleted", { name: view.name }) });
      },
    });
  }

  function decideAndNext(reviewState: Exclude<ReviewState, "unreviewed">) {
    if (!selected) return;
    const nextFingerprint = nextQueueFingerprint(changes, selected.fingerprint);
    setDecision(selected.fingerprint, reviewState);
    if (nextFingerprint) {
      dispatch({ type: "select-change", fingerprint: nextFingerprint });
      setMobilePane("evidence");
      window.requestAnimationFrame(() => evidenceFocusRef.current?.focus());
    } else {
      setMobilePane("queue");
    }
  }

  function selectFromQueue(fingerprint: string) {
    dispatch({ type: "select-change", fingerprint });
    setMobilePane("evidence");
  }

  const reviewedCount = useMemo(
    () => report
      ? report.changes.filter(
          (change) =>
            normalizeState(
              decisions[change.fingerprint]?.state ?? change.review?.state,
            ) !== "unreviewed",
        ).length
      : 0,
    [decisions, report],
  );
  const lowConfidenceCount = useMemo(
    () => report
      ? report.changes.filter(
          (change) =>
            change.change_type !== "unchanged" && change.confidence_level === "low",
        ).length
      : 0,
    [report],
  );
  const mappingConflicts = useMemo(
    () => report
      ? report.article_mappings.filter(
          (mapping) => (mapping.status ?? "unique") !== "unique",
        ).length
      : 0,
    [report],
  );
  const selectedReviewState = selected
    ? normalizeState(
        decisions[selected.fingerprint]?.state ?? selected.review?.state,
      )
    : "unreviewed";

  return (
    <I18nProvider language={interfaceLanguage}>
    <main className="app-shell" id="review-main">
      <a className="skip-link" href="#change-review">
        {t("app.skip")}
      </a>
      <CommandBar
        report={report}
        sessionMode={sessionMode}
        onOpenReport={(file) => void readReportFile(file)}
        onSaveState={saveState}
        onImportReview={(file) => void importReviewFile(file)}
        onExportReview={exportReview}
        onClearProject={clearLocalProject}
        onLanguageChange={(language) => dispatch({ type: "set-interface-language", language })}
      />

      <ProjectStatus
        saveStatus={saveStatus}
        dirty={dirty}
        exportStatus={exportStatus}
        integrityStatus={integrityStatus}
        updatedAt={projectUpdatedAt}
        hasRecovery={Boolean(deletionRecord)}
        undoLabel={undoStack.at(-1)?.label}
        onRestore={requestRecovery}
        onUndo={undoLastChange}
      />

      {confirmation && (
        <ConfirmationDialog
          title={confirmation.title}
          detail={confirmation.detail}
          confirmLabel={confirmation.confirmLabel}
          destructive={confirmation.destructive}
          onCancel={() => setConfirmation(null)}
          onConfirm={() => {
            const action = confirmation.onConfirm;
            setConfirmation(null);
            void action();
          }}
        />
      )}

      <div className="sr-only" aria-live="polite">
        {notice}
      </div>
      {notice && (
        <div className="notice-banner" role="status">
          {notice}
        </div>
      )}
      {loadError && (
        <div className="error-banner" role="alert">
          <strong>{t("warning.title")}</strong> {loadError}
        </div>
      )}

      {!report ? (
        <div
          className={`drop-zone ${isDragging ? "dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <div className="drop-icon">
            <Icon name="upload" />
          </div>
          <h1>{t("open.title")}</h1>
          <p>{t("open.detail")}</p>
        </div>
      ) : (
        <>
          <ReviewSummary
            report={report}
            warnings={warnings}
            reviewedCount={reviewedCount}
            lowConfidenceCount={lowConfidenceCount}
            mappingConflicts={mappingConflicts}
            queueTotal={progressQueue.length}
            queueReviewed={progressQueue.filter((change) => normalizeState(decisions[change.fingerprint]?.state ?? change.review?.state) !== "unreviewed").length}
          />

          <div className="mobile-workspace-tabs" role="tablist" aria-label={t("tabs.aria")}>
            {mobilePanes.map((pane) => (
              <button
                id={`mobile-tab-${pane.id}`}
                key={pane.id}
                role="tab"
                aria-selected={mobilePane === pane.id}
                aria-controls={`mobile-panel-${pane.id}`}
                aria-label={pane.label}
                onClick={() => setMobilePane(pane.id)}
              >
                <span>{pane.label}</span>
                {pane.id !== "queue" && selected && (
                  <small className="mobile-tab-progress" aria-hidden="true">
                    {Math.max(1, changes.findIndex((change) => change.fingerprint === selected.fingerprint) + 1)}/{Math.max(1, changes.length)}
                  </small>
                )}
              </button>
            ))}
          </div>

          <div className="review-workspace">
            <ReviewQueue
              report={report}
              changes={changes}
              filters={filters}
              selectedId={selected?.fingerprint ?? selectedId}
              batchIds={batchIds}
              decisions={decisions}
              savedViews={savedViews}
              mobileActive={mobilePane === "queue"}
              onFilterChange={updateFilter}
              onResetFilters={() => dispatch({ type: "reset-filters" })}
              onApplyFilters={(nextFilters) => dispatch({ type: "apply-filters", filters: nextFilters })}
              onSaveView={saveView}
              onApplyView={applyView}
              onDeleteView={deleteView}
              onSelect={selectFromQueue}
              onToggleBatch={(fingerprint, checked) =>
                dispatch({
                  type: "toggle-batch",
                  fingerprint,
                  selected: checked,
                })
              }
              onBatchDecision={setBatchDecision}
              onSelectVisible={() => dispatch({ type: "set-batch", fingerprints: changes.map((change) => change.fingerprint) })}
              onClearSelection={() => dispatch({ type: "set-batch", fingerprints: [] })}
            />

            <section
              className="workspace-pane evidence-pane"
              id="mobile-panel-evidence"
              role="tabpanel"
              aria-labelledby="mobile-tab-evidence"
              data-mobile-active={mobilePane === "evidence"}
            >
              <div className="pane-heading evidence-pane-heading">
                <div>
                  <span>{t("evidence.title")}</span>
                  <strong>{selected ? selected.section : t("evidence.none")}</strong>
                </div>
                {selected && (
                  <span className={confidenceClass(selected.confidence_level)}>
                    {t(`confidence.${selected.confidence_level}`)} {formatScore(selected.confidence_score)}
                  </span>
                )}
              </div>

              <div className="evidence-scroll" id="change-review" tabIndex={-1} ref={evidenceFocusRef}>
                {selected ? (
                  <>
                    <header className="review-heading">
                      <div>
                        <span className="eyebrow">
                          {selected.change_type} · {selected.fingerprint}
                        </span>
                        <CollapsibleContent text={selected.findings[0]?.summary ?? selected.section} threshold={180}><h1>{selected.findings[0]?.summary ?? selected.section}</h1></CollapsibleContent>
                        <p>{selected.section}</p>
                      </div>
                      <div className="score-seal" aria-label={`${t("evidence.confidence")} ${formatScore(selected.confidence_score)}`}>
                        <span>{t("evidence.confidence")}</span>
                        <strong>{formatScore(selected.confidence_score)}</strong>
                        <small>{t(`confidence.${selected.confidence_level}`)}</small>
                      </div>
                    </header>

                    <EvidenceComparison change={selected} />

                    {selected.article_mapping && (
                      <section
                        className={`mapping-candidates mapping-${
                          selected.article_mapping.status ?? "unique"
                        }`}
                        aria-label={t("evidence.mappingCandidates")}
                      >
                        <div>
                          <span>{t("evidence.mapping")}</span>
                          <b>{selected.article_mapping.status ?? "unique"}</b>
                          <small>
                            {t("evidence.margin", { score: formatScore(selected.article_mapping.competition_margin ?? 1) })}
                          </small>
                        </div>
                        <ol>
                          {(selected.article_mapping.candidates ?? []).map(
                            (candidate) => (
                              <li key={candidate.new_key}>
                                <span>{candidate.new_article}</span>
                                <strong>
                                  {formatScore(candidate.competition_score)}
                                </strong>
                                <small>
                                  {t("evidence.rank", { rank: candidate.rank, count: candidate.evidence_count })}
                                </small>
                              </li>
                            ),
                          )}
                        </ol>
                      </section>
                    )}

                    {!!selected.temporal_changes?.length && (
                      <section
                        className="temporal-strip"
                        aria-label={t("evidence.temporal")}
                      >
                        {selected.temporal_changes.map((temporal, index) => (
                          <div key={`${temporal.kind}-${index}`}>
                            <span>{temporal.kind.replace("_", " ")}</span>
                            <strong>
                              {temporal.old_normalized ?? "∅"} <Icon name="arrow" />{" "}
                              {temporal.new_normalized ?? "∅"}
                            </strong>
                            <b>{temporal.direction}</b>
                          </div>
                        ))}
                      </section>
                    )}

                    <section className="alignment-editor">
                      <div className="alignment-heading">
                        <div>
                          <span>{t("alignment.title")}</span>
                          <strong>
                            {alignmentOverrides[selected.fingerprint]?.action ??
                              selected.alignment_status ??
                              "automatic"}
                          </strong>
                        </div>
                        <div>
                          <button
                            className="button button-secondary"
                            onClick={beginAlignmentEdit}
                          >
                            {t("alignment.edit")}
                          </button>
                          {selected.old_block && selected.new_block && (
                            <button
                              className="button button-danger"
                              onClick={() => unlinkAlignment(selected)}
                            >
                              {t("alignment.unlink")}
                            </button>
                          )}
                        </div>
                      </div>
                      {alignmentEditorOpen && (
                        <AlignmentRepair
                          change={selected}
                          oldBlocks={oldBlocks}
                          newBlocks={newBlocks}
                          initialOldIds={alignmentOverrides[selected.fingerprint]?.old_block_ids ?? (selected.old_blocks ?? [selected.old_block]).filter(Boolean).map((block) => block!.block_id)}
                          initialNewIds={alignmentOverrides[selected.fingerprint]?.new_block_ids ?? (selected.new_blocks ?? [selected.new_block]).filter(Boolean).map((block) => block!.block_id)}
                          onApply={(oldIds, newIds) => saveAlignment(selected, oldIds, newIds)}
                          onCancel={() => setAlignmentEditorOpen(false)}
                        />
                      )}
                      {alignmentNotice && (
                        <p className="alignment-notice" role="status">
                          {alignmentNotice}
                        </p>
                      )}
                    </section>

                    <section className="findings-panel" aria-label={t("evidence.findings")}>
                      <div className="section-title">
                        <span>{t("evidence.findings")}</span>
                        <b>{selected.findings.length}</b>
                      </div>
                      {selected.findings.map((finding) => {
                        const edit = fieldEdits[finding.fingerprint];
                        return (
                          <article className="finding" key={finding.fingerprint}>
                            <div className="finding-header">
                              <code>
                                {finding.check_id} · {finding.field}
                              </code>
                              <span className={confidenceClass(finding.confidence_level)}>
                                {t(`confidence.${finding.confidence_level}`)}{" "}
                                {formatScore(finding.confidence_score)}
                              </span>
                            </div>
                            <CollapsibleContent text={finding.summary} threshold={180}><h2>{finding.summary}</h2></CollapsibleContent>
                            <CollapsibleContent text={finding.explanation} threshold={240} />
                            <div className="field-editor">
                              <p>
                                <b>{t("evidence.machineValues")}</b> {finding.old_value ?? "∅"}{" "}
                                → {finding.new_value ?? "∅"}
                              </p>
                              <label>
                                {t("evidence.reviewedOld")}
                                <input
                                  value={
                                    edit?.reviewed_old_value ?? finding.old_value ?? ""
                                  }
                                  onChange={(event) =>
                                    updateField(
                                      selected,
                                      finding,
                                      "old",
                                      event.target.value,
                                    )
                                  }
                                />
                              </label>
                              <label>
                                {t("evidence.reviewedNew")}
                                <input
                                  value={
                                    edit?.reviewed_new_value ?? finding.new_value ?? ""
                                  }
                                  onChange={(event) =>
                                    updateField(
                                      selected,
                                      finding,
                                      "new",
                                      event.target.value,
                                    )
                                  }
                                />
                              </label>
                              {edit && (
                                <span className="modified-label">
                                  {t("evidence.modified")}
                                </span>
                              )}
                            </div>
                            <CollapsibleContent text={finding.confidence_reasons.join(" ")} threshold={220}>
                              <ul>{finding.confidence_reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                            </CollapsibleContent>
                          </article>
                        );
                      })}
                    </section>
                  </>
                ) : (
                  <div className="empty-state large">
                    {t("evidence.select")}
                  </div>
                )}
              </div>
            </section>

            <section
              className="workspace-pane decision-pane"
              id="mobile-panel-decision"
              role="tabpanel"
              aria-labelledby="mobile-tab-decision"
              data-mobile-active={mobilePane === "decision"}
            >
              {selected ? (
                <DecisionPanel
                  state={selectedReviewState}
                  note={
                    decisions[selected.fingerprint]?.note ??
                    selected.review?.note ??
                    ""
                  }
                  approver={approver}
                  waiverExpiry={waiverExpiry}
                  onDecision={(nextState) =>
                    setDecision(
                      selected.fingerprint,
                      nextState,
                      undefined,
                      `decision:${selected.fingerprint}`,
                      "review decision",
                    )
                  }
                  onNote={(note) =>
                    setDecision(
                      selected.fingerprint,
                      selectedReviewState,
                      note,
                      `note:${selected.fingerprint}`,
                      "review note",
                    )
                  }
                  onApprover={setApprover}
                  onWaiverExpiry={setWaiverExpiry}
                  onGenerateWaiver={exportWaivers}
                  onDecisionAndNext={decideAndNext}
                />
              ) : (
                <div className="empty-state">{t("decision.select")}</div>
              )}
            </section>
          </div>
        </>
      )}
    </main>
    </I18nProvider>
  );
}
