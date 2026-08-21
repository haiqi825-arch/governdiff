"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { normalizeState } from "../reviewer-model.mjs";
import { useI18n } from "../i18n";
import type {
  Decisions,
  PolicyChange,
} from "../reviewer-types";

export function confidenceClass(level: string): string {
  return `confidence confidence-${level}`;
}

export function formatScore(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : "—";
}

export function ChangeList({
  changes,
  selectedId,
  batchIds,
  decisions,
  onSelect,
  onToggleBatch,
}: {
  changes: PolicyChange[];
  selectedId: string;
  batchIds: string[];
  decisions: Decisions;
  onSelect: (fingerprint: string) => void;
  onToggleBatch: (fingerprint: string, selected: boolean) => void;
}) {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ scrollTop: 0, height: 720 });
  const rowHeight = 112;
  const overscan = 6;
  const virtualized = changes.length > 200;
  const start = virtualized
    ? Math.max(0, Math.floor(viewport.scrollTop / rowHeight) - overscan)
    : 0;
  const end = virtualized
    ? Math.min(
        changes.length,
        Math.ceil((viewport.scrollTop + viewport.height) / rowHeight) + overscan,
      )
    : changes.length;
  const visibleChanges = useMemo(
    () => changes.slice(start, end),
    [changes, end, start],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const measure = () =>
      setViewport((current) => ({
        scrollTop: container.scrollTop,
        height: container.clientHeight || current.height,
      }));
    measure();
    const observer = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(measure);
    observer?.observe(container);
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !virtualized) return;
    const index = changes.findIndex((change) => change.fingerprint === selectedId);
    if (index < 0) return;
    const top = index * rowHeight;
    const bottom = top + rowHeight;
    if (top < container.scrollTop) container.scrollTop = top;
    else if (bottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = bottom - container.clientHeight;
    }
  }, [changes, selectedId, virtualized]);

  return (
    <div
      aria-label={t("queue.results", { count: changes.length })}
      className="change-list"
      data-rendered-count={visibleChanges.length}
      data-total-count={changes.length}
      onScroll={(event) =>
        setViewport({
          scrollTop: event.currentTarget.scrollTop,
          height: event.currentTarget.clientHeight,
        })
      }
      ref={scrollRef}
      role="list"
      tabIndex={0}
    >
      {virtualized && <div aria-hidden="true" style={{ height: start * rowHeight }} />}
      {visibleChanges.map((change, offset) => {
        const state = normalizeState(
          decisions[change.fingerprint]?.state ?? change.review?.state,
        );
        const selected = selectedId === change.fingerprint;
        const index = start + offset;
        return (
          <div
            className={`change-card-shell ${selected ? "selected" : ""}`}
            key={change.fingerprint}
            role="listitem"
            aria-posinset={index + 1}
            aria-setsize={changes.length}
            id={`change-option-${change.fingerprint}`}
            style={virtualized ? { minHeight: rowHeight } : undefined}
          >
            <label className="batch-check">
              <input
                aria-label={t("queue.selectForBatch", { id: change.fingerprint })}
                type="checkbox"
                checked={batchIds.includes(change.fingerprint)}
                onChange={(event) =>
                  onToggleBatch(change.fingerprint, event.target.checked)
                }
              />
            </label>
            <button
              className="change-card"
              aria-label={t("queue.openChange", {
                position: index + 1,
                total: changes.length,
                summary: change.findings[0]?.summary ?? `${change.change_type} clause`,
                id: change.fingerprint,
              })}
              aria-current={selected ? "true" : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(change.fingerprint)}
            >
              <span className="change-card-top">
                <span className={confidenceClass(change.confidence_level)}>
                  <span>{t("queue.confidence")}</span>
                  <b>{t(`confidence.${change.confidence_level}`)} {formatScore(change.confidence_score)}</b>
                </span>
                <span className={`severity severity-${change.severity}`}>
                  <span>{t("queue.risk")}</span>
                  <b>{change.severity}</b>
                </span>
              </span>
              <strong>
                {change.findings[0]?.summary ?? `${change.change_type} clause`}
              </strong>
              <span className="change-section">{change.section}</span>
              <span className="change-card-bottom">
                <code>{change.fingerprint}</code>
                <span className={`review-state review-${state}`}>{t(`state.${state}`)}</span>
              </span>
            </button>
          </div>
        );
      })}
      {virtualized && (
        <div aria-hidden="true" style={{ height: (changes.length - end) * rowHeight }} />
      )}
      {!changes.length && (
        <p className="empty-state">{t("queue.empty")}</p>
      )}
    </div>
  );
}
