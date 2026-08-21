export type Confidence = "high" | "medium" | "low";

export type InterfaceLanguage = "en" | "zh-CN";

export type ReviewerSort = "document" | "risk" | "unreviewed";

export type ReviewState =
  | "unreviewed"
  | "confirmed"
  | "rejected"
  | "modified"
  | "waived";

export type Block = {
  block_id: string;
  section?: string[];
  section_label: string;
  text: string;
  line_start: number;
  line_end: number;
  evidence_label?: string;
  normalized_text?: string;
  comparison_text?: string;
  ordinal?: number;
  block_type?: string;
  page_start?: number | null;
  page_end?: number | null;
  paragraph_start?: number | null;
  paragraph_end?: number | null;
  char_start?: number | null;
  char_end?: number | null;
  list_level?: number | null;
  table_id?: string | null;
  table_row?: number | null;
  table_column?: number | null;
  is_noise?: boolean;
};

export type InputIssue = {
  code: string;
  severity: string;
  reason: string;
  impact: string;
  next_step: string;
};

export type DocumentMetadata = {
  path?: string;
  source_name?: string;
  sha256: string;
  language?: string;
  format?: string;
  imported_at?: string;
  block_count: number;
  word_count?: number;
  table_count?: number;
  blocks?: Block[];
  preflight?: {
    status: string;
    suspected_scanned?: boolean;
    issues?: InputIssue[];
  } | null;
};

export type Finding = {
  fingerprint: string;
  check_id: string;
  field: string;
  severity: string;
  breaking: boolean;
  summary: string;
  explanation: string;
  old_value: string | null;
  new_value: string | null;
  old_evidence: string | null;
  new_evidence: string | null;
  confidence_score: number;
  confidence_level: Confidence;
  confidence_reasons: string[];
  waived: boolean;
  review_state?: ReviewState;
  reviewed_old_value?: string | null;
  reviewed_new_value?: string | null;
};

export type ArticleCandidate = {
  new_key: string;
  new_article: string;
  evidence_count: number;
  average_similarity: number;
  competition_score: number;
  rank: number;
  selected: boolean;
};

export type ArticleMapping = {
  old_key: string;
  new_key: string;
  old_article: string;
  new_article: string;
  evidence_count: number;
  average_similarity: number;
  confidence_score: number;
  confidence_level: Confidence;
  confidence_reasons: string[];
  status?: "unique" | "ambiguous" | "conflict";
  competition_margin?: number;
  candidates?: ArticleCandidate[];
};

export type WordDiffOperation = {
  operation: "equal" | "insert" | "delete" | "replace";
  old_text: string;
  new_text: string;
};

export type TemporalChange = {
  kind: "effective_date" | "deadline";
  old_normalized: string | null;
  new_normalized: string | null;
  direction: string;
};

export type SectionNode = {
  section_id: string;
  title: string;
  path: string[];
  change_count: number;
  children: SectionNode[];
};

export type EmbeddedReview = {
  state: ReviewState;
  note: string | null;
  updated_at: string | null;
};

export type PolicyChange = {
  fingerprint: string;
  change_type: string;
  similarity: number;
  severity: string;
  section: string;
  section_path?: string[];
  old_article: string | null;
  new_article: string | null;
  article_mapping: ArticleMapping | null;
  confidence_score: number;
  confidence_level: Confidence;
  confidence_reasons: string[];
  old_block: Block | null;
  new_block: Block | null;
  old_blocks?: Block[];
  new_blocks?: Block[];
  word_diff?: WordDiffOperation[];
  temporal_changes?: TemporalChange[];
  alignment_status?: "automatic" | "needs-review" | "human-corrected";
  review?: EmbeddedReview;
  findings: Finding[];
};

export type Report = {
  schema_version: string;
  generator?: string;
  generated_at: string;
  disclaimer?: string;
  redacted?: boolean;
  old_document: DocumentMetadata;
  new_document: DocumentMetadata;
  summary: {
    total_changes: number;
    active_findings: number;
    breaking_findings: number;
    high_confidence_breaking_findings: number;
  };
  article_mappings: ArticleMapping[];
  section_tree?: SectionNode[];
  changes: PolicyChange[];
};

export type Decision = {
  state: ReviewState;
  note: string;
  updatedAt: string;
};

export type Decisions = Record<string, Decision>;

export type FieldEdit = {
  change_fingerprint: string;
  finding_fingerprint: string;
  field: string;
  machine_old_value: string | null;
  machine_new_value: string | null;
  reviewed_old_value: string | null;
  reviewed_new_value: string | null;
  updated_at: string;
};

export type FieldEdits = Record<string, FieldEdit>;

export type AlignmentOverride = {
  action: "unlink" | "relink";
  original_change_fingerprint: string;
  old_block_ids: string[];
  new_block_ids: string[];
  updatedAt: string;
};

export type AlignmentOverrides = Record<string, AlignmentOverride>;

export type ReviewerFilters = {
  query: string;
  confidence: Confidence | "all";
  changeType: string;
  sectionFilter: string;
  breakingOnly: boolean;
  unreviewedOnly: boolean;
  hideFormatOnly: boolean;
  sortBy: ReviewerSort;
};

export type SavedView = {
  id: string;
  name: string;
  filters: ReviewerFilters;
  created_at: string;
  updated_at: string;
};

export type ProjectIdentity = {
  old_sha256: string;
  new_sha256: string;
};

export type ProjectExportStatus = {
  state: "unexported" | "exported";
  last_exported_at: string | null;
  exported_revision: number | null;
};

export type Project = {
  id: string;
  schema_version: "governdiff-project/1.1";
  report_identity: ProjectIdentity;
  report: Report;
  decisions: Decisions;
  field_edits: FieldEdits;
  alignment_overrides: AlignmentOverrides;
  filters: ReviewerFilters;
  saved_views: SavedView[];
  interface_language: InterfaceLanguage;
  export_status: ProjectExportStatus;
  revision: number;
  created_at: string;
  updated_at: string;
};

export type ProjectDeletionRecord = {
  id: "last-deleted-project";
  schema_version: "governdiff-project-deletion/1.0";
  project: Project;
  deleted_at: string;
  expires_at: string;
};

export type ProjectSaveStatus =
  | "restoring"
  | "saving"
  | "saved"
  | "error";

export type ProjectIntegrityStatus = "ready" | "identity-mismatch" | "corrupt";

export type ReviewDataSnapshot = {
  decisions: Decisions;
  fieldEdits: FieldEdits;
  alignmentOverrides: AlignmentOverrides;
  filters: ReviewerFilters;
  savedViews: SavedView[];
};

export type ReviewerDomainState = {
  report: Report | null;
  loadError: string;
  notice: string;
  filters: ReviewerFilters;
  savedViews: SavedView[];
  interfaceLanguage: InterfaceLanguage;
  selectedId: string;
  batchIds: string[];
  decisions: Decisions;
  fieldEdits: FieldEdits;
  alignmentOverrides: AlignmentOverrides;
  projectId: string;
  projectCreatedAt: string;
  projectUpdatedAt: string;
  projectRevision: number;
  savedRevision: number;
  exportStatus: ProjectExportStatus;
};

export type ImportedReview = {
  decisions: Decisions;
  fieldEdits: FieldEdits;
  alignmentOverrides: AlignmentOverrides;
};

export type ReviewExportPayload = {
  schema_version: "governdiff-review/1.1";
  report: {
    old_sha256: string;
    new_sha256: string;
    generated_at: string;
  };
  exported_at: string;
  decisions: Array<{
    change_fingerprint: string;
    state: ReviewState;
    note: string;
    updated_at: string;
  }>;
  field_edits: FieldEdit[];
  alignment_overrides: Array<AlignmentOverride & { updated_at: string }>;
  filters: { visible_change_fingerprints: string[] };
};
