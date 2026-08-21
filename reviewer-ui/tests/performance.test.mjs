import assert from "node:assert/strict";
import test from "node:test";

import { runUiBenchmark } from "../scripts/benchmark-ui.mjs";

test("search, filtering, and change-card selection stay below the 200 ms target", async () => {
  const result = await runUiBenchmark();
  assert.equal(result.passed, true, JSON.stringify(result.interactions, null, 2));
  for (const interaction of Object.values(result.interactions)) {
    assert.ok(interaction.p95_ms < 200);
  }
});
