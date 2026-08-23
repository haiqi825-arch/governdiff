import assert from "node:assert/strict";
import { createServer } from "node:http";
import { cpus, freemem, platform, release, totalmem } from "node:os";
import { open, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import axe from "axe-core";
import { chromium } from "playwright";

import worker from "../dist/server/index.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtureDirectory = resolve(root, "tests", "browser-fixtures");
const report = JSON.parse(await readFile(resolve(fixtureDirectory, "report-5000.json"), "utf8"));
const mismatchReview = JSON.parse(
  await readFile(resolve(fixtureDirectory, "review-mismatch.json"), "utf8"),
);
const sampleReport = JSON.parse(await readFile(resolve(root, "public", "sample-report.json"), "utf8"));
const axeSource = axe.source;
const assetRoot = resolve(root, "dist", "client");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
const chromePath = process.env.GOVERNDIFF_CHROME_PATH
  || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const strict = process.argv.includes("--strict");
const outputIndex = process.argv.indexOf("--output");
const output = outputIndex >= 0
  ? resolve(process.cwd(), process.argv[outputIndex + 1])
  : resolve(root, "..", "benchmark", "PHASE_7_6_BROWSER.json");
const thresholdMs = 200;
const firstRenderBudgetMs = 5000;

function percentile(values, percentage) {
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.min(ordered.length - 1, Math.ceil(ordered.length * percentage) - 1)];
}

function metric(samples, extra = {}) {
  return {
    samples_ms: samples.map((value) => Number(value.toFixed(3))),
    p95_ms: Number(percentile(samples, 0.95).toFixed(3)),
    maximum_ms: Number(Math.max(...samples).toFixed(3)),
    ...extra,
  };
}

async function nextPaint(page, operation) {
  const started = await page.evaluate(() => performance.now());
  await operation();
  await page.evaluate(() => new Promise((resolvePaint) => {
    requestAnimationFrame(() => requestAnimationFrame(resolvePaint));
  }));
  const ended = await page.evaluate(() => {
    document.body.getBoundingClientRect();
    return performance.now();
  });
  return ended - started;
}

async function waitFor(predicate, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 25));
  }
  throw new Error("Timed out waiting for the local review session to settle.");
}

async function waitForQueueCount(page, expected) {
  await page.waitForFunction(
    (count) => Number(document.querySelector(".change-list")?.getAttribute("data-total-count")) === count,
    expected,
  );
}

function reportIdentity(value) {
  return `${value.old_document.sha256}:${value.new_document.sha256}`;
}

const session = {
  report,
  review: null,
  workspace: null,
  exportedReview: null,
};

async function assetResponse(request) {
  const url = new URL(request.url);
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!relative) return new Response("Not found", { status: 404 });
  const target = normalize(join(assetRoot, relative));
  if (!target.startsWith(assetRoot)) return new Response("Not found", { status: 404 });
  try {
    const handle = await open(target, "r");
    try {
      if (!(await handle.stat()).isFile()) return new Response("Not found", { status: 404 });
      return new Response(await handle.readFile(), {
        headers: { "content-type": contentTypes[extname(target)] ?? "application/octet-stream" },
      });
    } finally {
      await handle.close();
    }
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

const server = createServer(async (incoming, outgoing) => {
  const port = server.address().port;
  const origin = `http://127.0.0.1:${port}`;
  const url = new URL(incoming.url || "/", origin);
  const standalone = String(incoming.headers.referer ?? "").includes("standalone=1");
  if (standalone && url.pathname.startsWith("/api/review-session")) {
    outgoing.writeHead(204, { "cache-control": "no-store" });
    outgoing.end();
    return;
  }
  if (url.pathname === "/api/review-session" && incoming.method === "GET") {
    const body = JSON.stringify({
      schema_version: "governdiff-review-session/1.0",
      language: "en",
      ...session,
    });
    outgoing.writeHead(200, {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    });
    outgoing.end(body);
    return;
  }
  if (url.pathname === "/api/review-session/heartbeat") {
    outgoing.writeHead(200, { "content-type": "application/json" });
    outgoing.end('{"accepted":true}');
    return;
  }
  if (url.pathname === "/api/review-session/state" && incoming.method === "POST") {
    let body = "";
    for await (const chunk of incoming) body += chunk;
    const value = JSON.parse(body);
    session.review = value.review;
    session.workspace = value.workspace;
    outgoing.writeHead(200, { "content-type": "application/json" });
    outgoing.end('{"accepted":true}');
    return;
  }
  if (url.pathname === "/api/review-session/export" && incoming.method === "POST") {
    let body = "";
    for await (const chunk of incoming) body += chunk;
    session.exportedReview = JSON.parse(body);
    outgoing.writeHead(200, { "content-type": "application/json" });
    outgoing.end('{"accepted":true}');
    return;
  }
  const request = new Request(new URL(url.pathname + url.search, origin), {
    method: incoming.method,
    headers: incoming.headers,
  });
  let response = await assetResponse(request);
  if (response.status === 404) {
    response = await worker.fetch(
      request,
      { ASSETS: { fetch: assetResponse } },
      { waitUntil() {}, passThroughOnException() {} },
    );
  }
  outgoing.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  outgoing.end(Buffer.from(await response.arrayBuffer()));
});

await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
const port = server.address().port;
const origin = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--disable-background-networking", "--disable-default-apps", "--no-first-run"],
});

const browserVersion = await browser.version();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

const performanceEvidence = {};
const acceptance = {};
let accessibility = {};
try {
  const coldStarted = performance.now();
  const navigation = await page.goto(origin, { waitUntil: "domcontentloaded" });
  assert.ok(navigation && navigation.status() < 400, `navigation returned ${navigation?.status()}`);
  try {
    await page.getByText("Review queue", { exact: true }).waitFor({ timeout: 30_000 });
  } catch (error) {
    process.stderr.write(`browser gate startup body:\n${(await page.locator("body").innerText()).slice(0, 4000)}\n`);
    process.stderr.write(`browser gate console errors:\n${consoleErrors.join("\n")}\n`);
    throw error;
  }
  await page.locator('.change-list[data-total-count="5000"]').waitFor({ timeout: 30_000 });
  await page.evaluate(() => new Promise((resolvePaint) => requestAnimationFrame(() => requestAnimationFrame(resolvePaint))));
  const coldRender = performance.now() - coldStarted;
  const renderedCount = Number(await page.locator(".change-list").getAttribute("data-rendered-count"));
  const domNodes = await page.locator("*").count();
  assert.equal(Number(await page.locator(".change-list").getAttribute("data-total-count")), 5000);
  assert.ok(renderedCount < 50, `windowed queue rendered ${renderedCount} cards`);
  assert.ok(domNodes < 2000, `initial DOM contains ${domNodes} nodes`);
  performanceEvidence.first_render = metric([coldRender], {
    state: "cold",
    rendered_change_cards: renderedCount,
    dom_nodes: domNodes,
  });
  acceptance.initial_5000_render = coldRender < firstRenderBudgetMs && renderedCount < 50 && domNodes < 2000;

  const search = page.getByRole("textbox", { name: "Search changes" });
  const searchSamples = [];
  for (let index = 0; index < 25; index += 1) {
    const value = index % 2 ? `benchmark-${index * 101}` : "benchmark-7";
    const expected = report.changes.filter((change) => change.section.includes(value)).length;
    searchSamples.push(await nextPaint(page, async () => {
      await search.fill(value);
      await waitForQueueCount(page, expected);
    }));
  }
  await search.fill("");
  await waitForQueueCount(page, 5000);
  performanceEvidence.search_to_stable_results = metric(searchSamples, { state: "warm" });
  acceptance.search_to_stable_results = performanceEvidence.search_to_stable_results.p95_ms < thresholdMs;

  const filterSamples = [];
  await page.getByText("Filters & batch", { exact: true }).click();
  const breaking = page.getByText("Breaking only", { exact: true }).locator("input");
  const breakingCount = report.changes.filter((change) =>
    change.findings.some((finding) => finding.breaking && !finding.waived),
  ).length;
  for (let index = 0; index < 25; index += 1) {
    const checked = index % 2 === 0;
    filterSamples.push(await nextPaint(page, async () => {
      await breaking.setChecked(checked);
      await waitForQueueCount(page, checked ? breakingCount : 5000);
    }));
  }
  await breaking.uncheck();
  await waitForQueueCount(page, 5000);
  performanceEvidence.filter_toggle = metric(filterSamples, { state: "warm" });
  acceptance.filter_toggle = performanceEvidence.filter_toggle.p95_ms < thresholdMs;

  const switchSamples = [];
  for (let index = 1; index <= 25; index += 1) {
    switchSamples.push(await nextPaint(page, async () => {
      await page.locator(".change-card").nth(index % renderedCount).click();
      await page.locator(".change-card[aria-current=true]").waitFor();
    }));
  }
  performanceEvidence.change_card_switch = metric(switchSamples, { state: "warm" });
  acceptance.change_card_switch = performanceEvidence.change_card_switch.p95_ms < thresholdMs;

  await page.locator(".change-card").first().click();
  const decisionSamples = [];
  const confirmAndNext = page.getByRole("button", { name: "Confirm and next" });
  for (let index = 0; index < 100; index += 1) {
    decisionSamples.push(await nextPaint(page, async () => {
      await confirmAndNext.click();
      await page.locator("#change-review").waitFor();
    }));
  }
  performanceEvidence.decide_and_next_100 = metric(decisionSamples, { state: "warm" });
  await waitFor(() => (session.review?.decisions?.length ?? 0) >= 100);
  acceptance.continuous_decisions =
    (session.review?.decisions?.filter((decision) => decision.state === "confirmed").length ?? 0) === 100
    && performanceEvidence.decide_and_next_100.p95_ms < thresholdMs;

  await page.getByRole("button", { name: /Undo review decision/ }).click();
  await waitFor(() => (session.review?.decisions?.length ?? 0) === 99);
  acceptance.undo = (session.review?.decisions?.length ?? 0) === 99;
  await confirmAndNext.click();
  await waitFor(() => (session.review?.decisions?.length ?? 0) === 100);

  const scrollSamples = [];
  const changeList = page.locator(".change-list");
  const scrollMax = await changeList.evaluate((element) => element.scrollHeight - element.clientHeight);
  for (let index = 0; index < 25; index += 1) {
    const position = Math.round((scrollMax * ((index * 7) % 25)) / 24);
    scrollSamples.push(await nextPaint(page, async () => {
      await changeList.evaluate((element, scrollTop) => { element.scrollTop = scrollTop; }, position);
    }));
  }
  performanceEvidence.long_list_scroll = metric(scrollSamples, {
    state: "warm",
    scroll_height: await changeList.evaluate((element) => element.scrollHeight),
  });
  acceptance.long_list_scroll = performanceEvidence.long_list_scroll.p95_ms < thresholdMs;

  await search.fill("benchmark-17");
  await waitForQueueCount(page, report.changes.filter((change) => change.section.includes("benchmark-17")).length);
  await page.locator(".change-card").first().click();
  acceptance.split_blocks =
    await page.locator(".evidence-after .evidence-side-heading strong").textContent() === "3 block(s)";
  await search.fill("benchmark-18");
  await waitForQueueCount(page, report.changes.filter((change) => change.section.includes("benchmark-18")).length);
  await page.locator(".change-card").first().click();
  acceptance.merge_blocks =
    await page.locator(".evidence-before .evidence-side-heading strong").textContent() === "3 block(s)";
  await page.getByRole("button", { name: "Edit alignment" }).click();
  const alignmentPreview = page.getByRole("button", { name: "Review relink preview" });
  await alignmentPreview.click();
  acceptance.alignment_preview = await page.getByRole("region", {
    name: "Review relink preview",
  }).isVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await search.fill("benchmark-0");
  await waitForQueueCount(page, 1);
  await waitFor(() => session.workspace?.filters?.query === "benchmark-0");

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('.change-list[data-total-count="1"]').waitFor({ timeout: 30_000 });
  acceptance.project_refresh_recovery =
    (session.review?.decisions?.length ?? 0) === 100
    && await search.inputValue() === "benchmark-0";
  await search.fill("");
  await waitForQueueCount(page, 5000);

  await page.getByRole("button", { name: "Export", exact: true }).click();
  await waitFor(() => session.exportedReview?.schema_version === "governdiff-review/1.1");
  acceptance.local_session_export =
    session.exportedReview?.decisions?.length === 100
    && session.exportedReview?.report?.old_sha256 === report.old_document.sha256
    && session.exportedReview?.report?.new_sha256 === report.new_document.sha256;

  await page.setInputFiles('input[aria-label="Import GovernDiff review JSON"]', {
    name: "review-mismatch.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(mismatchReview)),
  });
  const identityMismatch = page.getByText("Import does not match this report", { exact: true });
  await identityMismatch.waitFor({ state: "visible", timeout: 10_000 }).catch(() => undefined);
  acceptance.review_identity_mismatch = await identityMismatch.isVisible();

  const malformed = { ...sampleReport };
  delete malformed.schema_version;
  const validationContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const validationPage = await validationContext.newPage();
  validationPage.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  validationPage.on("pageerror", (error) => consoleErrors.push(error.message));
  await validationPage.goto(`${origin}/?standalone=1`, { waitUntil: "domcontentloaded" });
  await validationPage.getByText("Review queue", { exact: true }).waitFor({ timeout: 30_000 });
  await validationPage.waitForFunction(() => {
    const input = document.querySelector('input[aria-label="Open GovernDiff report JSON"]');
    return input instanceof HTMLInputElement && Object.keys(input).some((key) => key.startsWith("__reactProps"));
  });
  await validationPage.setInputFiles('input[aria-label="Open GovernDiff report JSON"]', {
    name: "malformed-report.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(malformed)),
  });
  const validationError = validationPage.locator(".error-banner");
  await validationError.waitFor({ state: "visible", timeout: 30_000 }).catch(() => undefined);
  acceptance.report_schema_error = await validationError.count() === 1
    && await validationError.evaluate(
      (element) => element.textContent?.includes("Report 1.5 validation failed") === true,
    );
  if (!acceptance.report_schema_error) {
    process.stderr.write(`schema validation page body:\n${(await validationPage.locator("body").innerText()).slice(0, 2000)}\n`);
    process.stderr.write(`schema validation console errors:\n${consoleErrors.join("\n")}\n`);
  }
  await validationContext.close();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("tab", { name: "Queue" }).click();
  acceptance.narrow_open_report = await page.locator('.file-control input[aria-label="Open GovernDiff report JSON"]').evaluate((input) => {
    const label = input.closest("label");
    return Boolean(label && label.getBoundingClientRect().width > 0 && label.getBoundingClientRect().height > 0);
  });
  acceptance.narrow_filters = await page.getByText("Filters & batch", { exact: true }).isVisible();
  await page.getByRole("tab", { name: "Evidence" }).click();
  acceptance.narrow_evidence = await page.locator("#mobile-panel-evidence").isVisible();
  acceptance.narrow_evidence_text_layout = await page.locator(".evidence-block-copy").first().evaluate(
    (element) => {
      const style = getComputedStyle(element);
      return (
        Number.parseFloat(style.fontSize) >= 14
        && Number.parseFloat(style.lineHeight) >= 24
        && element.scrollWidth <= element.clientWidth
        && document.documentElement.scrollWidth <= document.documentElement.clientWidth
      );
    },
  );
  await page.getByRole("tab", { name: "Decision" }).click();
  acceptance.narrow_decision = await page.locator("#mobile-panel-decision").isVisible();

  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole("tab", { name: "Evidence" }).click();
  acceptance.reflow_320 = await page.evaluate(() => (
    document.documentElement.scrollWidth <= document.documentElement.clientWidth
    && document.body.scrollWidth <= document.body.clientWidth
  ));
  acceptance.touch_targets = await page.locator(
    ".mobile-tabs button, .decision-stack > button, .command-actions > button, .command-actions > label",
  ).evaluateAll((elements) => elements.filter((element) => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  }).every((element) => {
    const box = element.getBoundingClientRect();
    return box.width >= 24 && box.height >= 24;
  }));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => new Promise((resolvePaint) => requestAnimationFrame(resolvePaint)));
  const evidenceText = page.locator(".evidence-block-copy").first();
  acceptance.desktop_evidence_text_layout = await evidenceText.evaluate((element) => {
    const style = getComputedStyle(element);
    return (
      Number.parseFloat(style.fontSize) >= 14.5
      && Number.parseFloat(style.lineHeight) >= 25
      && element.scrollWidth <= element.clientWidth
    );
  });
  await page.emulateMedia({ forcedColors: "active" });
  acceptance.forced_colors = await page.locator(".summary-metric").first().evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).borderWidth) >= 2,
  );
  await page.emulateMedia({ forcedColors: "none", reducedMotion: "reduce" });
  acceptance.reduced_motion = await page.locator("body *").evaluateAll((elements) =>
    elements.every((element) => {
      const style = getComputedStyle(element);
      const durations = `${style.animationDuration},${style.transitionDuration}`
        .split(",")
        .map((value) => Number.parseFloat(value) || 0);
      return durations.every((duration) => duration === 0);
    }),
  );
  await page.emulateMedia({ forcedColors: "none", reducedMotion: "no-preference" });
  acceptance.page_language = await page.evaluate(() => document.documentElement.lang === "en");
  acceptance.status_not_color_only = await page.locator(".project-status").evaluate(
    (element) => /Saved|Unsaved|Exported|Not exported/.test(element.textContent || ""),
  );
  const longReport = structuredClone(sampleReport);
  const longText = Array.from(
    { length: 18 },
    (_, index) => `Policy evidence sentence ${index + 1} remains readable when it wraps across several lines.`,
  ).join(" ");
  longReport.changes[0].old_block.text = longText;
  longReport.changes[0].new_block.text = `${longText} Updated.`;
  longReport.changes[0].old_blocks = [longReport.changes[0].old_block];
  longReport.changes[0].new_blocks = [longReport.changes[0].new_block];
  const previousSession = {
    report: session.report,
    review: session.review,
    workspace: session.workspace,
  };
  session.report = longReport;
  session.review = null;
  session.workspace = null;
  const longContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  try {
    const longPage = await longContext.newPage();
    await longPage.goto(origin, { waitUntil: "domcontentloaded" });
    const longEvidence = longPage.locator(".evidence-block-copy").first();
    await longEvidence.waitFor({ state: "visible", timeout: 30_000 });
    acceptance.long_evidence_collapses = (
      await longEvidence.getAttribute("class")
    )?.includes("is-collapsed") === true
      && await longEvidence.evaluate((element) => {
        const child = element.firstElementChild;
        if (!(child instanceof HTMLElement)) return false;
        const lineHeight = Number.parseFloat(getComputedStyle(child).lineHeight);
        return (
          child.getBoundingClientRect().height > 0
          && child.getBoundingClientRect().height <= lineHeight * 8.5
          && element.scrollWidth <= element.clientWidth
        );
      })
      && await longEvidence.getByRole("button", { name: "Show full text" }).isVisible();
  } finally {
    await longContext.close();
    session.report = previousSession.report;
    session.review = previousSession.review;
    session.workspace = previousSession.workspace;
  }
  await page.getByRole("tab", { name: "Queue" }).click().catch(() => undefined);
  await page.locator("body").press("j");
  await page.locator("body").press("1");
  acceptance.keyboard_shortcuts = await page.locator(".decision-stack > button").first().getAttribute("aria-pressed") === "true";
  const focusBeforeAdvance = await page.locator(".change-card[aria-current=true]").getAttribute("aria-label");
  await confirmAndNext.click();
  await page.waitForFunction(
    (label) => document.querySelector('.change-card[aria-current="true"]')?.getAttribute("aria-label") !== label,
    focusBeforeAdvance,
  );
  await page.waitForFunction(() => document.activeElement?.id === "change-review");
  acceptance.decide_next_focus =
    await page.evaluate(() => document.activeElement?.id === "change-review")
    && await page.locator(".change-card[aria-current=true]").getAttribute("aria-label") !== focusBeforeAdvance;

  await page.getByText("Filters & batch", { exact: true }).click();
  await page.getByRole("button", { name: "Select all visible" }).click();
  const dialogTrigger = page.getByRole("button", { name: "Confirm selected" });
  await dialogTrigger.click();
  const dialog = page.getByRole("alertdialog");
  const dialogCancel = dialog.getByRole("button", { name: "Cancel" });
  const dialogConfirm = dialog.getByRole("button", { name: "Confirm selected" });
  acceptance.dialog_initial_focus = await dialogCancel.evaluate(
    (element) => document.activeElement === element,
  );
  await dialogCancel.press("Shift+Tab");
  acceptance.dialog_focus_trap = await dialogConfirm.evaluate(
    (element) => document.activeElement === element,
  );
  await dialogConfirm.press("Tab");
  acceptance.dialog_focus_wrap = await dialogCancel.evaluate(
    (element) => document.activeElement === element,
  );
  await dialogCancel.click();
  acceptance.dialog_focus_restore = await dialogTrigger.evaluate(
    (element) => document.activeElement === element,
  );

  const skip = page.getByText("Skip to evidence review", { exact: true });
  await skip.evaluate((element) => element.focus());
  await skip.press("Enter");
  acceptance.skip_link_focus = await page.evaluate(() => document.activeElement?.id === "change-review");
  acceptance.screen_reader_names =
    (await page.getByRole("region", { name: "Local project status" }).count()) === 1
    && (await page.getByRole("list", { name: /Review queue with 5000 changes/ }).count()) === 1
    && (await page.getByRole("button", { name: /Open change \d+ of 5000:/ }).count()) > 0;

  await page.addScriptTag({ content: axeSource });
  const axeResult = await page.evaluate(async () => window.axe.run(document, {
    resultTypes: ["violations"],
  }));
  const serious = axeResult.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact),
  );
  accessibility = {
    engine: `axe-core/${axe.version}`,
    violations: axeResult.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length,
      help: violation.help,
      targets: violation.nodes.map((node) => ({
        target: node.target,
        html: node.html,
        failure_summary: node.failureSummary,
      })),
    })),
    serious_or_critical: serious.length,
    passed: serious.length === 0,
  };
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}

const interactionMetricNames = [
  "search_to_stable_results",
  "filter_toggle",
  "change_card_switch",
  "decide_and_next_100",
  "long_list_scroll",
];
const interactionsPassed = interactionMetricNames.every(
  (name) => performanceEvidence[name]?.p95_ms < thresholdMs,
);
const result = {
  schema_version: "governdiff-browser-acceptance/1.0",
  generated_at: new Date().toISOString(),
  threshold_ms: thresholdMs,
  first_render_budget_ms: firstRenderBudgetMs,
  workload: {
    changes: 5000,
    consecutive_decisions: 100,
    interaction_samples: 25,
    report_identity: reportIdentity(report),
  },
  environment: {
    browser: browserVersion,
    engine: "Chromium",
    node: process.version,
    platform: platform(),
    release: release(),
    cpu_model: cpus()[0]?.model,
    logical_cpus: cpus().length,
    total_memory_bytes: totalmem(),
    free_memory_bytes_at_finish: freemem(),
    viewport_desktop: "1440x1000",
    viewport_mobile: "390x844",
    headless: true,
  },
  performance: performanceEvidence,
  acceptance,
  accessibility,
  console_errors: consoleErrors,
  passed:
    interactionsPassed
    && Object.values(acceptance).every(Boolean)
    && accessibility.passed
    && consoleErrors.length === 0,
};

await writeFile(output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (strict && !result.passed) process.exitCode = 1;
