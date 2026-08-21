import type { PolicyChange } from "../reviewer-types";

export function WordEvidence({
  change,
  side,
}: {
  change: PolicyChange;
  side: "old" | "new";
}) {
  const operations = change.word_diff ?? [];
  if (!operations.length) {
    return <>{side === "old" ? change.old_block?.text : change.new_block?.text}</>;
  }
  return (
    <>
      {operations.map((operation, index) => {
        const text = side === "old" ? operation.old_text : operation.new_text;
        if (!text) return null;
        const visible =
          operation.operation === "equal"
            ? "equal"
            : side === "old"
              ? operation.operation === "insert"
                ? "hidden"
                : "delete"
              : operation.operation === "delete"
                ? "hidden"
                : "insert";
        if (visible === "hidden") return null;
        const label =
          visible === "delete"
            ? "deleted text"
            : visible === "insert"
              ? "inserted text"
              : undefined;
        return (
          <mark
            aria-label={label}
            className={`word-diff word-${visible}`}
            key={`${operation.operation}-${index}`}
          >
            {text}
          </mark>
        );
      })}
    </>
  );
}
