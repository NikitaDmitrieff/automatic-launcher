import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-code",
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
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light')}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-page)] font-[family-name:var(--font-body)]">
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
