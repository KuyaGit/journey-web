import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

// ── Fonts ──────────────────────────────────────────────────────────────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  // Fraunces is a variable font — no explicit weight array required
});

// ── Root metadata ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Journey — Discipleship Quiz & Reading App",
    template: "%s · Journey",
  },
  description: siteConfig.description,
  keywords: [
    "discipleship",
    "quiz app",
    "church",
    "life group",
    "Filipino",
    "Taglish",
    "seed cycle",
    "GO GROW GLOW GENERATE",
    "Bible study",
    "faith app",
    "iOS",
    "Android",
  ],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.organization.name }],
  creator: siteConfig.organization.name,
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Journey — Discipleship Quiz & Reading App",
    description: siteConfig.description,
    // og:image is auto-generated from app/opengraph-image.tsx (file convention)
    // with the correct basePath-prefixed URL via metadataBase — no manual override needed
  },
  twitter: {
    card: "summary_large_image",
    title: "Journey — Discipleship Quiz & Reading App",
    description: siteConfig.description,
    // twitter:image likewise auto-generated from the file convention
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
};

// ── Viewport (separate from metadata — Next.js 16 requirement) ─────────────
export const viewport: Viewport = {
  themeColor: "#e05a7a",
  width: "device-width",
  initialScale: 1,
};

// ── Root layout ────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Header, footer and JSON-LD live in app/(site)/layout.tsx so /admin stays free of marketing chrome.
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-clay">{children}</body>
    </html>
  );
}
