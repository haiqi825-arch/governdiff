import type {
  AlignmentOverride,
  Decision,
  Decisions,
  FieldEdit,
  ImportedReview,
  Project,
  ReviewDataSnapshot,
  ReviewerDomainState,
  ReviewerFilters,
  InterfaceLanguage,
  SavedView,
} from "./reviewer-types";

export const defaultFilters: ReviewerFilters = {
  query: "",
  confidence: "all",
  changeType: "all",
  sectionFilter: "",
  breakingOnly: false,
  unreviewedOnly: false,
  hideFormatOnly: false,
  sortBy: "document",
};

export const initialReviewerState: ReviewerDomainState = {
  report: null,
  loadError: "",
  notice: "",
  filters: defaultFilters,
  savedViews: [],
  interfaceLanguage: "en",
  selectedId: "",
  batchIds: [],
  decisions: {},
  fieldEdits: {},
  alignmentOverrides: {},
  projectId: "",
  projectCreatedAt: "",
  projectUpdatedAt: "",
  projectRevision: 0,
  savedRevision: 0,
  exportStatus: {
    state: "unexported",
    last_exported_at: null,
    exported_revision: null,
  },
};

export type ReviewerAction =
  | { type: "load-project"; project: Project; persisted: boolean }
  | { type: "set-load-error"; message: string }
  | { type: "set-notice"; message: string }
  | { type: "set-filter"; name: keyof ReviewerFilters; value: ReviewerFilters[keyof ReviewerFilters] }
  | { type: "apply-filters"; filters: ReviewerFilters }
  | { type: "reset-filters" }
  | { type: "set-saved-views"; savedViews: SavedView[] }
  | { type: "set-interface-language"; language: InterfaceLanguage }
  | { type: "select-change"; fingerprint: string }
  | { type: "toggle-batch"; fingerprint: string; selected: boolean }
  | { type: "set-batch"; fingerprints: string[] }
  | { type: "set-decisions"; decisions: Decisions }
  | { type: "set-decision"; fingerprint: string; decision: Decision }
  | { type: "set-field-edit"; fingerprint: string; edit: FieldEdit }
  | { type: "set-alignment"; fingerprint: string; alignment: AlignmentOverride }
  | { type: "import-review"; review: ImportedReview }
  | { type: "restore-review-data"; snapshot: ReviewDataSnapshot }
  | { type: "mark-saved"; revision: number; updatedAt: string }
  | { type: "mark-exported"; exportedAt: string }
  | { type: "clear-project" };

function changed(
  state: ReviewerDomainState,
  patch: Partial<ReviewerDomainState>,
): ReviewerDomainState {
  return {
    ...state,
    ...patch,
    projectRevision: state.projectRevision + 1,
    exportStatus: {
      ...state.exportStatus,
      state: "unexported",
    },
  };
}

function preferenceChanged(
  state: ReviewerDomainState,
  patch: Partial<ReviewerDomainState>,
): ReviewerDomainState {
  return {
    ...state,
    ...patch,
    projectRevision: state.projectRevision + 1,
  };
}

export function reviewerReducer(
  state: ReviewerDomainState,
  action: ReviewerAction,
): ReviewerDomainState {
  switch (action.type) {
    case "load-project":
      return {
        ...initialReviewerState,
        report: action.project.report,
        selectedId:
          action.project.report.changes.find(
            (item) => item.change_type !== "unchanged",
          )
            ?.fingerprint ?? "",
        filters: action.project.filters,
        savedViews: action.project.saved_views,
        interfaceLanguage: action.project.interface_language,
        decisions: action.project.decisions,
        fieldEdits: action.project.field_edits,
        alignmentOverrides: action.project.alignment_overrides,
        projectId: action.project.id,
        projectCreatedAt: action.project.created_at,
        projectUpdatedAt: action.project.updated_at,
        projectRevision: action.project.revision,
        savedRevision: action.persisted
          ? action.project.revision
          : Math.max(0, action.project.revision - 1),
        exportStatus: action.project.export_status,
      };
    case "set-load-error":
      return { ...state, loadError: action.message };
    case "set-notice":
      return { ...state, notice: action.message };
    case "set-filter":
      return changed(state, {
        filters: { ...state.filters, [action.name]: action.value },
        batchIds: [],
      });
    case "apply-filters":
      return changed(state, { filters: action.filters, batchIds: [] });
    case "reset-filters":
      return changed(state, {
        filters: { ...defaultFilters, sortBy: state.filters.sortBy },
        batchIds: [],
      });
    case "set-saved-views":
      return preferenceChanged(state, { savedViews: action.savedViews });
    case "set-interface-language":
      return preferenceChanged(state, { interfaceLanguage: action.language });
    case "select-change":
      return { ...state, selectedId: action.fingerprint };
    case "toggle-batch":
      return {
        ...state,
        batchIds: action.selected
          ? Array.from(new Set([...state.batchIds, action.fingerprint]))
          : state.batchIds.filter((item) => item !== action.fingerprint),
      };
    case "set-batch":
      return { ...state, batchIds: Array.from(new Set(action.fingerprints)) };
    case "set-decisions":
      return changed(state, { decisions: action.decisions });
    case "set-decision":
      return changed(state, {
        decisions: { ...state.decisions, [action.fingerprint]: action.decision },
      });
    case "set-field-edit":
      return changed(state, {
        fieldEdits: { ...state.fieldEdits, [action.fingerprint]: action.edit },
      });
    case "set-alignment":
      return changed(state, {
        alignmentOverrides: {
          ...state.alignmentOverrides,
          [action.fingerprint]: action.alignment,
        },
      });
    case "import-review":
      return changed(state, {
        loadError: "",
        notice: "",
        decisions: action.review.decisions,
        fieldEdits: action.review.fieldEdits,
        alignmentOverrides: action.review.alignmentOverrides,
      });
    case "restore-review-data":
      return changed(state, {
        decisions: action.snapshot.decisions,
        fieldEdits: action.snapshot.fieldEdits,
        alignmentOverrides: action.snapshot.alignmentOverrides,
        filters: action.snapshot.filters,
        savedViews: action.snapshot.savedViews,
      });
    case "mark-saved":
      return {
        ...state,
        loadError: "",
        savedRevision: Math.max(state.savedRevision, action.revision),
        projectUpdatedAt: action.updatedAt,
      };
    case "mark-exported": {
      const revision = state.projectRevision + 1;
      return {
        ...state,
        projectRevision: revision,
        exportStatus: {
          state: "exported",
          last_exported_at: action.exportedAt,
          exported_revision: revision,
        },
      };
    }
    case "clear-project":
      return {
        ...initialReviewerState,
      };
    default:
      return state;
  }
}
