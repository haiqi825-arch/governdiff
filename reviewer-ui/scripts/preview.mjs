import { createServer } from "node:http";
import { open } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import worker from "../dist/server/index.js";

const root = fileURLToPath(new URL("../dist/client/", import.meta.url));
const port = Number(process.env.PORT ?? 8795);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

async function assetResponse(request) {
  const url = new URL(request.url);
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!relative) return new Response("Not found", { status: 404 });
  const target = normalize(join(root, relative));
  if (!target.startsWith(root)) return new Response("Not found", { status: 404 });
  try {
    const handle = await open(target, "r");
    try {
      if (!(await handle.stat()).isFile()) return new Response("Not found", { status: 404 });
      return new Response(await handle.readFile(), {
        headers: { "content-type": types[extname(target)] ?? "application/octet-stream" },
      });
    } finally {
      await handle.close();
    }
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

const server = createServer(async (incoming, outgoing) => {
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

server.listen(port, "127.0.0.1", () => {
  console.log(`GovernDiff Reviewer preview: http://127.0.0.1:${port}/`);
});
