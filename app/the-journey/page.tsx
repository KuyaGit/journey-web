import type { Metadata } from "next";
import { SectionWrapper } from "@/components/ui/section";
import { DownloadCta } from "@/components/sections/download-cta";
import { seedCycle } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "The Journey — A Filipino Discipleship Framework",
  description:
    "Learn about The Journey discipleship program and the Seed Cycle: GO, GROW, GLOW, and GENERATE — a Taglish framework for church Life Groups.",
  alternates: { canonical: "/the-journey" },
  openGraph: {
    title: "The Journey — A Filipino Discipleship Framework",
    description:
      "Learn about The Journey discipleship program and the Seed Cycle: GO, GROW, GLOW, and GENERATE.",
    url: `${siteConfig.url}/the-journey`,
  },
};

const stepDescriptions: Record<string, string> = {
  go: "The first movement is about intentional, genuine friendship. Before anything else, disciples are made through real relationships. GO teaches you how to step into the everyday lives of people around you — at school, work, or church — with love and purpose.",
  grow: "GROW is about bringing your friends and community into the family of God. This means inviting them to your Life Group, helping them experience worship and belonging, and walking with them through the 3 I's: Invite, Include, and Invest.",
  glow: "GLOW calls you to share your faith clearly and confidently. The BUCAS framework gives you a simple, natural way to talk about the Gospel — in Taglish — so it feels genuine, not rehearsed. Sharing good news is a privilege, not a performance.",
  generate:
    "The Seed Cycle is only complete when you raise up the next generation. GENERATE teaches you the SSS framework and the Leadership Process — so that those you've poured into can pour into others. Discipleship multiplies.",
};

export default function TheJourneyPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "The Journey", url: `${siteConfig.url}/the-journey` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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
            The Program
          </p>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-clay mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Journey
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto">
            A Filipino/English (Taglish) church discipleship program for Life
            Groups. Journey guides you through four movements of the Seed Cycle
            — from building friendships to raising leaders.
          </p>
        </div>
      </section>

      {/* Seed Cycle deep dive */}
      <SectionWrapper className="bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-semibold text-clay text-center mb-12"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Four Movements
          </h2>

          <div className="space-y-0">
            {seedCycle.map((step, i) => (
              <div key={step.id} className="flex gap-6">
                {/* Connector */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: "rgba(224,90,122,0.1)" }}
                  >
                    {step.emoji}
                  </div>
                  {i < seedCycle.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[32px] bg-sand my-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10 flex-1">
                  <h3
                    className="text-xl font-semibold text-clay mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.label}
                    <span className="text-muted font-normal text-base ml-2">
                      — {step.description.split(" — ")[0]}
                    </span>
                  </h3>
                  <p className="text-base text-muted leading-relaxed">
                    {stepDescriptions[step.id]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* About grid */}
      <SectionWrapper className="bg-sand/25">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              q: "Who is it for?",
              a: "Journey is for anyone in a church Life Group — whether you're new to faith or helping others take their first steps. It's designed to feel personal and accessible.",
            },
            {
              q: "How does it work?",
              a: "You learn through quizzes, read the discipleship volumes in the app's book reader, earn XP, and unlock new volumes as you level up. Every session feels rewarding.",
            },
            {
              q: "What's Taglish?",
              a: "Taglish is a natural blend of Filipino (Tagalog) and English — the way many Filipinos speak every day. Journey's content uses both languages so it feels native and personal.",
            },
            {
              q: "Is it free?",
              a: "Yes — Journey is completely free to download and use. The Give screen lets you support the ministry if you've been blessed by your experience.",
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <h3
                className="text-lg font-semibold text-clay mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {q}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <DownloadCta />
    </>
  );
}
