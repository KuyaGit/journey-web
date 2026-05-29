import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { siteConfig } from "@/lib/site-config";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";

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
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  alternates: { canonical: "/" },
  // manifest URL is not auto-prefixed by basePath — prefix manually
  manifest: `${siteConfig.basePath}/manifest.webmanifest`,
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
  const orgLd = organizationJsonLd();
  const webSiteLd = webSiteJsonLd();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-clay">
        {/* Organisation + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
        />

        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
