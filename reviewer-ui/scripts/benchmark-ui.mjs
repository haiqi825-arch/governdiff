import { readFile, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildChangeCardModel,
  filterChanges,
  selectChange,
} from "../app/reviewer-model.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function percentile(values, percentage) {
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.min(ordered.length - 1, Math.ceil(ordered.length * percentage) - 1)];
}

function measure(iterations, operation) {
  const durations = [];
  for (let index = 0; index < iterations; index += 1) {
    const started = performance.now();
    operation(index);
    durations.push(performance.now() - started);
  }
  return {
    iterations,
    p95_ms: Number(percentile(durations, 0.95).toFixed(3)),
    maximum_ms: Number(Math.max(...durations).toFixed(3)),
  };
}

export async function runUiBenchmark({ changes = 5000, iterations = 40, thresholdMs = 200 } = {}) {
  const report = JSON.parse(await readFile(resolve(ROOT, "public", "sample-report.json"), "utf8"));
  const source = report.changes.filter((change) => change.change_type !== "unchanged");
  const expanded = Array.from({ length: changes }, (_, index) => {
    const original = source[index % source.length];
    return {
      ...original,
      fingerprint: `${original.fingerprint}-${index}`,
      section: `${original.section} benchmark-${index % 97}`,
      section_path: [...(original.section_path ?? []), `batch-${index % 19}`],
    };
  });
  const decisions = Object.fromEntries(
    expanded.filter((_, index) => index % 4 === 0).map((change) => [change.fingerprint, { state: "confirmed" }]),
  );
  let visible = expanded;
  const search = measure(iterations, (index) => {
    visible = filterChanges(expanded, { query: index % 2 ? "policy" : "benchmark-7" }, decisions);
  });
  const filter = measure(iterations, (index) => {
    visible = filterChanges(expanded, {
      confidence: index % 2 ? "high" : "all",
      breakingOnly: index % 3 === 0,
      unreviewedOnly: index % 5 === 0,
      hideFormatOnly: true,
    }, decisions);
  });
  const switchCard = measure(iterations, (index) => {
    const candidate = expanded[(index * 101) % expanded.length];
    const selected = selectChange(visible, candidate.fingerprint, expanded);
    buildChangeCardModel(selected, decisions);
  });
  const interactions = { search, filter, switch_card: switchCard };
  return {
    schema_version: "governdiff-ui-performance/1.0",
    generated_at: new Date().toISOString(),
    runtime: { node: process.version, platform: process.platform, arch: process.arch },
    workload: { changes, iterations },
    threshold_ms: thresholdMs,
    interactions,
    passed: Object.values(interactions).every((item) => item.p95_ms < thresholdMs),
  };
}

async function main() {
  const outputIndex = process.argv.indexOf("--output");
  const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : "";
  const strict = process.argv.includes("--strict");
  const result = await runUiBenchmark();
  const rendered = `${JSON.stringify(result, null, 2)}\n`;
  if (output) await writeFile(resolve(process.cwd(), output), rendered, "utf8");
  process.stdout.write(rendered);
  if (strict && !result.passed) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
