import Link from "next/link";
import { StoreBadges } from "@/components/brand/store-badges";
import { siteConfig } from "@/lib/site-config";

export function DownloadCta() {
  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:px-6"
      style={{
        background: "linear-gradient(135deg, #e05a7a 0%, #e8a23d 100%)",
      }}
    >
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbf6ef 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Soft glow blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(251,246,239,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="text-5xl mb-5" aria-hidden="true">
          🌱
        </div>
        <h2
          className="text-3xl sm:text-4xl font-semibold text-cream mb-4 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to start your journey?
        </h2>
        <p className="text-cream/80 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Download Journey today and take your first step in the Seed Cycle —
          completely free.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-5">
          <StoreBadges size="lg" variant="light" />
        </div>

        <Link
          href={siteConfig.storeLinks.webApp}
          className="text-sm text-cream/70 hover:text-cream transition-colors inline-flex items-center gap-1"
        >
          Or open the web app
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </section>
  );
}
