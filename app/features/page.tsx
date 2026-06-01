import type { Metadata } from "next";
import { SectionWrapper } from "@/components/ui/section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { GamificationSection } from "@/components/sections/gamification";
import { VolumesGrid } from "@/components/sections/volumes-grid";
import { DownloadCta } from "@/components/sections/download-cta";
import { breadcrumbJsonLd, softwareApplicationJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Features — Quiz, Book Reader & Gamification",
  description:
    "Explore Journey's features: Taglish discipleship quizzes, a rich book reader, Seeds & chapters, daily streaks, and volume badges — all built for Filipino church Life Groups.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Journey Features — Quiz, Book Reader & Gamification",
    description:
      "Discipleship quizzes, rich book reader, Seeds & chapters, daily streaks, and volume badges.",
    url: `${siteConfig.url}/features`,
  },
};

const questionTypes = [
  {
    icon: "☑️",
    label: "Multiple Choice",
    desc: "Choose the correct answer from four options.",
  },
  {
    icon: "✅",
    label: "True or False",
    desc: "Decide whether a discipleship statement is true or false.",
  },
  {
    icon: "↔️",
    label: "Swipe Cards",
    desc: "Swipe right to agree or left to disagree with each statement.",
  },
];

export default function FeaturesPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Features", url: `${siteConfig.url}/features` },
  ]);
  const appLd = softwareApplicationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />

      {/* Page hero */}
      <section
        className="py-20 px-4 sm:px-6 text-center"
        style={{
          background: "linear-gradient(180deg, #f3e9dc 0%, #fbf6ef 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-3">
            The App
          </p>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-clay mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Features
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto">
            Everything inside Journey — quizzes, reading, gamification, and
            more.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <FeatureGrid />

      {/* Quiz question types callout */}
      <SectionWrapper className="bg-sand/25">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-semibold text-clay text-center mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three ways to quiz
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {questionTypes.map((qt) => (
              <div
                key={qt.label}
                className="bg-white rounded-2xl p-5 border border-sand text-center"
                style={{ boxShadow: "0 3px 14px 0 rgba(59,42,32,0.05)" }}
              >
                <div className="text-3xl mb-3">{qt.icon}</div>
                <h3
                  className="font-semibold text-clay text-sm mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {qt.label}
                </h3>
                <p className="text-xs text-muted leading-relaxed">{qt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Gamification */}
      <GamificationSection />

      {/* Volumes */}
      <VolumesGrid />

      <DownloadCta />
    </>
  );
}
