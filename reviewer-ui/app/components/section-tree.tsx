import { sectionKey } from "../reviewer-model.mjs";
import type { SectionNode } from "../reviewer-types";

export function SectionTree({
  nodes,
  selected,
  onSelect,
}: {
  nodes: SectionNode[];
  selected: string;
  onSelect: (path: string[]) => void;
}) {
  return (
    <>
      {nodes.map((node) => {
        const key = sectionKey(node.path);
        return (
          <div className="section-branch" key={node.section_id}>
            <button
              aria-pressed={selected === key}
              className={selected === key ? "active" : ""}
              onClick={() => onSelect(node.path)}
            >
              <span>{node.title}</span>
              <b>{node.change_count}</b>
            </button>
            {!!node.children?.length && (
              <div className="section-children">
                <SectionTree
                  nodes={node.children}
                  selected={selected}
                  onSelect={onSelect}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
