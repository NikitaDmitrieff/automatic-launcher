import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Automatic Launcher - Launch Your Project in 24 Hours",
  description:
    "Lean launch copilot for solo indie hackers. Get actionable launch plans with personalized channel recommendations, outreach playbooks, and launch timelines.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {children}
      </body>
    </html>
  );
}
