import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GovernDiff Reviewer",
  description: "Evidence-first policy change review for GovernDiff reports.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "GovernDiff Reviewer",
    description: "Review policy changes by confidence, severity, and article remapping evidence.",
    images: ["/governdiff-reviewer-og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
