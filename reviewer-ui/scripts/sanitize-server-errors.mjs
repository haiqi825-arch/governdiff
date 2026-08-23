import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = resolve(root, "dist", "server", "index.js");
const unsafe = 'return new Response(JSON.stringify({ error: String(e) }), {';
const safe = 'return new Response(JSON.stringify({ error: "Prerender parameter generation failed." }), {';

const source = await readFile(server, "utf8");
const occurrences = source.split(unsafe).length - 1;
if (occurrences !== 1) {
  throw new Error(`Expected one generated stack-exposure boundary, found ${occurrences}.`);
}

await writeFile(server, source.replace(unsafe, safe), "utf8");
console.log("Sanitized generated server error response.");
