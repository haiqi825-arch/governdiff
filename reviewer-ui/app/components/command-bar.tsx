import type { ChangeEvent } from "react";

import { ReviewerIcon as Icon } from "./reviewer-icon";
import { useI18n } from "../i18n";
import type { InterfaceLanguage, Report } from "../reviewer-types";

function documentLabel(report: Report | null, side: "old" | "new"): string {
  const document = side === "old" ? report?.old_document : report?.new_document;
  return document?.source_name ?? document?.path ?? `${side}-policy`;
}

export function CommandBar({
  report,
  sessionMode,
  onOpenReport,
  onSaveState,
  onImportReview,
  onExportReview,
  onClearProject,
  onLanguageChange,
}: {
  report: Report | null;
  sessionMode?: boolean;
  onOpenReport: (file?: File) => void;
  onSaveState: () => void;
  onImportReview: (file?: File) => void;
  onExportReview: () => void;
  onClearProject: () => void;
  onLanguageChange: (language: InterfaceLanguage) => void;
}) {
  const { language, t } = useI18n();
  return (
    <header className="command-bar">
      <div className="brand-lockup">
        <div className="brand-mark">GD</div>
        <div>
          <strong>GovernDiff</strong>
          <span>{t("brand.reviewer")}</span>
        </div>
      </div>

      <div className="document-route" aria-label={t("command.documents")}>
        <span>{documentLabel(report, "old")}</span>
        <Icon name="arrow" />
        <span>{documentLabel(report, "new")}</span>
      </div>

      <nav className="command-actions" aria-label={t("command.commandsAria")}>
        <label
          className={`button ${report ? "button-secondary" : "button-primary"} file-control ${sessionMode ? "disabled" : ""}`}
          aria-disabled={sessionMode}
        >
          <Icon name="upload" />
          <span className="command-label-full">{t("command.open")}</span>
          <span className="command-label-short">{t("command.openShort")}</span>
          <input
            aria-label={t("command.openAria")}
            type="file"
            accept="application/json,.json"
            disabled={sessionMode}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              onOpenReport(file);
            }}
          />
        </label>
        <button
          className="button button-secondary"
          aria-label={t("command.save")}
          onClick={onSaveState}
          disabled={!report}
        >
          <span className="command-label-full">{t("command.save")}</span>
          <span className="command-label-short">{t("command.saveShort")}</span>
        </button>
        <label
          className={`button button-secondary file-control ${!report ? "disabled" : ""}`}
          aria-disabled={!report}
        >
          <span className="command-label-full">{t("command.import")}</span>
          <span className="command-label-short">{t("command.importShort")}</span>
          <input
            aria-label={t("command.importAria")}
            type="file"
            accept="application/json,.json"
            disabled={!report}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              onImportReview(file);
            }}
          />
        </label>
        <button
          className="button button-secondary export-control"
          aria-label={t("command.export")}
          onClick={onExportReview}
          disabled={!report}
        >
          <Icon name="download" />
          <span className="command-label-full">{t("command.export")}</span>
          <span className="command-label-short">{t("command.exportShort")}</span>
        </button>
        <div className="language-switch" role="group" aria-label={t("command.language")}>
          {(["en", "zh-CN"] as const).map((option) => (
            <button
              type="button"
              key={option}
              aria-pressed={language === option}
              onClick={() => onLanguageChange(option)}
            >
              {t(`language.${option}`)}
            </button>
          ))}
        </div>
        <details className="command-menu">
          <summary className="button button-secondary" aria-label={t("command.more")}>
            <span className="more-label">{t("command.more")}</span>
            <span className="more-glyph" aria-hidden="true">•••</span>
          </summary>
          <div className="command-menu-popover">
            <p>
              <strong>{t("command.local")}</strong>
              {t("command.localDetail")}
            </p>
            <p className="shortcut-copy">{t("command.shortcuts")}</p>
            <button
              className="menu-danger"
              onClick={onClearProject}
              disabled={!report || sessionMode}
            >
              {t("command.delete")}
            </button>
          </div>
        </details>
      </nav>
    </header>
  );
}
