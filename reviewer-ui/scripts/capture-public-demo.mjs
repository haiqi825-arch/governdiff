import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import worker from "../dist/server/index.js";

const root = resolve(fileURLToPath(new URL("../dist/client/", import.meta.url)));
const output = resolve(fileURLToPath(new URL("../../docs/assets/", import.meta.url)));
const chromePath = process.env.GOVERNDIFF_CHROME_PATH
  || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const types = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

async function assetResponse(request) {
  const relative = decodeURIComponent(new URL(request.url).pathname).replace(/^\/+/, "");
  if (!relative) return new Response("Not found", { status: 404 });
  const target = normalize(join(root, relative));
  if (!target.startsWith(root)) return new Response("Not found", { status: 404 });
  try {
    return new Response(await readFile(target), {
      headers: { "content-type": types[extname(target)] ?? "application/octet-stream" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

const server = createServer(async (incoming, outgoing) => {
  const port = server.address().port;
  const request = new Request(`http://127.0.0.1:${port}${incoming.url}`, {
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
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--disable-background-networking", "--disable-default-apps", "--no-first-run"],
});
await mkdir(output, { recursive: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: "domcontentloaded" });
  await page.getByText("Review queue", { exact: true }).waitFor({ timeout: 30_000 });
  await page.screenshot({ path: resolve(output, "reviewer-queue.png"), fullPage: false });
  await page.locator(".change-card").first().click();
  await page.screenshot({ path: resolve(output, "reviewer-evidence.png"), fullPage: false });
  await page.locator('.decision-stack > button').first().click();
  await page.screenshot({ path: resolve(output, "reviewer-decision.png"), fullPage: false });
  await context.close();
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}

await writeFile(
  resolve(output, "README.md"),
  "# GovernDiff public demo media\n\n"
    + "From `reviewer-ui/`, run `node scripts/capture-public-demo.mjs`.\n"
    + "The PNG screenshots are source frames for `reviewer-demo.gif`. No external corpus or user data is shown.\n",
  "utf8",
);
console.log(`wrote publication-safe screenshots to ${output}`);
