import type { Metadata } from "next";
import { StoreBadges } from "@/components/brand/store-badges";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Give — Blessed & Touched",
  description:
    "Been blessed by Grow Together App? Send a love gift to support the discipleship ministry and help more people grow in faith.",
  alternates: { canonical: "/give" },
  openGraph: {
    title: "Give — Blessed & Touched",
    description:
      "Been blessed by Grow Together App? Send a love gift and support the discipleship ministry.",
    url: `${siteConfig.url}/give`,
  },
};

export default function GivePage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Give", url: `${siteConfig.url}/give` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4 sm:px-6"
        style={{
          background:
            "linear-gradient(180deg, #fbf6ef 0%, rgba(224,90,122,0.06) 60%, #fbf6ef 100%)",
        }}
      >
        <div className="max-w-md mx-auto text-center">
          {/* Cross */}
          <div
            className="text-7xl mb-7 animate-pulse-glow inline-block"
            aria-hidden="true"
          >
            ✝️
          </div>

          <h1
            className="text-4xl sm:text-5xl font-semibold text-clay mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Blessed &amp; Touched
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-5 max-w-sm mx-auto">
            If Grow Together has moved you, blessed you, or helped you grow in your
            faith — consider sending a love gift to support the ministry.
          </p>

          <p className="text-sm text-muted/60 italic mb-10 px-4">
            &ldquo;Give, and it will be given to you. A good measure, pressed
            down, shaken together and running over.&rdquo;
            <br />
            — Luke 6:38
          </p>

          {/* CTA */}
          <a
            href="#give"
            className="inline-flex items-center gap-2.5 text-base font-semibold text-cream px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{
              background: "#e05a7a",
              boxShadow: "0 8px 32px 0 rgba(224,90,122,0.35)",
            }}
          >
            <span aria-hidden="true">✝️</span>
            Give a Love Gift
          </a>

          {/* Secondary — store links */}
          <div className="mt-16 pt-8 border-t border-sand">
            <p className="text-sm text-muted mb-5">Don&apos;t have the app yet?</p>
            <div className="flex justify-center">
              <StoreBadges size="md" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
