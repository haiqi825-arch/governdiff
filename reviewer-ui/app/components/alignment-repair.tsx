"use client";

import { useMemo, useState } from "react";

import { useI18n } from "../i18n";
import type { Block, PolicyChange } from "../reviewer-types";

function blockLocation(block: Block): string {
  if (block.page_start != null) return `p. ${block.page_start}`;
  if (block.paragraph_start != null) return `¶ ${block.paragraph_start}`;
  return `L${block.line_start}`;
}

function matches(block: Block, query: string): boolean {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return true;
  return [block.block_id, block.section_label, ...(block.section ?? []), block.text]
    .join(" ")
    .toLocaleLowerCase()
    .includes(term);
}

function BlockPicker({
  side,
  blocks,
  selected,
  onToggle,
}: {
  side: "old" | "new";
  blocks: Block[];
  selected: string[];
  onToggle: (id: string, checked: boolean) => void;
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const visible = useMemo(() => blocks.filter((block) => matches(block, query)), [blocks, query]);
  return (
    <section className="alignment-picker">
      <header>
        <div><span>{side === "old" ? t("alignment.previous") : t("alignment.current")}</span><strong>{t("alignment.selected", { count: selected.length })}</strong></div>
      </header>
      <input
        type="search"
        value={query}
        aria-label={side === "old" ? t("alignment.searchPrevious") : t("alignment.searchCurrent")}
        placeholder={side === "old" ? t("alignment.searchPrevious") : t("alignment.searchCurrent")}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="alignment-block-list">
        {visible.map((block) => (
          <label key={block.block_id} className={selected.includes(block.block_id) ? "selected" : ""}>
            <input type="checkbox" checked={selected.includes(block.block_id)} onChange={(event) => onToggle(block.block_id, event.target.checked)} />
            <span>
              <strong>{block.section_label || "—"}</strong>
              <small>{block.block_id} · {blockLocation(block)}</small>
              <span>{block.text.slice(0, 180)}</span>
            </span>
          </label>
        ))}
        {!visible.length && <p className="empty-state">{t("alignment.empty")}</p>}
      </div>
    </section>
  );
}

function PreviewList({ title, ids, blocks }: { title: string; ids: string[]; blocks: Block[] }) {
  return (
    <div>
      <span>{title}</span>
      <strong>{ids.length}</strong>
      <ul>{ids.map((id) => <li key={id}>{blocks.find((block) => block.block_id === id)?.section_label ?? id}<small>{id}</small></li>)}</ul>
    </div>
  );
}

export function AlignmentRepair({
  change,
  oldBlocks,
  newBlocks,
  initialOldIds,
  initialNewIds,
  onApply,
  onCancel,
}: {
  change: PolicyChange;
  oldBlocks: Block[];
  newBlocks: Block[];
  initialOldIds: string[];
  initialNewIds: string[];
  onApply: (oldIds: string[], newIds: string[]) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [oldIds, setOldIds] = useState(initialOldIds);
  const [newIds, setNewIds] = useState(initialNewIds);
  const [preview, setPreview] = useState(false);
  const machineOldIds = (change.old_blocks ?? [change.old_block]).filter(Boolean).map((block) => block!.block_id);
  const machineNewIds = (change.new_blocks ?? [change.new_block]).filter(Boolean).map((block) => block!.block_id);
  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, id: string, checked: boolean) => setter((current) => checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id));
  return (
    <div className="alignment-form">
      <div className="alignment-pickers">
        <BlockPicker side="old" blocks={oldBlocks} selected={oldIds} onToggle={(id, checked) => toggle(setOldIds, id, checked)} />
        <BlockPicker side="new" blocks={newBlocks} selected={newIds} onToggle={(id, checked) => toggle(setNewIds, id, checked)} />
      </div>
      {preview && (
        <section className="alignment-preview" aria-label={t("alignment.preview")}>
          <PreviewList title={t("alignment.original")} ids={[...machineOldIds, ...machineNewIds]} blocks={[...oldBlocks, ...newBlocks]} />
          <PreviewList title={t("alignment.proposedOld")} ids={oldIds} blocks={oldBlocks} />
          <PreviewList title={t("alignment.proposedNew")} ids={newIds} blocks={newBlocks} />
          <div className="alignment-impact"><span>{t("alignment.impact")}</span><p>{t("alignment.impactDetail")}</p></div>
        </section>
      )}
      <div className="alignment-actions">
        {!preview ? (
          <button className="button button-primary" disabled={!oldIds.length || !newIds.length} onClick={() => setPreview(true)}>{t("alignment.preview")}</button>
        ) : (
          <button className="button button-primary" disabled={!oldIds.length || !newIds.length} onClick={() => onApply(oldIds, newIds)}>{t("alignment.apply")}</button>
        )}
        <button className="button button-secondary" onClick={onCancel}>{t("alignment.cancel")}</button>
      </div>
    </div>
  );
}
