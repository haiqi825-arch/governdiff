import { IDBFactory, IDBObjectStore } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createProject,
  clearLegacyStoredReview,
  deleteProjectDatabaseForTests,
  deleteProjectWithRecovery,
  loadActiveProject,
  loadDeletionRecord,
  migrateProjectRecord,
  openProjectDatabase,
  projectIdForReport,
  ProjectStorageError,
  readLegacyStoredReview,
  reviewStorageKeys,
  restoreDeletedProject,
  saveProject,
  setProjectDatabaseFactoryForTests,
} from "../app/persistence";
import type { Project, Report } from "../app/reviewer-types";
import sampleReport from "../public/sample-report.json";

const report = sampleReport as Report;

function complete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

describe("IndexedDB project persistence", () => {
  beforeEach(() => {
    setProjectDatabaseFactoryForTests(new IDBFactory());
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await deleteProjectDatabaseForTests();
    setProjectDatabaseFactoryForTests(null);
    localStorage.clear();
  });

  it("stores and reloads one complete Project record", async () => {
    const fingerprint = report.changes[0].fingerprint;
    const project = createProject({
      report,
      decisions: {
        [fingerprint]: {
          state: "confirmed",
          note: "checked",
          updatedAt: "2026-08-11T12:00:00Z",
        },
      },
      filters: {
        query: "deadline",
        confidence: "high",
        changeType: "modified",
        sectionFilter: "",
        breakingOnly: true,
        unreviewedOnly: false,
        hideFormatOnly: true,
        sortBy: "risk",
      },
      revision: 4,
      createdAt: "2026-08-11T11:00:00Z",
      updatedAt: "2026-08-11T12:00:00Z",
    });

    await saveProject(project);
    const loaded = await loadActiveProject();

    expect(loaded.corruptionDetected).toBe(false);
    expect(loaded.project).toMatchObject({
      id: project.id,
      schema_version: "governdiff-project/1.1",
      revision: 4,
      report_identity: project.report_identity,
      filters: project.filters,
    });
    expect(loaded.project?.decisions[fingerprint].state).toBe("confirmed");
  });

  it("deterministically migrates the legacy project shape", () => {
    const migrated = migrateProjectRecord({
      schema_version: "governdiff-project/0.9",
      report,
      decisions: {},
      fieldEdits: {},
      alignmentOverrides: {},
      filters: { confidence: "not-a-level", breakingOnly: true },
      revision: 2,
      createdAt: "2026-08-11T10:00:00Z",
      updatedAt: "2026-08-11T11:00:00Z",
      exportedAt: "2026-08-11T10:30:00Z",
    });

    expect(migrated.schema_version).toBe("governdiff-project/1.1");
    expect(migrated.filters.confidence).toBe("all");
    expect(migrated.filters.breakingOnly).toBe(true);
    expect(migrated.filters.sortBy).toBe("document");
    expect(migrated.saved_views).toEqual([]);
    expect(migrated.interface_language).toBe("en");
    expect(migrated.export_status).toEqual({
      state: "exported",
      last_exported_at: "2026-08-11T10:30:00Z",
      exported_revision: 2,
    });
  });

  it("migrates project/1.0 to 1.1 and restores saved views and language", () => {
    const base = createProject({ report, revision: 2 });
    const legacy = {
      ...base,
      schema_version: "governdiff-project/1.0",
    } as Record<string, unknown>;
    delete legacy.saved_views;
    delete legacy.interface_language;
    const migrated = migrateProjectRecord(legacy);
    expect(migrated.schema_version).toBe("governdiff-project/1.1");
    expect(migrated.saved_views).toEqual([]);
    expect(migrated.interface_language).toBe("en");

    const now = "2026-08-12T04:00:00Z";
    const current = migrateProjectRecord({
      ...base,
      saved_views: [{
        id: "high-breaking",
        name: "High-confidence Breaking",
        filters: { ...base.filters, confidence: "high", breakingOnly: true, sortBy: "risk" },
        created_at: now,
        updated_at: now,
      }],
      interface_language: "zh-CN",
    });
    expect(current.saved_views[0].filters.sortBy).toBe("risk");
    expect(current.interface_language).toBe("zh-CN");
  });

  it("reads and clears the Phase 7.1 localStorage records for one-time migration", () => {
    const keys = reviewStorageKeys(report);
    localStorage.setItem(
      keys.decisions,
      JSON.stringify({
        [report.changes[0].fingerprint]: {
          state: "accepted",
          note: "legacy",
          updatedAt: "2026-08-11T10:00:00Z",
        },
      }),
    );
    localStorage.setItem(keys.fields, JSON.stringify({}));

    const legacy = readLegacyStoredReview(report);
    expect(legacy.found).toBe(true);
    expect(legacy.decisions[report.changes[0].fingerprint].state).toBe("confirmed");

    clearLegacyStoredReview(report);
    expect(Object.values(keys).every((key) => localStorage.getItem(key) === null)).toBe(true);
  });

  it("moves one complete deletion record to recovery and restores it", async () => {
    const project = createProject({ report, revision: 3 });
    await saveProject(project);

    await deleteProjectWithRecovery(project);
    expect((await loadActiveProject()).project).toBeNull();
    expect((await loadDeletionRecord())?.project.id).toBe(project.id);

    const restored = await restoreDeletedProject();
    expect(restored?.id).toBe(project.id);
    expect((await loadActiveProject()).project?.revision).toBe(3);
    expect(await loadDeletionRecord()).toBeNull();
  });

  it("isolates a corrupt active record instead of partially loading it", async () => {
    const database = await openProjectDatabase();
    const transaction = database.transaction(["projects", "meta"], "readwrite");
    const done = complete(transaction);
    transaction.objectStore("projects").put({
      id: "corrupt-project",
      schema_version: "governdiff-project/1.0",
      report: { schema_version: "1.5" },
    });
    transaction.objectStore("meta").put({
      key: "active-project",
      project_id: "corrupt-project",
    });
    await done;

    const loaded = await loadActiveProject();
    expect(loaded).toEqual({ project: null, corruptionDetected: true });

    const quarantineTransaction = database.transaction("quarantine", "readonly");
    const quarantineDone = complete(quarantineTransaction);
    const countRequest = quarantineTransaction.objectStore("quarantine").count();
    const count = await new Promise<number>((resolve, reject) => {
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = () => reject(countRequest.error);
    });
    await quarantineDone;
    expect(count).toBe(1);
  });

  it("retains the last valid project when a quota failure aborts a save", async () => {
    const original = createProject({
      report,
      revision: 1,
      updatedAt: "2026-08-11T10:00:00Z",
    });
    await saveProject(original);
    const changed: Project = {
      ...original,
      revision: 2,
      updated_at: "2026-08-11T11:00:00Z",
      decisions: {
        [report.changes[0].fingerprint]: {
          state: "confirmed",
          note: "private policy text must never enter this error",
          updatedAt: "2026-08-11T11:00:00Z",
        },
      },
    };
    const put = IDBObjectStore.prototype.put;
    vi.spyOn(IDBObjectStore.prototype, "put").mockImplementation(function (
      this: IDBObjectStore,
      value: unknown,
      key?: IDBValidKey,
    ) {
      if (
        this.name === "projects" &&
        typeof value === "object" &&
        value !== null &&
        "revision" in value &&
        value.revision === 2
      ) {
        throw new DOMException("quota", "QuotaExceededError");
      }
      return key === undefined ? put.call(this, value) : put.call(this, value, key);
    });

    let failure: unknown;
    try {
      await saveProject(changed);
    } catch (error) {
      failure = error;
    }
    expect(failure).toBeInstanceOf(ProjectStorageError);
    expect((failure as ProjectStorageError).code).toBe("quota");
    expect((failure as Error).message).not.toMatch(
      /private policy text|grants-policy|Documents|\\|\//i,
    );
    vi.restoreAllMocks();

    const loaded = await loadActiveProject();
    expect(loaded.project?.revision).toBe(1);
    expect(loaded.project?.decisions).toEqual({});
  });

  it("rejects divergent same-revision writes from two tabs without silent overwrite", async () => {
    const base = createProject({
      report,
      revision: 1,
      updatedAt: "2026-08-11T10:00:00Z",
    });
    await saveProject(base);
    const fingerprint = report.changes[0].fingerprint;
    const tabA = createProject({
      report,
      decisions: {
        [fingerprint]: {
          state: "confirmed",
          note: "tab A",
          updatedAt: "2026-08-11T10:01:00Z",
        },
      },
      revision: 2,
      createdAt: base.created_at,
      updatedAt: "2026-08-11T10:01:00Z",
    });
    const tabB = createProject({
      report,
      decisions: {
        [fingerprint]: {
          state: "rejected",
          note: "tab B",
          updatedAt: "2026-08-11T10:01:01Z",
        },
      },
      revision: 2,
      createdAt: base.created_at,
      updatedAt: "2026-08-11T10:01:01Z",
    });

    const results = await Promise.allSettled([saveProject(tabA), saveProject(tabB)]);
    expect(results.filter((item) => item.status === "fulfilled")).toHaveLength(1);
    const rejected = results.find((item) => item.status === "rejected");
    expect(rejected).toMatchObject({
      status: "rejected",
      reason: expect.objectContaining({ code: "conflict" }),
    });
    const loaded = await loadActiveProject();
    expect(loaded.project?.revision).toBe(2);
    expect(["tab A", "tab B"]).toContain(
      loaded.project?.decisions[fingerprint].note,
    );
  });

  it("rejects an older revision and retains the newer valid project", async () => {
    const newer = createProject({
      report,
      revision: 3,
      updatedAt: "2026-08-11T10:03:00Z",
    });
    await saveProject(newer);
    const stale = createProject({
      report,
      revision: 2,
      createdAt: newer.created_at,
      updatedAt: "2026-08-11T10:04:00Z",
    });
    await expect(saveProject(stale)).rejects.toMatchObject({ code: "conflict" });
    expect((await loadActiveProject()).project?.revision).toBe(3);
  });

  it("accepts an idempotent retry of the same revision payload", async () => {
    const project = createProject({
      report,
      revision: 2,
      updatedAt: "2026-08-11T10:02:00Z",
    });
    await saveProject(project);
    await expect(saveProject({
      ...project,
      updated_at: "2026-08-11T10:03:00Z",
    })).resolves.toMatchObject({ revision: 2 });
  });

  it("isolates a corrupt recovery record and never restores partial state", async () => {
    vi.spyOn(Date, "now").mockReturnValue(Date.parse("2026-08-12T10:00:00Z"));
    const database = await openProjectDatabase();
    const transaction = database.transaction("trash", "readwrite");
    const done = complete(transaction);
    transaction.objectStore("trash").put({
      id: "last-deleted-project",
      schema_version: "governdiff-project-deletion/1.0",
      project: { schema_version: "governdiff-project/1.1", report: {} },
      deleted_at: "2026-08-11T10:00:00Z",
      expires_at: "2026-08-18T10:00:00Z",
    });
    await done;
    expect(await loadDeletionRecord()).toBeNull();
    const quarantine = database.transaction("quarantine", "readonly");
    const quarantineDone = complete(quarantine);
    const count = await requestResultForTest(
      quarantine.objectStore("quarantine").count(),
    );
    await quarantineDone;
    expect(count).toBe(1);
  });

  it("reports an unavailable IndexedDB context without claiming a save", async () => {
    const unavailableFactory = {
      open() {
        throw new DOMException("disabled", "SecurityError");
      },
    } as unknown as IDBFactory;
    setProjectDatabaseFactoryForTests(unavailableFactory);
    await expect(saveProject(createProject({ report }))).rejects.toMatchObject({
      code: "unavailable",
      message: expect.stringMatching(/storage is unavailable/i),
    });
    setProjectDatabaseFactoryForTests(new IDBFactory());
  });

  it("keeps a valid recovery record when the system clock moves backwards", async () => {
    const project = createProject({ report, revision: 2 });
    await deleteProjectWithRecovery(project, "2026-08-11T10:00:00Z");
    vi.spyOn(Date, "now").mockReturnValue(Date.parse("2026-08-10T10:00:00Z"));
    expect(await loadDeletionRecord()).toMatchObject({
      project: expect.objectContaining({ id: project.id }),
      expires_at: "2026-08-18T10:00:00.000Z",
    });
  });

  it("uses ordered document hashes for stable reimport and swapped identity", () => {
    const sameReport = structuredClone(report);
    const swapped = structuredClone(report);
    [swapped.old_document, swapped.new_document] = [
      swapped.new_document,
      swapped.old_document,
    ];
    expect(projectIdForReport(sameReport)).toBe(projectIdForReport(report));
    expect(projectIdForReport(swapped)).not.toBe(projectIdForReport(report));
  });

  it("expires seven-day recovery records by absolute timestamp across timezone changes", async () => {
    const project = createProject({ report, revision: 2 });
    await deleteProjectWithRecovery(project, "2026-03-01T01:30:00-08:00");
    vi.spyOn(Date, "now").mockReturnValue(Date.parse("2026-03-08T09:30:00Z"));
    expect(await loadDeletionRecord()).toBeNull();
    expect(await restoreDeletedProject()).toBeNull();
  });

  it("handles thousands of field edits as one complete atomic project", async () => {
    const fieldEdits = Object.fromEntries(
      Array.from({ length: 3_000 }, (_, index) => [
        `finding-${index}`,
        {
          change_fingerprint: `change-${index}`,
          finding_fingerprint: `finding-${index}`,
          field: "scope",
          machine_old_value: "old",
          machine_new_value: `new-${index}`,
          reviewed_old_value: "old",
          reviewed_new_value: `new-${index}`,
          updated_at: "2026-08-11T10:00:00Z",
        },
      ]),
    );
    const project = createProject({ report, fieldEdits, revision: 2 });
    await saveProject(project);
    expect(Object.keys((await loadActiveProject()).project?.field_edits ?? {})).toHaveLength(3_000);
  });
});

function requestResultForTest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
