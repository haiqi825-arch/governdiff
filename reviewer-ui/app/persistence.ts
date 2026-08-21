import { parseReport } from "./report-import";
import { normalizeState } from "./reviewer-model.mjs";
import { defaultFilters } from "./reviewer-reducer";
import type {
  AlignmentOverrides,
  Decisions,
  FieldEdits,
  Project,
  ProjectDeletionRecord,
  ProjectExportStatus,
  Report,
  ReviewerFilters,
  InterfaceLanguage,
  SavedView,
} from "./reviewer-types";

export const PROJECT_SCHEMA_VERSION = "governdiff-project/1.1" as const;
export const PROJECT_DATABASE_NAME = "governdiff-reviewer";
export const PROJECT_DATABASE_VERSION = 1;
export const RECOVERY_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const ACTIVE_PROJECT_KEY = "active-project";
const LAST_DELETED_PROJECT_KEY = "last-deleted-project";

type ProjectStorageErrorCode =
  | "quota"
  | "unavailable"
  | "conflict"
  | "corrupt"
  | "transaction";

export class ProjectStorageError extends Error {
  readonly code: ProjectStorageErrorCode;

  constructor(code: ProjectStorageErrorCode, message: string) {
    super(message);
    this.name = "ProjectStorageError";
    this.code = code;
  }
}

export class ProjectCorruptionError extends ProjectStorageError {
  constructor() {
    super(
      "corrupt",
      "A local project record is damaged or incompatible and was isolated from active work.",
    );
    this.name = "ProjectCorruptionError";
  }
}

export type ReviewStorageKeys = {
  decisions: string;
  fields: string;
  alignments: string;
};

export type LegacyReviewState = {
  found: boolean;
  decisions: Decisions;
  fieldEdits: FieldEdits;
  alignmentOverrides: AlignmentOverrides;
};

export type ProjectLoadResult = {
  project: Project | null;
  corruptionDetected: boolean;
};

let projectDatabaseFactory: IDBFactory | null = null;
let projectDatabasePromise: Promise<IDBDatabase> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function storageError(error: unknown): ProjectStorageError {
  if (error instanceof ProjectStorageError) return error;
  if (error instanceof DOMException && error.name === "QuotaExceededError") {
    return new ProjectStorageError(
      "quota",
      "Local storage is full. The last saved project is still available; free browser storage and retry.",
    );
  }
  if (
    error instanceof DOMException &&
    ["InvalidStateError", "NotSupportedError", "SecurityError"].includes(error.name)
  ) {
    return new ProjectStorageError(
      "unavailable",
      "Secure local project storage is unavailable in this browser context.",
    );
  }
  return new ProjectStorageError(
    "transaction",
    "The local project transaction did not complete. The last saved version was retained.",
  );
}

function activeFactory(): IDBFactory {
  const factory = projectDatabaseFactory ?? globalThis.indexedDB;
  if (!factory) {
    throw new ProjectStorageError(
      "unavailable",
      "Secure local project storage is unavailable in this browser context.",
    );
  }
  return factory;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export function setProjectDatabaseFactoryForTests(factory: IDBFactory | null): void {
  if (projectDatabasePromise) {
    void projectDatabasePromise.then((database) => database.close()).catch(() => undefined);
  }
  projectDatabaseFactory = factory;
  projectDatabasePromise = null;
}

export function openProjectDatabase(): Promise<IDBDatabase> {
  if (projectDatabasePromise) return projectDatabasePromise;
  const opening = new Promise<IDBDatabase>((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = activeFactory().open(PROJECT_DATABASE_NAME, PROJECT_DATABASE_VERSION);
    } catch (error) {
      reject(storageError(error));
      return;
    }
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("projects")) {
        database.createObjectStore("projects", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("meta")) {
        database.createObjectStore("meta", { keyPath: "key" });
      }
      if (!database.objectStoreNames.contains("trash")) {
        database.createObjectStore("trash", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("quarantine")) {
        database.createObjectStore("quarantine", { keyPath: "id" });
      }
    };
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      resolve(database);
    };
    request.onerror = () => reject(storageError(request.error));
    request.onblocked = () =>
      reject(
        new ProjectStorageError(
          "unavailable",
          "Local project storage is busy in another window. Close the other window and retry.",
        ),
      );
  }).catch((error): never => {
    projectDatabasePromise = null;
    throw storageError(error);
  });
  projectDatabasePromise = opening;
  return opening;
}

export function projectIdForReport(report: Report): string {
  return `governdiff:${report.old_document.sha256}:${report.new_document.sha256}`;
}

export function reportIdentityMatches(left: Report, right: Report): boolean {
  return (
    left.old_document.sha256 === right.old_document.sha256 &&
    left.new_document.sha256 === right.new_document.sha256
  );
}

function normalizedFilters(value: unknown): ReviewerFilters {
  if (!isRecord(value)) return { ...defaultFilters };
  const confidence = ["all", "high", "medium", "low"].includes(
    String(value.confidence),
  )
    ? (value.confidence as ReviewerFilters["confidence"])
    : "all";
  return {
    query: typeof value.query === "string" ? value.query : "",
    confidence,
    changeType: typeof value.changeType === "string" ? value.changeType : "all",
    sectionFilter:
      typeof value.sectionFilter === "string" ? value.sectionFilter : "",
    breakingOnly: value.breakingOnly === true,
    unreviewedOnly: value.unreviewedOnly === true,
    hideFormatOnly: value.hideFormatOnly === true,
    sortBy: ["document", "risk", "unreviewed"].includes(String(value.sortBy))
      ? (value.sortBy as ReviewerFilters["sortBy"])
      : "document",
  };
}

function normalizedSavedViews(value: unknown): SavedView[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new ProjectCorruptionError();
  const ids = new Set<string>();
  const names = new Set<string>();
  return value.map((item) => {
    if (!isRecord(item)) throw new ProjectCorruptionError();
    const id = typeof item.id === "string" ? item.id : "";
    const name = typeof item.name === "string" ? item.name.trim() : "";
    const normalizedName = name.toLocaleLowerCase();
    if (
      !id ||
      !name ||
      name.length > 40 ||
      ids.has(id) ||
      names.has(normalizedName)
    ) {
      throw new ProjectCorruptionError();
    }
    ids.add(id);
    names.add(normalizedName);
    const createdAt = validTimestamp(item.created_at, "1970-01-01T00:00:00.000Z");
    return {
      id,
      name,
      filters: normalizedFilters(item.filters),
      created_at: createdAt,
      updated_at: validTimestamp(item.updated_at, createdAt),
    };
  });
}

function normalizedLanguage(value: unknown): InterfaceLanguage {
  return value === "zh-CN" ? "zh-CN" : "en";
}

function normalizedDecisions(value: unknown): Decisions {
  if (!isRecord(value)) throw new ProjectCorruptionError();
  return Object.fromEntries(
    Object.entries(value).map(([fingerprint, item]) => {
      if (!isRecord(item)) throw new ProjectCorruptionError();
      return [
        fingerprint,
        {
          state: normalizeState(item.state),
          note: typeof item.note === "string" ? item.note : "",
          updatedAt:
            typeof item.updatedAt === "string"
              ? item.updatedAt
              : typeof item.updated_at === "string"
                ? item.updated_at
                : "",
        },
      ];
    }),
  );
}

function normalizedRecord<T>(value: unknown): Record<string, T> {
  if (!isRecord(value)) throw new ProjectCorruptionError();
  if (Object.values(value).some((item) => !isRecord(item))) {
    throw new ProjectCorruptionError();
  }
  return value as Record<string, T>;
}

function normalizedExportStatus(
  value: unknown,
  revision: number,
  legacyExportedAt?: unknown,
): ProjectExportStatus {
  if (isRecord(value)) {
    const state = value.state === "exported" ? "exported" : "unexported";
    const exportedRevision =
      Number.isInteger(value.exported_revision) &&
      Number(value.exported_revision) >= 0
        ? Number(value.exported_revision)
        : null;
    return {
      state,
      last_exported_at:
        typeof value.last_exported_at === "string"
          ? value.last_exported_at
          : null,
      exported_revision: state === "exported" ? exportedRevision : null,
    };
  }
  if (typeof legacyExportedAt === "string") {
    return {
      state: "exported",
      last_exported_at: legacyExportedAt,
      exported_revision: revision,
    };
  }
  return {
    state: "unexported",
    last_exported_at: null,
    exported_revision: null,
  };
}

function validTimestamp(value: unknown, fallback: string): string {
  if (typeof value === "string" && Number.isFinite(Date.parse(value))) return value;
  return fallback;
}

export function migrateProjectRecord(value: unknown): Project {
  if (!isRecord(value)) throw new ProjectCorruptionError();
  const version = value.schema_version;
  if (
    version !== PROJECT_SCHEMA_VERSION &&
    version !== "governdiff-project/1.0" &&
    version !== "governdiff-project/0.9" &&
    version !== undefined
  ) {
    throw new ProjectCorruptionError();
  }
  if (version === PROJECT_SCHEMA_VERSION) {
    const required = [
      "id",
      "report_identity",
      "report",
      "decisions",
      "field_edits",
      "alignment_overrides",
      "filters",
      "saved_views",
      "interface_language",
      "export_status",
      "revision",
      "created_at",
      "updated_at",
    ];
    if (required.some((key) => !Object.hasOwn(value, key))) {
      throw new ProjectCorruptionError();
    }
    if (
      !Number.isInteger(value.revision) ||
      Number(value.revision) < 1 ||
      typeof value.created_at !== "string" ||
      !Number.isFinite(Date.parse(value.created_at)) ||
      typeof value.updated_at !== "string" ||
      !Number.isFinite(Date.parse(value.updated_at)) ||
      !isRecord(value.export_status) ||
      !isRecord(value.filters) ||
      !Array.isArray(value.saved_views) ||
      !["en", "zh-CN"].includes(String(value.interface_language)) ||
      !["unexported", "exported"].includes(String(value.export_status.state))
    ) {
      throw new ProjectCorruptionError();
    }
    if (
      value.export_status.state === "exported" &&
      (!Number.isInteger(value.export_status.exported_revision) ||
        Number(value.export_status.exported_revision) < 1 ||
        typeof value.export_status.last_exported_at !== "string" ||
        !Number.isFinite(Date.parse(value.export_status.last_exported_at)))
    ) {
      throw new ProjectCorruptionError();
    }
  }

  let report: Report;
  try {
    report = parseReport(value.report);
  } catch {
    throw new ProjectCorruptionError();
  }
  const expectedId = projectIdForReport(report);
  if (version === PROJECT_SCHEMA_VERSION) {
    if (value.id !== expectedId || !isRecord(value.report_identity)) {
      throw new ProjectCorruptionError();
    }
    if (
      value.report_identity.old_sha256 !== report.old_document.sha256 ||
      value.report_identity.new_sha256 !== report.new_document.sha256
    ) {
      throw new ProjectCorruptionError();
    }
  }

  const revision =
    Number.isInteger(value.revision) && Number(value.revision) >= 1
      ? Number(value.revision)
      : 1;
  const fallbackTime = report.generated_at;
  const createdAt = validTimestamp(
    value.created_at ?? value.createdAt,
    fallbackTime,
  );
  const updatedAt = validTimestamp(
    value.updated_at ?? value.updatedAt,
    createdAt,
  );
  const decisions = normalizedDecisions(value.decisions ?? {});
  const fieldEdits = normalizedRecord<FieldEdits[string]>(
    value.field_edits ?? value.fieldEdits ?? {},
  );
  const alignmentOverrides = normalizedRecord<AlignmentOverrides[string]>(
    value.alignment_overrides ?? value.alignmentOverrides ?? {},
  );

  return {
    id: expectedId,
    schema_version: PROJECT_SCHEMA_VERSION,
    report_identity: {
      old_sha256: report.old_document.sha256,
      new_sha256: report.new_document.sha256,
    },
    report,
    decisions,
    field_edits: fieldEdits,
    alignment_overrides: alignmentOverrides,
    filters: normalizedFilters(value.filters),
    saved_views: normalizedSavedViews(value.saved_views),
    interface_language: normalizedLanguage(value.interface_language),
    export_status: normalizedExportStatus(
      value.export_status ?? value.exportStatus,
      revision,
      value.exported_at ?? value.exportedAt,
    ),
    revision,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export function createProject({
  report,
  decisions = {},
  fieldEdits = {},
  alignmentOverrides = {},
  filters = defaultFilters,
  savedViews = [],
  interfaceLanguage = "en",
  exportStatus,
  revision = 1,
  createdAt,
  updatedAt,
}: {
  report: Report;
  decisions?: Decisions;
  fieldEdits?: FieldEdits;
  alignmentOverrides?: AlignmentOverrides;
  filters?: ReviewerFilters;
  savedViews?: SavedView[];
  interfaceLanguage?: InterfaceLanguage;
  exportStatus?: ProjectExportStatus;
  revision?: number;
  createdAt?: string;
  updatedAt?: string;
}): Project {
  const now = updatedAt ?? new Date().toISOString();
  return {
    id: projectIdForReport(report),
    schema_version: PROJECT_SCHEMA_VERSION,
    report_identity: {
      old_sha256: report.old_document.sha256,
      new_sha256: report.new_document.sha256,
    },
    report,
    decisions,
    field_edits: fieldEdits,
    alignment_overrides: alignmentOverrides,
    filters: { ...filters },
    saved_views: normalizedSavedViews(savedViews),
    interface_language: normalizedLanguage(interfaceLanguage),
    export_status: exportStatus ?? {
      state: "unexported",
      last_exported_at: null,
      exported_revision: null,
    },
    revision: Math.max(1, revision),
    created_at: createdAt ?? now,
    updated_at: now,
  };
}

async function quarantineRecord(
  database: IDBDatabase,
  value: unknown,
  id: string,
): Promise<void> {
  const transaction = database.transaction(
    ["projects", "meta", "quarantine"],
    "readwrite",
  );
  const complete = transactionComplete(transaction);
  transaction.objectStore("quarantine").put({
    id: `corrupt:${id}`,
    detected_at: new Date().toISOString(),
    reason_code: "invalid-project-record",
    value,
  });
  transaction.objectStore("projects").delete(id);
  transaction.objectStore("meta").delete(ACTIVE_PROJECT_KEY);
  await complete;
}

function projectRevisionPayload(project: Project): string {
  return JSON.stringify({
    report_identity: project.report_identity,
    decisions: project.decisions,
    field_edits: project.field_edits,
    alignment_overrides: project.alignment_overrides,
    filters: project.filters,
    saved_views: project.saved_views,
    interface_language: project.interface_language,
    export_status: project.export_status,
  });
}

async function setActiveProject(
  database: IDBDatabase,
  project: Project,
  enforceRevision = false,
): Promise<void> {
  const transaction = database.transaction(["projects", "meta"], "readwrite");
  const complete = transactionComplete(transaction);
  const projects = transaction.objectStore("projects");
  if (enforceRevision) {
    const existingValue = await requestResult(projects.get(project.id));
    if (existingValue !== undefined) {
      let existing: Project;
      try {
        existing = migrateProjectRecord(existingValue);
      } catch {
        transaction.abort();
        await complete.catch(() => undefined);
        throw new ProjectCorruptionError();
      }
      const staleRevision = project.revision < existing.revision;
      const divergentSameRevision =
        project.revision === existing.revision &&
        projectRevisionPayload(project) !== projectRevisionPayload(existing);
      if (staleRevision || divergentSameRevision) {
        transaction.abort();
        await complete.catch(() => undefined);
        throw new ProjectStorageError(
          "conflict",
          "This project changed in another tab. The newer saved version was retained; reload it before applying this edit again.",
        );
      }
    }
  }
  projects.put(project);
  transaction.objectStore("meta").put({
    key: ACTIVE_PROJECT_KEY,
    project_id: project.id,
  });
  await complete;
}

export async function saveProject(project: Project): Promise<Project> {
  const normalized = migrateProjectRecord(project);
  try {
    const database = await openProjectDatabase();
    await setActiveProject(database, normalized, true);
    return normalized;
  } catch (error) {
    throw storageError(error);
  }
}

export async function loadProjectForReport(report: Report): Promise<Project | null> {
  const database = await openProjectDatabase();
  const transaction = database.transaction("projects", "readonly");
  const complete = transactionComplete(transaction);
  const value = await requestResult(
    transaction.objectStore("projects").get(projectIdForReport(report)),
  );
  await complete;
  if (value === undefined) return null;
  try {
    return migrateProjectRecord(value);
  } catch {
    await quarantineRecord(database, value, projectIdForReport(report));
    throw new ProjectCorruptionError();
  }
}

export async function loadActiveProject(): Promise<ProjectLoadResult> {
  const database = await openProjectDatabase();
  const transaction = database.transaction(["projects", "meta"], "readonly");
  const complete = transactionComplete(transaction);
  const activeRecord = await requestResult(
    transaction.objectStore("meta").get(ACTIVE_PROJECT_KEY),
  );
  const allProjects = await requestResult(
    transaction.objectStore("projects").getAll(),
  );
  await complete;
  const activeId = isRecord(activeRecord) ? activeRecord.project_id : undefined;
  const ordered = [...allProjects].sort((left, right) => {
    const leftActive = isRecord(left) && left.id === activeId ? 1 : 0;
    const rightActive = isRecord(right) && right.id === activeId ? 1 : 0;
    if (leftActive !== rightActive) return rightActive - leftActive;
    const leftTime = isRecord(left) ? String(left.updated_at ?? "") : "";
    const rightTime = isRecord(right) ? String(right.updated_at ?? "") : "";
    return rightTime.localeCompare(leftTime);
  });

  let corruptionDetected = false;
  for (const value of ordered) {
    const candidateId = isRecord(value) && typeof value.id === "string"
      ? value.id
      : `unknown-${Date.now()}`;
    try {
      const project = migrateProjectRecord(value);
      const currentVersion = isRecord(value)
        ? value.schema_version === PROJECT_SCHEMA_VERSION
        : false;
      if (!currentVersion || activeId !== project.id) {
        await setActiveProject(database, project);
      }
      return { project, corruptionDetected };
    } catch {
      corruptionDetected = true;
      await quarantineRecord(database, value, candidateId);
    }
  }
  return { project: null, corruptionDetected };
}

export async function deleteProjectWithRecovery(
  project: Project,
  deletedAt = new Date().toISOString(),
): Promise<ProjectDeletionRecord> {
  const normalized = migrateProjectRecord(project);
  const record: ProjectDeletionRecord = {
    id: LAST_DELETED_PROJECT_KEY,
    schema_version: "governdiff-project-deletion/1.0",
    project: normalized,
    deleted_at: deletedAt,
    expires_at: new Date(Date.parse(deletedAt) + RECOVERY_TTL_MS).toISOString(),
  };
  try {
    const database = await openProjectDatabase();
    const transaction = database.transaction(
      ["projects", "meta", "trash"],
      "readwrite",
    );
    const complete = transactionComplete(transaction);
    transaction.objectStore("trash").put(record);
    transaction.objectStore("projects").delete(normalized.id);
    transaction.objectStore("meta").delete(ACTIVE_PROJECT_KEY);
    await complete;
    return record;
  } catch (error) {
    throw storageError(error);
  }
}

async function quarantineDeletionRecord(
  database: IDBDatabase,
  value: unknown,
): Promise<void> {
  const transaction = database.transaction(["trash", "quarantine"], "readwrite");
  const complete = transactionComplete(transaction);
  transaction.objectStore("quarantine").put({
    id: `corrupt-deletion:${Date.now()}`,
    detected_at: new Date().toISOString(),
    reason_code: "invalid-deletion-record",
    value,
  });
  transaction.objectStore("trash").delete(LAST_DELETED_PROJECT_KEY);
  await complete;
}

export async function loadDeletionRecord(): Promise<ProjectDeletionRecord | null> {
  const database = await openProjectDatabase();
  const transaction = database.transaction("trash", "readonly");
  const complete = transactionComplete(transaction);
  const value = await requestResult(
    transaction.objectStore("trash").get(LAST_DELETED_PROJECT_KEY),
  );
  await complete;
  if (value === undefined) return null;
  if (!isRecord(value) || value.schema_version !== "governdiff-project-deletion/1.0") {
    await quarantineDeletionRecord(database, value);
    return null;
  }
  if (
    typeof value.expires_at !== "string" ||
    !Number.isFinite(Date.parse(value.expires_at)) ||
    Date.parse(value.expires_at) <= Date.now()
  ) {
    const clearTransaction = database.transaction("trash", "readwrite");
    const complete = transactionComplete(clearTransaction);
    clearTransaction.objectStore("trash").delete(LAST_DELETED_PROJECT_KEY);
    await complete;
    return null;
  }
  try {
    return {
      id: LAST_DELETED_PROJECT_KEY,
      schema_version: "governdiff-project-deletion/1.0",
      project: migrateProjectRecord(value.project),
      deleted_at:
        typeof value.deleted_at === "string" ? value.deleted_at : value.expires_at,
      expires_at: value.expires_at,
    };
  } catch {
    await quarantineDeletionRecord(database, value);
    return null;
  }
}

export async function restoreDeletedProject(): Promise<Project | null> {
  const record = await loadDeletionRecord();
  if (!record) return null;
  try {
    const database = await openProjectDatabase();
    const transaction = database.transaction(
      ["projects", "meta", "trash"],
      "readwrite",
    );
    const complete = transactionComplete(transaction);
    transaction.objectStore("projects").put(record.project);
    transaction.objectStore("meta").put({
      key: ACTIVE_PROJECT_KEY,
      project_id: record.project.id,
    });
    transaction.objectStore("trash").delete(LAST_DELETED_PROJECT_KEY);
    await complete;
    return record.project;
  } catch (error) {
    throw storageError(error);
  }
}

export function reviewStorageKeys(report: Report): ReviewStorageKeys {
  const base = `governdiff-review:${report.old_document.sha256}:${report.new_document.sha256}`;
  return {
    decisions: base,
    fields: `${base}:fields`,
    alignments: `${base}:alignments`,
  };
}

function parseLegacy<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readLegacyStoredReview(report: Report): LegacyReviewState {
  const keys = reviewStorageKeys(report);
  const found = Object.values(keys).some((key) => localStorage.getItem(key) !== null);
  const decisions = parseLegacy<Decisions>(keys.decisions, {});
  return {
    found,
    decisions: Object.fromEntries(
      Object.entries(decisions)
        .filter(([, item]) => isRecord(item))
        .map(([key, item]) => [
          key,
          { ...item, state: normalizeState(item.state) },
        ]),
    ),
    fieldEdits: parseLegacy<FieldEdits>(keys.fields, {}),
    alignmentOverrides: parseLegacy<AlignmentOverrides>(keys.alignments, {}),
  };
}

export function clearLegacyStoredReview(report: Report): void {
  const keys = reviewStorageKeys(report);
  Object.values(keys).forEach((key) => localStorage.removeItem(key));
}

export async function deleteProjectDatabaseForTests(): Promise<void> {
  if (projectDatabasePromise) {
    const database = await projectDatabasePromise.catch(() => null);
    database?.close();
  }
  projectDatabasePromise = null;
  const factory = activeFactory();
  await new Promise<void>((resolve, reject) => {
    const request = factory.deleteDatabase(PROJECT_DATABASE_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Database deletion blocked"));
  });
}
