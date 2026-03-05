import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Launch Plan",
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
