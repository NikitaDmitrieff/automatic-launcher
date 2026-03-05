import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Launch Plan",
};

export default function LaunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
