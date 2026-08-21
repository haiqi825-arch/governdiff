import type { Metadata } from "next";
import ReviewerWorkspace from "./reviewer-workspace";

export const metadata: Metadata = {
  title: "GovernDiff Reviewer",
  description: "Review policy changes by severity, confidence, and article remapping evidence.",
};

export default function Home() {
  return <ReviewerWorkspace />;
}
