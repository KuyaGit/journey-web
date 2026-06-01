import Link from "next/link";
import { StoreBadges } from "@/components/brand/store-badges";
import { PhoneMockup } from "@/components/brand/phone-mockup";
import { siteConfig } from "@/lib/site-config";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Warm background glows */}
      <div
        className="absolute top-[-15%] right-[-8%] w-[520px] h-[520px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(224,90,122,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-6%] w-[400px] h-[400px] rounded-full pointer-events-none animate-pulse-glow delay-400"
        style={{
          background:
            "radial-gradient(circle, rgba(232,162,61,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* ── Copy ── */}
          <div className="flex-1 text-center md:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-rose/10 text-rose text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 animate-fade-in">
              <span aria-hidden="true">🌱</span>
              <span>Discipleship for Life Groups</span>
            </div>

            <h1
              className="text-[2.75rem] sm:text-5xl md:text-[3.5rem] font-semibold text-clay leading-[1.1] tracking-tight mb-5 animate-fade-up"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Grow in faith.
              <br />
              <span className="text-rose">One day at a time.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed mb-8 max-w-md mx-auto md:mx-0 animate-fade-up delay-100">
              Journey is a Taglish discipleship quiz &amp; reading app for
              church Life Groups — built around the Seed Cycle. Earn Seeds, unlock
              volumes, and go deeper every day.
            </p>

            <div className="flex flex-col items-center md:items-start gap-3 animate-fade-up delay-200">
              <StoreBadges size="md" />
              <Link
                href={siteConfig.storeLinks.webApp}
                className="text-sm text-muted hover:text-rose transition-colors inline-flex items-center gap-1 mt-1"
              >
                Or open the web app
                <span aria-hidden="true" className="ml-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* ── Phone mockup ── */}
          <div className="flex-shrink-0 animate-fade-in delay-200">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
