import type {
  Block,
  Decisions,
  PolicyChange,
  ReviewerFilters,
  ReviewState,
} from "./reviewer-types";

export function normalizeState(value: unknown): ReviewState;
export function sectionKey(path?: string[] | null): string;
export function filterChanges(
  changes: PolicyChange[],
  filters: ReviewerFilters,
  decisions?: Decisions,
): PolicyChange[];
export function sortChanges(
  changes: PolicyChange[],
  sortBy?: ReviewerFilters["sortBy"],
  decisions?: Decisions,
): PolicyChange[];
export function buildReviewQueue(
  changes: PolicyChange[],
  filters: ReviewerFilters,
  decisions?: Decisions,
): PolicyChange[];
export function nextQueueFingerprint(
  currentQueue: PolicyChange[],
  currentFingerprint: string,
): string;
export function selectChange(
  visibleChanges: PolicyChange[],
  selectedId: string,
  allChanges: PolicyChange[],
): PolicyChange | null;
export function buildChangeCardModel(
  change?: PolicyChange | null,
  decisions?: Decisions,
): {
  fingerprint: string;
  state: ReviewState;
  heading: string;
  evidence: string;
  findings: Array<{
    fingerprint: string;
    check: string;
    summary: string;
    confidence: string;
  }>;
} | null;
export function uniqueBlocks(
  blocks: Array<Block | null | undefined>,
): Block[];
