import type { Report } from "../reviewer-types";
import { useI18n } from "../i18n";

function SummaryMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "danger" | "neutral" | "warning" | "conflict" | "success";
}) {
  return (
    <span className="summary-metric" data-tone={tone}>
      <b>{value}</b>
      <span>{label}</span>
    </span>
  );
}

export function ReviewSummary({
  report,
  warnings,
  reviewedCount,
  lowConfidenceCount,
  mappingConflicts,
  queueTotal,
  queueReviewed,
}: {
  report: Report;
  warnings: string[];
  reviewedCount: number;
  lowConfidenceCount: number;
  mappingConflicts: number;
  queueTotal: number;
  queueReviewed: number;
}) {
  const { t } = useI18n();
  const total = report.summary.total_changes;
  const unreviewed = Math.max(0, total - reviewedCount);
  return (
    <details className="review-summary">
      <summary>
        <div className="summary-metrics" aria-label={t("summary.aria")}>
          <SummaryMetric
            label={t("summary.breaking")}
            value={report.summary.breaking_findings}
            tone="danger"
          />
          <SummaryMetric label={t("summary.unreviewed")} value={unreviewed} tone="neutral" />
          <SummaryMetric
            label={t("summary.lowConfidence")}
            value={lowConfidenceCount}
            tone="warning"
          />
          <SummaryMetric
            label={t("summary.conflicts")}
            value={mappingConflicts}
            tone="conflict"
          />
          <SummaryMetric label={t("summary.queueProgress")} value={`${queueReviewed}/${queueTotal}`} tone="success" />
          <SummaryMetric label={t("summary.reportProgress")} value={`${reviewedCount}/${total}`} tone="success" />
        </div>
        <span className="summary-toggle">
          {warnings.length ? t("summary.warnings", { count: warnings.length }) : t("summary.noWarnings")}
          <span aria-hidden="true">⌄</span>
        </span>
      </summary>
      <div className="summary-expanded">
        <div>
          <span>{t("summary.audit")}</span>
          <strong>{t("summary.schema", { version: report.schema_version })}</strong>
          <small>{new Date(report.generated_at).toLocaleString()}</small>
        </div>
        <div className="quality-summary" role={warnings.length ? "alert" : "status"}>
          <strong>{t("summary.quality")}</strong>
          {warnings.length ? (
            <ul>
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : (
            <p>{t("summary.qualityClear")}</p>
          )}
        </div>
      </div>
    </details>
  );
}
