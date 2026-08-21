// @ts-check

/** @typedef {import("./reviewer-types").Block} Block */
/** @typedef {import("./reviewer-types").Decisions} Decisions */
/** @typedef {import("./reviewer-types").PolicyChange} PolicyChange */
/** @typedef {import("./reviewer-types").ReviewerFilters} ReviewerFilters */
/** @typedef {import("./reviewer-types").ReviewState} ReviewState */

/** @type {Record<string, ReviewState>} */
const LEGACY_STATES = {
  accepted: "confirmed",
  "false-positive": "rejected",
};

/** @param {unknown} value @returns {ReviewState} */
export function normalizeState(value) {
  if (!value) return "unreviewed";
  if (typeof value !== "string") return "unreviewed";
  const normalized = LEGACY_STATES[value] ?? value;
  return ["unreviewed", "confirmed", "rejected", "modified", "waived"].includes(normalized)
    ? /** @type {ReviewState} */ (normalized)
    : "unreviewed";
}

/** @param {string[] | null | undefined} path */
export function sectionKey(path) {
  return (path ?? []).join("\u001f");
}

/**
 * @param {PolicyChange[]} changes
 * @param {ReviewerFilters} filters
 * @param {Decisions} decisions
 * @returns {PolicyChange[]}
 */
export function filterChanges(changes, filters, decisions = {}) {
  const {
    query = "",
    confidence = "all",
    changeType = "all",
    sectionFilter = "",
    breakingOnly = false,
    unreviewedOnly = false,
    hideFormatOnly = false,
  } = filters;
  const term = query.trim().toLocaleLowerCase();
  return changes.filter((change) => {
    if (change.change_type === "unchanged") return false;
    if (hideFormatOnly && change.change_type === "format_only") return false;
    if (confidence !== "all" && change.confidence_level !== confidence) return false;
    if (changeType !== "all" && change.change_type !== changeType) return false;
    const key = sectionKey(change.section_path);
    if (sectionFilter && key !== sectionFilter && !key.startsWith(`${sectionFilter}\u001f`)) return false;
    if (breakingOnly && !change.findings.some((finding) => finding.breaking && !finding.waived)) return false;
    if (unreviewedOnly && normalizeState(decisions[change.fingerprint]?.state ?? change.review?.state) !== "unreviewed") return false;
    if (!term) return true;
    return [
      change.fingerprint,
      change.section,
      change.old_article,
      change.new_article,
      change.old_block?.text,
      change.new_block?.text,
      ...change.findings.flatMap((finding) => [finding.check_id, finding.field, finding.summary]),
    ].filter(Boolean).join(" ").toLocaleLowerCase().includes(term);
  });
}

const SEVERITY_RANK = {
  critical: 5,
  blocker: 5,
  high: 4,
  warning: 3,
  medium: 3,
  low: 2,
  info: 1,
};

/** @param {PolicyChange} change */
function hasBreaking(change) {
  return change.findings.some((finding) => finding.breaking && !finding.waived);
}

/**
 * Stable queue ordering. The original report index is the final tie breaker.
 * @param {PolicyChange[]} changes
 * @param {ReviewerFilters["sortBy"]} sortBy
 * @param {Decisions} decisions
 * @returns {PolicyChange[]}
 */
export function sortChanges(changes, sortBy = "document", decisions = {}) {
  const indexed = changes.map((change, index) => ({ change, index }));
  if (sortBy === "document") return indexed.map(({ change }) => change);
  return indexed.sort((left, right) => {
    const leftState = normalizeState(
      decisions[left.change.fingerprint]?.state ?? left.change.review?.state,
    );
    const rightState = normalizeState(
      decisions[right.change.fingerprint]?.state ?? right.change.review?.state,
    );
    const unreviewedDelta = Number(rightState === "unreviewed") - Number(leftState === "unreviewed");
    if (sortBy === "unreviewed" && unreviewedDelta) return unreviewedDelta;
    if (sortBy === "risk") {
      const breakingDelta = Number(hasBreaking(right.change)) - Number(hasBreaking(left.change));
      if (breakingDelta) return breakingDelta;
      const severityDelta =
        (SEVERITY_RANK[right.change.severity?.toLocaleLowerCase()] ?? 0) -
        (SEVERITY_RANK[left.change.severity?.toLocaleLowerCase()] ?? 0);
      if (severityDelta) return severityDelta;
      const confidenceDelta = right.change.confidence_score - left.change.confidence_score;
      if (confidenceDelta) return confidenceDelta;
      if (unreviewedDelta) return unreviewedDelta;
    }
    return left.index - right.index;
  }).map(({ change }) => change);
}

/**
 * @param {PolicyChange[]} changes
 * @param {ReviewerFilters} filters
 * @param {Decisions} decisions
 */
export function buildReviewQueue(changes, filters, decisions = {}) {
  return sortChanges(filterChanges(changes, filters, decisions), filters.sortBy, decisions);
}

/**
 * Returns the item that occupied the next queue position before a decision.
 * The queue is complete when the current item was last.
 * @param {PolicyChange[]} currentQueue
 * @param {string} currentFingerprint
 */
export function nextQueueFingerprint(currentQueue, currentFingerprint) {
  const index = currentQueue.findIndex((change) => change.fingerprint === currentFingerprint);
  if (index < 0) return currentQueue[0]?.fingerprint ?? "";
  return currentQueue[index + 1]?.fingerprint ?? "";
}

/**
 * @param {PolicyChange[]} visibleChanges
 * @param {string} selectedId
 * @param {PolicyChange[]} allChanges
 * @returns {PolicyChange | null}
 */
export function selectChange(visibleChanges, selectedId, allChanges) {
  return visibleChanges.find((item) => item.fingerprint === selectedId)
    ?? visibleChanges[0]
    ?? allChanges.find((item) => item.fingerprint === selectedId)
    ?? null;
}

/**
 * @param {PolicyChange | null | undefined} change
 * @param {Decisions} decisions
 */
export function buildChangeCardModel(change, decisions = {}) {
  if (!change) return null;
  const decision = decisions[change.fingerprint] ?? change.review ?? {};
  return {
    fingerprint: change.fingerprint,
    state: normalizeState(decision.state),
    heading: `${change.change_type}:${change.section}:${change.old_article ?? ""}:${change.new_article ?? ""}`,
    evidence: `${change.old_block?.text ?? ""}\n${change.new_block?.text ?? ""}`,
    findings: change.findings.map((finding) => ({
      fingerprint: finding.fingerprint,
      check: finding.check_id,
      summary: finding.summary,
      confidence: finding.confidence_level,
    })),
  };
}

/**
 * @param {Array<Block | null | undefined>} blocks
 * @returns {Block[]}
 */
export function uniqueBlocks(blocks) {
  const result = new Map();
  blocks.forEach((block) => {
    if (block) result.set(block.block_id, block);
  });
  return Array.from(result.values()).sort((a, b) => a.line_start - b.line_start);
}
