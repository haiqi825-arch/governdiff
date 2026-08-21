"use client";

import { useState } from "react";

import { useI18n } from "../i18n";

export function CollapsibleContent({
  children,
  text,
  className = "",
  threshold = 220,
  alwaysVisible = false,
}: {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  threshold?: number;
  alwaysVisible?: boolean;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const long = !alwaysVisible && (text?.length ?? 0) > threshold;
  return (
    <div className={`collapsible-content ${long && !expanded ? "is-collapsed" : ""} ${className}`.trim()}>
      <div>{children ?? text}</div>
      {long && (
        <button type="button" onClick={() => setExpanded((current) => !current)}>
          {expanded ? t("content.collapse") : t("content.expand")}
        </button>
      )}
    </div>
  );
}
