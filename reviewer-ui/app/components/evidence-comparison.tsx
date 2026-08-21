import { WordEvidence } from "./word-evidence";
import { CollapsibleContent } from "./collapsible-content";
import { useI18n } from "../i18n";
import type { Block, PolicyChange } from "../reviewer-types";

export function changeBlocks(
  change: PolicyChange,
  side: "old" | "new",
): Block[] {
  const multiple = side === "old" ? change.old_blocks : change.new_blocks;
  const single = side === "old" ? change.old_block : change.new_block;
  const values = multiple?.length ? multiple : single ? [single] : [];
  const seen = new Set<string>();
  return values.filter((block) => {
    if (!block || seen.has(block.block_id)) return false;
    seen.add(block.block_id);
    return true;
  });
}

function pageLabel(block: Block): string {
  if (block.page_start != null) {
    return block.page_end != null && block.page_end !== block.page_start
      ? `Pages ${block.page_start}–${block.page_end}`
      : `Page ${block.page_start}`;
  }
  if (block.paragraph_start != null) {
    return block.paragraph_end != null && block.paragraph_end !== block.paragraph_start
      ? `Paragraphs ${block.paragraph_start}–${block.paragraph_end}`
      : `Paragraph ${block.paragraph_start}`;
  }
  return block.line_end !== block.line_start
    ? `Lines ${block.line_start}–${block.line_end}`
    : `Line ${block.line_start}`;
}

function BlockEvidence({ block, index }: { block: Block; index: number }) {
  const { t } = useI18n();
  const section = block.section?.length
    ? block.section.join(" › ")
    : block.section_label || "Unsectioned";
  return (
    <article className="evidence-block">
      <header>
        <span>{t("evidence.block", { index: index + 1 })}</span>
        <code>{block.evidence_label ?? pageLabel(block)}</code>
      </header>
      <div className="block-location">
        <span>{section}</span>
        <b>{pageLabel(block)}</b>
      </div>
      <CollapsibleContent
        className="evidence-block-copy"
        text={block.text}
        threshold={560}
      />
      <details className="block-context">
        <summary>{t("evidence.context")}</summary>
        <dl>
          <div><dt>{t("evidence.stableId")}</dt><dd>{block.block_id}</dd></div>
          <div><dt>{t("evidence.section")}</dt><dd>{section}</dd></div>
          <div><dt>{t("evidence.location")}</dt><dd>{pageLabel(block)}</dd></div>
          <div><dt>{t("evidence.type")}</dt><dd>{block.block_type ?? "text"}</dd></div>
          {block.table_id && (
            <div>
              <dt>{t("evidence.table")}</dt>
              <dd>{block.table_id} · row {block.table_row ?? "—"} · column {block.table_column ?? "—"}</dd>
            </div>
          )}
        </dl>
      </details>
    </article>
  );
}

function EvidenceSide({
  change,
  side,
}: {
  change: PolicyChange;
  side: "old" | "new";
}) {
  const { t } = useI18n();
  const blocks = changeBlocks(change, side);
  return (
    <section className={`evidence-side evidence-${side === "old" ? "before" : "after"}`}>
      <div className="evidence-side-heading">
        <div>
          <span>{side === "old" ? t("evidence.before") : t("evidence.after")}</span>
          <strong>{t("evidence.blockCount", { count: blocks.length })}</strong>
        </div>
        <span>{side === "old" ? change.old_article ?? t("evidence.noArticle") : change.new_article ?? t("evidence.noArticle")}</span>
      </div>
      <div className="evidence-block-list">
        {blocks.length ? (
          blocks.map((block, index) => (
            <BlockEvidence block={block} index={index} key={block.block_id} />
          ))
        ) : (
          <p className="evidence-empty">
            {side === "old"
              ? t("evidence.noPrevious")
              : t("evidence.noCurrent")}
          </p>
        )}
      </div>
      {!!change.word_diff?.length && (
        <div className="word-diff-summary">
          <span>{t("evidence.emphasis")}</span>
          <p><WordEvidence change={change} side={side} /></p>
        </div>
      )}
    </section>
  );
}

export function EvidenceComparison({ change }: { change: PolicyChange }) {
  const { t } = useI18n();
  return (
    <div className="evidence-comparison" aria-label={t("evidence.beforeAfter")}>
      <EvidenceSide change={change} side="old" />
      <EvidenceSide change={change} side="new" />
    </div>
  );
}
