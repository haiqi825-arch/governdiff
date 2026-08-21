"use client";

import { useState } from "react";

import { ChangeList } from "./change-list";
import { ReviewerIcon as Icon } from "./reviewer-icon";
import { SectionTree } from "./section-tree";
import { useI18n } from "../i18n";
import { normalizeState, sectionKey } from "../reviewer-model.mjs";
import type {
  Decisions,
  PolicyChange,
  Report,
  ReviewerFilters,
  SavedView,
} from "../reviewer-types";

const changeTypes = [
  "added",
  "removed",
  "modified",
  "split",
  "merged",
  "moved",
  "format_only",
];

function activeFilterCount(filters: ReviewerFilters): number {
  return [
    filters.query,
    filters.confidence !== "all",
    filters.changeType !== "all",
    filters.sectionFilter,
    filters.breakingOnly,
    filters.unreviewedOnly,
    filters.hideFormatOnly,
  ].filter(Boolean).length;
}

export function ReviewQueue({
  report,
  changes,
  filters,
  selectedId,
  batchIds,
  decisions,
  savedViews,
  mobileActive,
  onFilterChange,
  onResetFilters,
  onApplyFilters,
  onSaveView,
  onApplyView,
  onDeleteView,
  onSelect,
  onToggleBatch,
  onSelectVisible,
  onClearSelection,
  onBatchDecision,
}: {
  report: Report;
  changes: PolicyChange[];
  filters: ReviewerFilters;
  selectedId: string;
  batchIds: string[];
  decisions: Decisions;
  savedViews: SavedView[];
  mobileActive: boolean;
  onFilterChange: <K extends keyof ReviewerFilters>(
    name: K,
    value: ReviewerFilters[K],
  ) => void;
  onResetFilters: () => void;
  onApplyFilters: (filters: ReviewerFilters) => void;
  onSaveView: (name: string) => boolean;
  onApplyView: (id: string) => void;
  onDeleteView: (id: string) => void;
  onSelect: (fingerprint: string) => void;
  onToggleBatch: (fingerprint: string, checked: boolean) => void;
  onSelectVisible: () => void;
  onClearSelection: () => void;
  onBatchDecision: (state: "confirmed" | "rejected") => void;
}) {
  const { t } = useI18n();
  const [viewName, setViewName] = useState("");
  const [selectedViewId, setSelectedViewId] = useState("");
  const count = activeFilterCount(filters);
  const queueReviewed = changes.filter(
    (change) => normalizeState(decisions[change.fingerprint]?.state ?? change.review?.state) !== "unreviewed",
  ).length;
  const chips: Array<{ key: keyof ReviewerFilters; label: string; reset: ReviewerFilters[keyof ReviewerFilters] }> = [];
  if (filters.query) chips.push({ key: "query", label: `“${filters.query}”`, reset: "" });
  if (filters.confidence !== "all") chips.push({ key: "confidence", label: `${t("queue.confidence")}: ${t(`confidence.${filters.confidence}`)}`, reset: "all" });
  if (filters.changeType !== "all") chips.push({ key: "changeType", label: `${t("queue.type")}: ${filters.changeType}`, reset: "all" });
  if (filters.sectionFilter) chips.push({ key: "sectionFilter", label: `${t("queue.chapter")}: ${filters.sectionFilter.split("\u001f").at(-1)}`, reset: "" });
  if (filters.breakingOnly) chips.push({ key: "breakingOnly", label: t("queue.breakingOnly"), reset: false });
  if (filters.unreviewedOnly) chips.push({ key: "unreviewedOnly", label: t("queue.unreviewedOnly"), reset: false });
  if (filters.hideFormatOnly) chips.push({ key: "hideFormatOnly", label: t("queue.hideFormat"), reset: false });

  function applyQuickView(kind: "breaking" | "low") {
    onApplyFilters({
      ...filters,
      query: "",
      confidence: kind === "breaking" ? "high" : "low",
      changeType: "all",
      sectionFilter: "",
      breakingOnly: kind === "breaking",
      unreviewedOnly: kind === "low",
      hideFormatOnly: false,
      sortBy: kind === "breaking" ? "risk" : "unreviewed",
    });
  }

  return (
    <section
      className="workspace-pane queue-pane"
      id="mobile-panel-queue"
      role="tabpanel"
      aria-labelledby="mobile-tab-queue"
      data-mobile-active={mobileActive}
    >
      <div className="pane-heading queue-heading">
        <div>
          <span>{t("queue.title")}</span>
          <strong>{t("queue.visible", { count: changes.length })}</strong>
          <small>{t("queue.progress", { reviewed: queueReviewed, total: changes.length })}</small>
        </div>
        <b>{report.summary.total_changes}</b>
      </div>

      <div className="queue-mode" role="group" aria-label={t("queue.sort")}>
        <button
          aria-pressed={filters.sortBy === "document"}
          onClick={() => onFilterChange("sortBy", "document")}
        >
          {t("queue.documentMode")}
        </button>
        <button
          aria-pressed={filters.sortBy === "risk"}
          onClick={() => onFilterChange("sortBy", "risk")}
        >
          {t("queue.riskMode")}
        </button>
      </div>

      <label className="queue-search">
        <Icon name="search" />
        <span className="sr-only">{t("queue.search")}</span>
        <input
          value={filters.query}
          onChange={(event) => onFilterChange("query", event.target.value)}
          placeholder={t("queue.searchPlaceholder")}
        />
      </label>

      <label className="queue-sort">
        <span>{t("queue.sort")}</span>
        <select
          value={filters.sortBy}
          onChange={(event) => onFilterChange("sortBy", event.target.value as ReviewerFilters["sortBy"])}
        >
          <option value="document">{t("queue.sort.document")}</option>
          <option value="risk">{t("queue.sort.risk")}</option>
          <option value="unreviewed">{t("queue.sort.unreviewed")}</option>
        </select>
      </label>

      {chips.length > 0 && (
        <div className="active-filter-bar" aria-label={t("queue.activeFilters")}>
          <div>
            {chips.map((chip) => (
              <button
                key={chip.key}
                title={t("queue.removeFilter", { label: chip.label })}
                onClick={() => onFilterChange(chip.key, chip.reset)}
              >
                {chip.label}<span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
          <button className="clear-all-filters" onClick={onResetFilters}>{t("queue.clearAll")}</button>
        </div>
      )}

      <details className="queue-controls">
        <summary>
          <span>{t("queue.filtersBatch")}</span>
          <b>{count ? t("queue.activeCount", { count }) : t("queue.allChanges")}</b>
        </summary>
        <div className="queue-controls-body">
          <fieldset>
            <legend>{t("queue.confidence")}</legend>
            <div className="segment">
              {(["all", "high", "medium", "low"] as const).map((level) => (
                <button
                  type="button"
                  aria-pressed={filters.confidence === level}
                  key={level}
                  className={filters.confidence === level ? "active" : ""}
                  onClick={() => onFilterChange("confidence", level)}
                >
                  {t(`confidence.${level}`)}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="select-filter">
            {t("queue.type")}
            <select
              value={filters.changeType}
              onChange={(event) => onFilterChange("changeType", event.target.value)}
            >
              <option value="all">{t("queue.all")}</option>
              {changeTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <div className="queue-checks">
            <label><input type="checkbox" checked={filters.breakingOnly} onChange={(event) => onFilterChange("breakingOnly", event.target.checked)} />{t("queue.breakingOnly")}</label>
            <label><input type="checkbox" checked={filters.unreviewedOnly} onChange={(event) => onFilterChange("unreviewedOnly", event.target.checked)} />{t("queue.unreviewedOnly")}</label>
            <label><input type="checkbox" checked={filters.hideFormatOnly} onChange={(event) => onFilterChange("hideFormatOnly", event.target.checked)} />{t("queue.hideFormat")}</label>
          </div>
          <details className="chapter-filter">
            <summary>{t("queue.chapter")}</summary>
            <div className="section-list">
              <button className={!filters.sectionFilter ? "active" : ""} aria-pressed={!filters.sectionFilter} onClick={() => onFilterChange("sectionFilter", "")}>
                <span>{t("queue.allChapters")}</span><b>{report.summary.total_changes}</b>
              </button>
              <SectionTree nodes={report.section_tree ?? []} selected={filters.sectionFilter} onSelect={(path) => onFilterChange("sectionFilter", sectionKey(path))} />
            </div>
          </details>
          <button className="reset-filters" onClick={onResetFilters}>{t("queue.clearAll")}</button>

          <section className="saved-views" aria-label={t("queue.savedViews")}>
            <div className="saved-view-heading">
              <strong>{t("queue.savedViews")}</strong>
              <div className="quick-views">
                <button onClick={() => applyQuickView("breaking")}>High-confidence Breaking</button>
                <button onClick={() => applyQuickView("low")}>Low-confidence review</button>
              </div>
            </div>
            <label>
              <span>{t("queue.viewName")}</span>
              <input value={viewName} maxLength={40} placeholder={t("queue.viewPlaceholder")} onChange={(event) => setViewName(event.target.value)} />
            </label>
            <button className="button button-secondary" onClick={() => { if (onSaveView(viewName)) setViewName(""); }}>{t("queue.saveView")}</button>
            <small>{t("queue.duplicateView")}</small>
            {savedViews.length ? (
              <div className="saved-view-apply">
                <label>
                  <span>{t("queue.applyView")}</span>
                  <select value={selectedViewId} onChange={(event) => setSelectedViewId(event.target.value)}>
                    <option value="">{t("queue.chooseView")}</option>
                    {savedViews.map((view) => <option value={view.id} key={view.id}>{view.name}</option>)}
                  </select>
                </label>
                <button disabled={!selectedViewId} onClick={() => onApplyView(selectedViewId)}>{t("queue.applyView")}</button>
                <button className="menu-danger" disabled={!selectedViewId} onClick={() => onDeleteView(selectedViewId)}>{t("queue.deleteView")}</button>
              </div>
            ) : <small>{t("queue.noViews")}</small>}
          </section>

          <div className="batch-actions">
            <strong>{t("queue.selection", { selected: batchIds.length, visible: changes.length })}</strong>
            <p>{t("queue.batchScope")}</p>
            <button className="button button-secondary" onClick={onSelectVisible}>{t("queue.selectVisible")}</button>
            <button className="button button-secondary" onClick={onClearSelection}>{t("queue.clearSelection")}</button>
            <button className="button button-secondary" onClick={() => onBatchDecision("confirmed")}>{t("queue.confirmSelected")}</button>
            <button className="button button-secondary" onClick={() => onBatchDecision("rejected")}>{t("queue.rejectSelected")}</button>
          </div>
        </div>
      </details>

      <ChangeList changes={changes} selectedId={selectedId} batchIds={batchIds} decisions={decisions} onSelect={onSelect} onToggleBatch={onToggleBatch} />
    </section>
  );
}
