import type {
  ProjectExportStatus,
  ProjectIntegrityStatus,
  ProjectSaveStatus,
} from "../reviewer-types";
import { useI18n } from "../i18n";

export function ProjectStatus({
  saveStatus,
  dirty,
  exportStatus,
  integrityStatus,
  updatedAt,
  hasRecovery,
  undoLabel,
  onRestore,
  onUndo,
}: {
  saveStatus: ProjectSaveStatus;
  dirty: boolean;
  exportStatus: ProjectExportStatus;
  integrityStatus: ProjectIntegrityStatus;
  updatedAt: string;
  hasRecovery: boolean;
  undoLabel?: string;
  onRestore: () => void;
  onUndo: () => void;
}) {
  const { t } = useI18n();
  const saveLabel = saveStatus === "restoring"
    ? t("status.restoring")
    : saveStatus === "saving"
      ? t("status.saving")
      : saveStatus === "error"
        ? t("status.saveFailed")
        : dirty
          ? t("status.unsaved")
          : t("status.saved");
  const saveTone = saveStatus === "error" ? "error" : dirty ? "warning" : "success";
  return (
    <section className="project-status" aria-label={t("status.aria")}>
      <div className="project-status-items" role="status" aria-live="polite">
        <span className="project-status-chip" data-tone={saveTone}>
          <i aria-hidden="true" />
          {saveLabel}
        </span>
        <span
          className="project-status-chip"
          data-tone={exportStatus.state === "exported" ? "success" : "warning"}
        >
          <i aria-hidden="true" />
          {exportStatus.state === "exported" ? t("status.exported") : t("status.notExported")}
        </span>
        {integrityStatus === "identity-mismatch" && (
          <span className="project-status-chip" data-tone="error">
            <i aria-hidden="true" />
            {t("status.mismatch")}
          </span>
        )}
        {integrityStatus === "corrupt" && (
          <span className="project-status-chip" data-tone="error">
            <i aria-hidden="true" />
            {t("status.corrupt")}
          </span>
        )}
        {updatedAt && saveStatus === "saved" && !dirty && (
          <small>{t("status.savedAt", { time: new Date(updatedAt).toLocaleTimeString() })}</small>
        )}
      </div>
      <div className="project-status-actions">
        {undoLabel && (
          <button type="button" onClick={onUndo}>
            {t("status.undo", { label: undoLabel })}
          </button>
        )}
        {hasRecovery && (
          <button type="button" className="restore-project" onClick={onRestore}>
            {t("status.restore")}
          </button>
        )}
      </div>
    </section>
  );
}
