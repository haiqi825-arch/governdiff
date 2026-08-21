import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteProjectDatabaseForTests,
  loadActiveProject,
  setProjectDatabaseFactoryForTests,
} from "../app/persistence";
import ReviewerWorkspace from "../app/reviewer-workspace";
import sampleReport from "../public/sample-report.json";

describe("Reviewer project recovery workflow", () => {
  beforeEach(() => {
    setProjectDatabaseFactoryForTests(new IDBFactory());
    localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify(sampleReport), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
  });

  afterEach(async () => {
    await deleteProjectDatabaseForTests();
    setProjectDatabaseFactoryForTests(null);
    vi.unstubAllGlobals();
  });

  it("autosaves a decision and recovers it after remount", async () => {
    const first = render(<ReviewerWorkspace />);
    await waitFor(() => expect(screen.getByText("Saved")).toBeVisible(), {
      timeout: 4000,
    });

    const confirm = screen.getByRole("button", { name: /Confirm$/ });
    fireEvent.click(confirm);
    expect(screen.getByText("Not exported")).toBeVisible();
    await waitFor(async () => {
      const project = (await loadActiveProject()).project;
      expect(project?.decisions[sampleReport.changes[0].fingerprint]?.state).toBe(
        "confirmed",
      );
    }, { timeout: 4000 });

    first.unmount();
    render(<ReviewerWorkspace />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Confirm$/ })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }, { timeout: 4000 });
  });

  it("uses server-side draft and export endpoints in a local CLI session", async () => {
    const requests: Array<{ url: string; method: string }> = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      requests.push({ url, method });
      if (url === "/api/review-session" && method === "GET") {
        return new Response(
          JSON.stringify({
            schema_version: "governdiff-review-session/1.0",
            language: "en",
            report: sampleReport,
            review: null,
            workspace: null,
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ accepted: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const view = render(<ReviewerWorkspace />);
    await waitFor(() => expect(screen.getByText("Saved")).toBeVisible(), {
      timeout: 4000,
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirm$/ }));
    await waitFor(
      () =>
        expect(
          requests.some(
            (request) => request.url === "/api/review-session/state" && request.method === "POST",
          ),
        ).toBe(true),
      { timeout: 4000 },
    );
    fireEvent.click(screen.getByRole("button", { name: /Export/ }));
    await waitFor(() =>
      expect(
        requests.some(
          (request) => request.url === "/api/review-session/export" && request.method === "POST",
        ),
      ).toBe(true),
    );
    expect((await loadActiveProject()).project).toBeNull();
    view.unmount();
  });

  it("keeps work unexported when the local session rejects export", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      if (url === "/api/review-session" && method === "GET") {
        return new Response(
          JSON.stringify({
            schema_version: "governdiff-review-session/1.0",
            language: "en",
            report: sampleReport,
            review: null,
            workspace: null,
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }
      if (url === "/api/review-session/export") {
        return new Response(JSON.stringify({ error: "output-locked" }), {
          status: 409,
          headers: { "content-type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ accepted: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ReviewerWorkspace />);
    await waitFor(() => expect(screen.getByText("Saved")).toBeVisible(), {
      timeout: 4000,
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirm$/ }));
    await waitFor(() => expect(screen.getByText("Not exported")).toBeVisible());
    fireEvent.click(screen.getByRole("button", { name: /Export/ }));
    await waitFor(() => {
      expect(
        screen.getByText("The local review session did not accept the export."),
      ).toBeVisible();
    });
    expect(screen.getByText("Not exported")).toBeVisible();
  });

  it("keeps current work when the same old/new report pair is reimported", async () => {
    render(<ReviewerWorkspace />);
    await waitFor(() => expect(screen.getByText("Saved")).toBeVisible(), {
      timeout: 4000,
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirm$/ }));
    const file = {
      text: async () => JSON.stringify(sampleReport),
    } as File;
    fireEvent.change(screen.getByLabelText("Open GovernDiff report JSON"), {
      target: { files: [file] },
    });
    await waitFor(() => {
      expect(
        screen.getAllByText("This old/new report pair is already open; current work was kept."),
      ).toHaveLength(2);
    });
    expect(screen.getByRole("button", { name: /Confirm$/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("requires confirmation, creates a recovery record, and restores deletion", async () => {
    render(<ReviewerWorkspace />);
    await waitFor(() => expect(screen.getByText("Saved")).toBeVisible(), {
      timeout: 4000,
    });

    fireEvent.click(screen.getByText("More operations"));
    fireEvent.click(screen.getByRole("button", { name: "Clear local project" }));
    expect(screen.getByRole("alertdialog")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Delete project" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Restore deleted project" })).toBeVisible();
      expect(screen.getByRole("heading", { name: "Open a GovernDiff project" })).toBeVisible();
    }, { timeout: 4000 });

    fireEvent.click(screen.getByRole("button", { name: "Restore deleted project" }));
    await waitFor(() => {
      expect(screen.getByText("Review queue")).toBeVisible();
      expect(screen.queryByRole("button", { name: "Restore deleted project" })).toBeNull();
    }, { timeout: 4000 });
  });

  it("blocks navigation for unexported work and surfaces review identity mismatch", async () => {
    render(<ReviewerWorkspace />);
    await waitFor(() => expect(screen.getByText("Saved")).toBeVisible(), {
      timeout: 4000,
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirm$/ }));
    await waitFor(() => expect(screen.getByText("Not exported")).toBeVisible());

    const navigation = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(navigation);
    expect(navigation.defaultPrevented).toBe(true);

    const mismatch = {
      schema_version: "governdiff-review/1.1",
      report: {
        old_sha256: sampleReport.old_document.sha256,
        new_sha256: "a".repeat(64),
        generated_at: sampleReport.generated_at,
      },
      exported_at: "2026-08-11T12:00:00Z",
      decisions: [],
      field_edits: [],
      alignment_overrides: [],
    };
    const file = {
      text: async () => JSON.stringify(mismatch),
    } as File;
    fireEvent.change(screen.getByLabelText("Import GovernDiff review JSON"), {
      target: { files: [file] },
    });
    await waitFor(() => {
      expect(screen.getByText("Import does not match this report")).toBeVisible();
    });
  });

  it("decides and advances, persists a saved view, and restores Chinese UI", async () => {
    const first = render(<ReviewerWorkspace />);
    await waitFor(() => expect(screen.getByText("Saved")).toBeVisible(), { timeout: 4000 });
    const firstId = sampleReport.changes[0].fingerprint;
    const secondId = sampleReport.changes[1].fingerprint;
    expect(screen.getByRole("button", { name: new RegExp(firstId) })).toHaveAttribute("aria-current", "true");
    fireEvent.click(screen.getByRole("button", { name: "Confirm and next" }));
    expect(screen.getByRole("button", { name: new RegExp(secondId) })).toHaveAttribute("aria-current", "true");

    fireEvent.click(screen.getByText("Filters & batch"));
    fireEvent.click(screen.getByRole("checkbox", { name: "Breaking only" }));
    fireEvent.change(screen.getByPlaceholderText("e.g. High-confidence Breaking"), { target: { value: "Breaking audit" } });
    fireEvent.click(screen.getByRole("button", { name: "Save current view" }));
    fireEvent.click(screen.getByRole("button", { name: "中文" }));

    await waitFor(async () => {
      const project = (await loadActiveProject()).project;
      expect(project?.saved_views[0].name).toBe("Breaking audit");
      expect(project?.interface_language).toBe("zh-CN");
    }, { timeout: 4000 });

    first.unmount();
    render(<ReviewerWorkspace />);
    await waitFor(() => expect(screen.getByText("审阅队列")).toBeVisible(), { timeout: 4000 });
    expect(document.documentElement.lang).toBe("zh-CN");
    fireEvent.click(screen.getByText("筛选与批量操作"));
    expect(screen.getByRole("option", { name: "Breaking audit" })).toBeInTheDocument();
  });
});
