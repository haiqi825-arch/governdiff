import Ajv2020, {
  type ErrorObject,
  type ValidateFunction,
} from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import reportSchema from "../../schema/report.schema.json";
import reviewSchema from "../../schema/review.schema.json";
import { normalizeState } from "./reviewer-model.mjs";
import type {
  AlignmentOverride,
  Decision,
  FieldEdit,
  ImportedReview,
  Report,
} from "./reviewer-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

let reportValidator: ValidateFunction<Report> | undefined;
let reviewValidator: ValidateFunction | undefined;

function validators(): {
  report: ValidateFunction<Report>;
  review: ValidateFunction;
} {
  if (!reportValidator || !reviewValidator) {
    const schemaValidator = addFormats(
      new Ajv2020({ allErrors: true, strict: false, verbose: false }),
    );
    reportValidator = schemaValidator.compile<Report>(reportSchema);
    reviewValidator = schemaValidator.compile(reviewSchema);
  }
  return { report: reportValidator, review: reviewValidator };
}

export type ReportValidationIssue = {
  path: string;
  message: string;
  keyword: string;
};

function validationIssues(errors: ErrorObject[] = []): ReportValidationIssue[] {
  return errors.map((error) => {
    const missing =
      error.keyword === "required" &&
      typeof error.params.missingProperty === "string"
        ? `/${error.params.missingProperty}`
        : "";
    return {
      path: `${error.instancePath || "/"}${missing}`.replace("//", "/"),
      message: error.message ?? "is invalid",
      keyword: error.keyword,
    };
  });
}

function issuePreview(issues: ReportValidationIssue[]): string {
  const preview = issues
    .slice(0, 6)
    .map((issue) => `${issue.path}: ${issue.message}`)
    .join("; ");
  const remaining = Math.max(0, issues.length - 6);
  return `${preview}${remaining ? `; plus ${remaining} more issue(s)` : ""}`;
}

export class ReportValidationError extends Error {
  readonly issues: ReportValidationIssue[];

  constructor(errors: ErrorObject[] = []) {
    const issues = validationIssues(errors);
    super(
      `Report 1.5 validation failed. ${issuePreview(issues)}. ` +
        "Regenerate the JSON with GovernDiff 0.6.x and try again.",
    );
    this.name = "ReportValidationError";
    this.issues = issues;
  }
}

export class ReviewValidationError extends Error {
  readonly issues: ReportValidationIssue[];

  constructor(errors: ErrorObject[] = []) {
    const issues = validationIssues(errors);
    super(
      `Review 1.1 validation failed. ${issuePreview(issues)}. ` +
        "Export a fresh review JSON from the current GovernDiff Reviewer and try again.",
    );
    this.name = "ReviewValidationError";
    this.issues = issues;
  }
}

export class ReviewIdentityMismatchError extends Error {
  constructor() {
    super(
      "The imported review belongs to a different old/new report pair. Open its matching report or export a review for the current project.",
    );
    this.name = "ReviewIdentityMismatchError";
  }
}

export function parseReport(value: unknown): Report {
  const { report } = validators();
  if (!report(value)) {
    throw new ReportValidationError(report.errors ?? []);
  }
  return value;
}

export async function readJsonFile(file: File): Promise<unknown> {
  try {
    return JSON.parse(await file.text()) as unknown;
  } catch {
    throw new Error("Invalid JSON file.");
  }
}

function parseDecision(value: unknown): Decision {
  if (!isRecord(value)) {
    throw new Error("Review decision entries must be objects.");
  }
  return {
    state: normalizeState(value.state),
    note: typeof value.note === "string" ? value.note : "",
    updatedAt:
      typeof value.updated_at === "string"
        ? value.updated_at
        : typeof value.updatedAt === "string"
          ? value.updatedAt
          : "",
  };
}

export function parseReviewImport(
  value: unknown,
  report: Report,
): ImportedReview {
  if (!isRecord(value)) {
    throw new Error("Invalid review JSON.");
  }
  if (
    value.schema_version !== "governdiff-review/1.0" &&
    value.schema_version !== "governdiff-review/1.1"
  ) {
    throw new Error("Unsupported review schema version.");
  }
  const { review } = validators();
  if (value.schema_version === "governdiff-review/1.1" && !review(value)) {
    throw new ReviewValidationError(review.errors ?? []);
  }
  const reportIdentity = isRecord(value.report) ? value.report : {};
  if (
    reportIdentity.old_sha256 !== report.old_document.sha256 ||
    reportIdentity.new_sha256 !== report.new_document.sha256
  ) {
    throw new ReviewIdentityMismatchError();
  }

  const decisions = Array.isArray(value.decisions)
    ? Object.fromEntries(
        value.decisions.map((item) => {
          if (!isRecord(item) || typeof item.change_fingerprint !== "string") {
            throw new Error("Review decision is missing change_fingerprint.");
          }
          return [item.change_fingerprint, parseDecision(item)];
        }),
      )
    : isRecord(value.decisions)
      ? Object.fromEntries(
          Object.entries(value.decisions).map(([key, item]) => [
            key,
            parseDecision(item),
          ]),
        )
      : {};

  const fieldEdits = Array.isArray(value.field_edits)
    ? Object.fromEntries(
        value.field_edits.map((item) => {
          if (!isRecord(item) || typeof item.finding_fingerprint !== "string") {
            throw new Error("Field edit is missing finding_fingerprint.");
          }
          return [item.finding_fingerprint, item as FieldEdit];
        }),
      )
    : {};

  const alignmentOverrides = Array.isArray(value.alignment_overrides)
    ? Object.fromEntries(
        value.alignment_overrides.map((item) => {
          if (
            !isRecord(item) ||
            typeof item.original_change_fingerprint !== "string"
          ) {
            throw new Error(
              "Alignment override is missing original_change_fingerprint.",
            );
          }
          const updatedAt =
            typeof item.updated_at === "string"
              ? item.updated_at
              : typeof item.updatedAt === "string"
                ? item.updatedAt
                : "";
          return [
            item.original_change_fingerprint,
            { ...item, updatedAt } as AlignmentOverride,
          ];
        }),
      )
    : {};

  return { decisions, fieldEdits, alignmentOverrides };
}
