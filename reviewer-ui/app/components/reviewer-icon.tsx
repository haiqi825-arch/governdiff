export type ReviewerIconName =
  | "upload"
  | "download"
  | "search"
  | "arrow"
  | "check";

export function ReviewerIcon({ name }: { name: ReviewerIconName }) {
  const paths = {
    upload: (
      <>
        <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
        <path d="M5 15v4h14v-4" />
      </>
    ),
    download: (
      <>
        <path d="M12 4v12m0 0l4.5-4.5M12 16l-4.5-4.5" />
        <path d="M5 20h14" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5L21 21" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14m-5-5l5 5-5 5" />
      </>
    ),
    check: <path d="M5 12.5l4.2 4L19 7" />,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
