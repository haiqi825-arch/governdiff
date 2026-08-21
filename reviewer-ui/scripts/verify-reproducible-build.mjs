import { createHash } from "node:crypto";
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}

async function readBuildSecrets() {
  const value = JSON.parse(await readFile(resolve(DIST, "server", "vinext-server.json"), "utf8"));
  if (!/^[a-f0-9]{64}$/i.test(value.prerenderSecret ?? "")) {
    throw new Error("Reviewer build did not generate a valid prerender secret");
  }
  const server = await readFile(resolve(DIST, "server", "index.js"), "utf8");
  const draftSecret = server.match(/function getDraftSecret\(\)\s*{\s*return "([^"]+)";/)?.[1];
  if (draftSecret && !/^[a-f0-9-]{36}$/i.test(draftSecret)) {
    throw new Error("Reviewer build did not generate a valid draft-mode secret");
  }
  return draftSecret ? [value.prerenderSecret, draftSecret] : [value.prerenderSecret];
}

async function manifest(buildSecrets) {
  const files = await walk(DIST);
  const entries = [];
  for (const file of files.sort()) {
    const content = await readFile(file);
    let normalized = content;
    for (const [index, buildSecret] of buildSecrets.entries()) {
      const secret = Buffer.from(buildSecret);
      if (normalized.includes(secret)) {
        normalized = Buffer.from(normalized.toString("utf8").replaceAll(buildSecret, `[VINEXT_SECRET_${index}]`));
      }
    }
    entries.push({
      path: relative(DIST, file).split(sep).join("/"),
      bytes: content.length,
      normalized_sha256: createHash("sha256").update(normalized).digest("hex"),
    });
  }
  return entries;
}

function runBuild() {
  const npmExecPath = process.env.npm_execpath;
  const command = npmExecPath ? process.execPath : (process.platform === "win32" ? "npm.cmd" : "npm");
  const args = npmExecPath ? [npmExecPath, "run", "build"] : ["run", "build"];
  return new Promise((accept, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env: { ...process.env, SOURCE_DATE_EPOCH: "1704067200" },
      stdio: ["ignore", "ignore", "pipe"],
    });
    let errors = "";
    child.stderr.on("data", (chunk) => { errors += chunk; });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? accept() : reject(new Error(`Reviewer build failed (${code}): ${errors.slice(-500)}`)));
  });
}

async function main() {
  const outputIndex = process.argv.indexOf("--output");
  const output = outputIndex >= 0 ? resolve(process.cwd(), process.argv[outputIndex + 1]) : "";
  let result;
  try {
    const lock = JSON.parse(await readFile(resolve(ROOT, "package-lock.json"), "utf8"));
    const rootPackage = lock.packages?.[""] ?? {};
    const declared = { ...(rootPackage.dependencies ?? {}), ...(rootPackage.devDependencies ?? {}) };
    const exactRootVersions = Object.values(declared).every((value) => /^\d+\.\d+\.\d+(?:[-+].+)?$/.test(value));
    await rm(DIST, { recursive: true, force: true });
    await runBuild();
    const firstSecrets = await readBuildSecrets();
    const first = await manifest(firstSecrets);
    await rm(DIST, { recursive: true, force: true });
    await runBuild();
    const secondSecrets = await readBuildSecrets();
    const second = await manifest(secondSecrets);
    const firstValue = JSON.stringify(first);
    const secondValue = JSON.stringify(second);
    const firstByPath = new Map(first.map((entry) => [entry.path, entry]));
    const secondByPath = new Map(second.map((entry) => [entry.path, entry]));
    const differingPaths = [...new Set([...firstByPath.keys(), ...secondByPath.keys()])]
      .filter((path) => firstByPath.get(path)?.normalized_sha256 !== secondByPath.get(path)?.normalized_sha256)
      .sort();
    result = {
      schema_version: "governdiff-reviewer-reproducible-build/1.0",
      source_date_epoch: "1704067200",
      lockfile_version: lock.lockfileVersion,
      exact_root_versions: exactRootVersions,
      file_count: second.length,
      normalized_manifest_sha256: createHash("sha256").update(secondValue).digest("hex"),
      cryptographic_secrets_rotated: firstSecrets.every((secret, index) => secret !== secondSecrets[index]),
      normalized_byte_identical: firstValue === secondValue,
      differing_paths: differingPaths,
      passed: lock.lockfileVersion === 3 && exactRootVersions
        && firstSecrets.every((secret, index) => secret !== secondSecrets[index])
        && firstValue === secondValue && second.length > 0,
    };
  } catch (error) {
    result = {
      schema_version: "governdiff-reviewer-reproducible-build/1.0",
      error_type: error?.constructor?.name ?? "Error",
      error: error instanceof Error ? error.message : String(error),
      passed: false,
    };
  }
  const rendered = `${JSON.stringify(result, null, 2)}\n`;
  if (output) await writeFile(output, rendered, "utf8");
  process.stdout.write(rendered);
  if (!result.passed) process.exitCode = 1;
}

await main();
