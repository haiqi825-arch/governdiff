import { createHash, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { Socket } from "node:net";
import { extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

let outboundNetworkAttempts = 0;
Socket.prototype.connect = function denyOutboundConnection() {
  outboundNetworkAttempts += 1;
  throw new Error("Outbound network access is disabled for Reviewer sessions.");
};

const here = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(here, "../dist/client");
const workerPath = resolve(here, "../dist/server/index.js");
const workerModule = await import(pathToFileURL(workerPath).href);
const worker = workerModule.default;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

const SECURITY_HEADERS = {
  "cache-control": "no-store",
  "content-security-policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

const MAX_BOOTSTRAP_BYTES = 1024 * 1024;
const MAX_REVIEW_BYTES = 20 * 1024 * 1024;

async function readBootstrap() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
    if (Buffer.byteLength(input) > MAX_BOOTSTRAP_BYTES) {
      throw new Error("Invalid Reviewer bootstrap data.");
    }
  }
  const value = JSON.parse(input);
  if (!value || typeof value !== "object") {
    throw new Error("Invalid Reviewer bootstrap data.");
  }
  return value;
}

function assertContained(parent, candidate) {
  const resolvedParent = `${resolve(parent)}${sep}`;
  const resolvedCandidate = resolve(candidate);
  if (!resolvedCandidate.startsWith(resolvedParent)) {
    throw new Error("Reviewer session files must stay inside the session directory.");
  }
  return resolvedCandidate;
}

function parseCookie(header) {
  const cookies = new Map();
  for (const item of String(header || "").split(";")) {
    const separator = item.indexOf("=");
    if (separator <= 0) continue;
    cookies.set(item.slice(0, separator).trim(), item.slice(separator + 1).trim());
  }
  return cookies;
}

function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

async function readBody(request, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function writeJsonAtomic(path, value) {
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, path);
}

function reviewIdentity(report) {
  const oldSha256 = report?.old_document?.sha256;
  const newSha256 = report?.new_document?.sha256;
  if (typeof oldSha256 !== "string" || typeof newSha256 !== "string") return null;
  return { old_sha256: oldSha256, new_sha256: newSha256 };
}

function validateReview(value, identity) {
  if (
    !value ||
    typeof value !== "object" ||
    !["governdiff-review/1.0", "governdiff-review/1.1"].includes(value.schema_version)
  ) {
    throw new Error("Unsupported review schema.");
  }
  const report = value.report;
  if (
    !report ||
    typeof report !== "object" ||
    report.old_sha256 !== identity.old_sha256 ||
    report.new_sha256 !== identity.new_sha256
  ) {
    throw new Error("Review identity does not match this report.");
  }
  return value;
}

async function assetResponse(pathname) {
  const relativePath = pathname.replace(/^\/+/, "");
  if (!relativePath) return null;
  const filePath = resolve(join(root, relativePath));
  const relativeToRoot = relative(root, filePath);
  if (relativeToRoot.startsWith("..") || relativeToRoot === "" || resolve(filePath) === root) return null;
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) return null;
    return {
      filePath,
      headers: {
        "content-length": String(fileStat.size),
        "content-type": MIME_TYPES[extname(filePath)] || "application/octet-stream",
      },
    };
  } catch {
    return null;
  }
}

function sendJson(response, statusCode, value, extraHeaders = {}) {
  const body = `${JSON.stringify(value)}\n`;
  response.writeHead(statusCode, {
    ...SECURITY_HEADERS,
    "content-length": String(Buffer.byteLength(body)),
    "content-type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  response.end(body);
}

function sendEmpty(response, statusCode) {
  response.writeHead(statusCode, { ...SECURITY_HEADERS, "content-length": "0" });
  response.end();
}

const bootstrap = await readBootstrap();
const token = String(bootstrap.token || "");
const port = Number(bootstrap.port ?? 0);
const language = bootstrap.language === "zh" ? "zh" : "en";
const heartbeatTimeoutMs = Math.max(10_000, Number(bootstrap.heartbeat_timeout_ms || 30_000));
if (token.length < 32 || !Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("Invalid Reviewer bootstrap data.");
}
const cookieName = `governdiff_${createHash("sha256").update(token).digest("hex").slice(0, 20)}`;

const sessionDirectory = resolve(String(bootstrap.session_dir || ""));
const reportFile = assertContained(sessionDirectory, String(bootstrap.report_file || ""));
const initialReviewFile = bootstrap.initial_review_file
  ? assertContained(sessionDirectory, String(bootstrap.initial_review_file))
  : null;
const statusFile = assertContained(sessionDirectory, join(sessionDirectory, "session-status.json"));
const draftFile = assertContained(sessionDirectory, join(sessionDirectory, "review-draft.json"));
const exportedReviewFile = assertContained(sessionDirectory, join(sessionDirectory, "review.json"));

await mkdir(sessionDirectory, { recursive: true, mode: 0o700 });
const report = JSON.parse(await readFile(reportFile, "utf8"));
const identity = reviewIdentity(report);
if (!identity) throw new Error("Reviewer report identity is missing.");

let bootstrapped = false;
let lastHeartbeat = Date.now();
let actualPort = 0;
let origin = "";
let closing = false;

async function currentState() {
  try {
    const value = JSON.parse(await readFile(draftFile, "utf8"));
    if (value?.schema_version !== "governdiff-review-session-state/1.0") {
      throw new Error("Unsupported Reviewer session state.");
    }
    return {
      review: validateReview(value.review, identity),
      workspace: value.workspace && typeof value.workspace === "object" ? value.workspace : null,
    };
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (!initialReviewFile) return { review: null, workspace: null };
  try {
    return {
      review: validateReview(JSON.parse(await readFile(initialReviewFile, "utf8")), identity),
      workspace: null,
    };
  } catch (error) {
    if (error?.code === "ENOENT") return { review: null, workspace: null };
    throw error;
  }
}

const server = createServer(async (incoming, outgoing) => {
  try {
    const method = incoming.method || "GET";
    if (incoming.headers.host !== `127.0.0.1:${actualPort}`) {
      sendEmpty(outgoing, 421);
      return;
    }
    const requestOrigin = incoming.headers.origin;
    if (requestOrigin && requestOrigin !== origin) {
      sendEmpty(outgoing, 403);
      return;
    }
    if (!["GET", "HEAD"].includes(method) && requestOrigin !== origin) {
      sendEmpty(outgoing, 403);
      return;
    }
    if (incoming.headers["sec-fetch-site"] === "cross-site" || method === "OPTIONS") {
      sendEmpty(outgoing, 403);
      return;
    }

    const url = new URL(incoming.url || "/", origin);
    const suppliedToken = parseCookie(incoming.headers.cookie).get(cookieName);
    let issueCookie = false;
    const authorized = suppliedToken ? constantTimeEqual(suppliedToken, token) : false;
    if (!authorized) {
      const acceptsHtml = String(incoming.headers.accept || "").includes("text/html");
      const isInitialNavigation = !bootstrapped && method === "GET" && url.pathname === "/" && acceptsHtml;
      if (!isInitialNavigation) {
        sendEmpty(outgoing, 401);
        return;
      }
      bootstrapped = true;
      lastHeartbeat = Date.now();
      issueCookie = true;
    }

    if (url.pathname.startsWith("/api/review-session")) {
      if (issueCookie) {
        sendEmpty(outgoing, 401);
        return;
      }
      if (url.pathname === "/api/review-session" && method === "GET") {
        const state = await currentState();
        sendJson(outgoing, 200, {
          schema_version: "governdiff-review-session/1.0",
          language,
          report,
          review: state.review,
          workspace: state.workspace,
        });
        return;
      }
      if (url.pathname === "/api/review-session/heartbeat" && method === "POST") {
        lastHeartbeat = Date.now();
        sendJson(outgoing, 200, { accepted: true });
        return;
      }
      if (
        (url.pathname === "/api/review-session/state" || url.pathname === "/api/review-session/export") &&
        method === "POST"
      ) {
        if (!String(incoming.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
          sendEmpty(outgoing, 415);
          return;
        }
        const value = JSON.parse(await readBody(incoming, MAX_REVIEW_BYTES));
        const exporting = url.pathname.endsWith("/export");
        const review = validateReview(exporting ? value : value?.review, identity);
        const target = exporting ? exportedReviewFile : draftFile;
        await writeJsonAtomic(
          target,
          exporting
            ? review
            : {
                schema_version: "governdiff-review-session-state/1.0",
                review,
                workspace: value.workspace && typeof value.workspace === "object" ? value.workspace : null,
              },
        );
        lastHeartbeat = Date.now();
        if (exporting) {
          await writeJsonAtomic(statusFile, {
            schema_version: "governdiff-review-session-status/1.0",
            event: "review-exported",
            host: "127.0.0.1",
            port: actualPort,
            outbound_network_attempts: outboundNetworkAttempts,
          });
        }
        sendJson(outgoing, 200, { accepted: true });
        return;
      }
      sendEmpty(outgoing, 405);
      return;
    }

    if (!['GET', 'HEAD'].includes(method)) {
      sendEmpty(outgoing, 405);
      return;
    }

    const asset = await assetResponse(url.pathname);
    if (asset) {
      outgoing.writeHead(200, {
        ...SECURITY_HEADERS,
        ...asset.headers,
        ...(issueCookie
          ? { "set-cookie": `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/` }
          : {}),
      });
      if (method === "HEAD") outgoing.end();
      else createReadStream(asset.filePath).pipe(outgoing);
      return;
    }

    const request = new Request(new URL(url.pathname + url.search, origin), {
      method,
      headers: new Headers(incoming.headers),
    });
    const response = await worker.fetch(request);
    const headers = Object.fromEntries(response.headers.entries());
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers[name] = value;
    delete headers["access-control-allow-credentials"];
    delete headers["access-control-allow-headers"];
    delete headers["access-control-allow-methods"];
    delete headers["access-control-allow-origin"];
    if (issueCookie) headers["set-cookie"] = `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/`;
    outgoing.writeHead(response.status, headers);
    if (method === "HEAD" || !response.body) {
      outgoing.end();
      return;
    }
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      outgoing.write(Buffer.from(value));
    }
    outgoing.end();
  } catch (error) {
    const statusCode = Number(error?.statusCode) || (error instanceof SyntaxError ? 400 : 500);
    sendJson(outgoing, statusCode, { error: statusCode >= 500 ? "Reviewer request failed." : error.message });
  }
});

server.listen(port, "127.0.0.1", async () => {
  const address = server.address();
  actualPort = typeof address === "object" && address ? address.port : port;
  origin = `http://127.0.0.1:${actualPort}`;
  await writeJsonAtomic(statusFile, {
    schema_version: "governdiff-review-session-status/1.0",
    event: "ready",
    host: "127.0.0.1",
    port: actualPort,
    outbound_network_attempts: outboundNetworkAttempts,
  });
});

const heartbeatTimer = setInterval(async () => {
  if (!bootstrapped || closing || Date.now() - lastHeartbeat <= heartbeatTimeoutMs) return;
  closing = true;
  try {
    await writeJsonAtomic(statusFile, {
      schema_version: "governdiff-review-session-status/1.0",
      event: "browser-closed",
      host: "127.0.0.1",
      port: actualPort,
      outbound_network_attempts: outboundNetworkAttempts,
    });
  } finally {
    server.close(() => process.exit(0));
  }
}, 2_000);
heartbeatTimer.unref();

function stop() {
  if (closing) return;
  closing = true;
  clearInterval(heartbeatTimer);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2_000).unref();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
