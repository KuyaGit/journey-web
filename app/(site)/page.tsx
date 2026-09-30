import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { SeedCycleSection } from "@/components/sections/seed-cycle";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { GamificationSection } from "@/components/sections/gamification";
import { VolumesGrid } from "@/components/sections/volumes-grid";
import { FaqSection } from "@/components/sections/faq";
import { DownloadCta } from "@/components/sections/download-cta";
import { softwareApplicationJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const appLd = softwareApplicationJsonLd();

  return (
    <>
      {/* SoftwareApplication structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />

      <HeroSection />
      <TrustStrip />
      <SeedCycleSection />
      <FeatureGrid />
      <GamificationSection />
      <VolumesGrid />
      <FaqSection />
      <DownloadCta />
    </>
  );
}
