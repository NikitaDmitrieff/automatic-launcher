import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Automatic Launcher - Launch Your Project in 24 Hours",
    template: "%s | Automatic Launcher",
  },
  description:
    "Lean launch copilot for solo indie hackers. Get personalized channel recommendations, outreach playbooks, and a step-by-step launch timeline.",
  openGraph: {
    title: "Automatic Launcher - Launch Your Project in 24 Hours",
    description:
      "Lean launch copilot for solo indie hackers. Get personalized channel recommendations, outreach playbooks, and a step-by-step launch timeline.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Automatic Launcher - Launch Your Project in 24 Hours",
    description:
      "Lean launch copilot for solo indie hackers. Get personalized channel recommendations, outreach playbooks, and a step-by-step launch timeline.",
  },
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
