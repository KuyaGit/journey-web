import type { Metadata } from "next";
import { SectionWrapper } from "@/components/ui/section";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Grow Together handles your data — nothing is collected, stored, or shared. Everything stays on your device.",
  alternates: { canonical: "/data-privacy" },
  openGraph: {
    title: "Privacy Policy — Grow Together",
    description:
      "How Grow Together handles your data — nothing is collected, stored, or shared. Everything stays on your device.",
    url: `${siteConfig.url}/data-privacy`,
  },
};

export default function DataPrivacyPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Privacy Policy", url: `${siteConfig.url}/data-privacy` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <section
        className="py-20 px-4 sm:px-6 text-center"
        style={{
          background: "linear-gradient(180deg, #f3e9dc 0%, #fbf6ef 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-3">
            Legal
          </p>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-clay mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-muted mb-2">
            <strong>Effective date:</strong> 27 June 2026
          </p>
          <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto">
            Grow Together does not collect, store, or share any personal data.
            Everything you do in the app stays on your device.
          </p>
        </div>
      </section>

      {/* Policy body */}
      <SectionWrapper className="bg-cream">
        <div className="max-w-3xl mx-auto space-y-10 text-muted">

          {/* Information we collect */}
          <div>
            <h2
              className="text-xl font-semibold text-clay mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Information we collect
            </h2>
            <p className="text-base leading-relaxed mb-4">
              None of your information is transmitted to us or any third party.
              The app saves the following <strong>only on your device</strong>,
              to track your progress:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-base leading-relaxed pl-2">
              <li>reading progress and reading streak</li>
              <li>quiz scores, hearts, and completed volumes</li>
              <li>Seeds, Chapters, and earned badges</li>
              <li>whether you have seen the first-launch onboarding</li>
            </ul>
            <p className="text-base leading-relaxed mt-4">
              This data is stored locally using your device&apos;s standard app
              storage (AsyncStorage). It never leaves your device and is not
              accessible to us.
            </p>
          </div>

          <hr className="border-sand" />

          {/* How your data is stored */}
          <div>
            <h2
              className="text-xl font-semibold text-clay mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How your data is stored
            </h2>
            <p className="text-base leading-relaxed">
              All progress is kept locally on your device. If you uninstall the
              app, this locally stored data is removed.
            </p>
          </div>

          <hr className="border-sand" />

          {/* No accounts, ads, or analytics */}
          <div>
            <h2
              className="text-xl font-semibold text-clay mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No accounts, ads, or analytics
            </h2>
            <p className="text-base leading-relaxed">
              Grow Together has no sign-in or user accounts, shows no ads, and
              includes no analytics or crash-reporting services. The app has no
              backend server and does not make network requests to transmit your
              data.
            </p>
          </div>

          <hr className="border-sand" />

          {/* The Give feature */}
          <div>
            <h2
              className="text-xl font-semibold text-clay mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The &ldquo;Give&rdquo; feature
            </h2>
            <p className="text-base leading-relaxed">
              The Give screen displays giving information (such as bank-transfer
              details) so you can give externally if you choose. It only{" "}
              <em>displays</em> this information — no payment is collected or
              processed inside the app.
            </p>
          </div>

          <hr className="border-sand" />

          {/* Children's privacy */}
          <div>
            <h2
              className="text-xl font-semibold text-clay mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Children&apos;s privacy
            </h2>
            <p className="text-base leading-relaxed">
              The app is intended for users aged 13 and older and is not
              directed at children. We do not knowingly collect any data from
              anyone.
            </p>
          </div>

          <hr className="border-sand" />

          {/* Third-party services */}
          <div>
            <h2
              className="text-xl font-semibold text-clay mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Third-party services
            </h2>
            <p className="text-base leading-relaxed">
              The app does not use third-party services that collect your data.
            </p>
          </div>

          <hr className="border-sand" />

          {/* Changes to this policy */}
          <div>
            <h2
              className="text-xl font-semibold text-clay mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Changes to this policy
            </h2>
            <p className="text-base leading-relaxed">
              We may update this policy from time to time. The effective date
              above reflects the latest version.
            </p>
          </div>

          <hr className="border-sand" />

          {/* Contact */}
          <div>
            <h2
              className="text-xl font-semibold text-clay mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contact
            </h2>
            <p className="text-base leading-relaxed">
              Questions about this policy:{" "}
              <a
                href="mailto:montealtomarklowel@gmail.com"
                className="text-rose hover:text-rose-deep underline underline-offset-2 transition-colors"
              >
                montealtomarklowel@gmail.com
              </a>
            </p>
          </div>

        </div>
      </SectionWrapper>
    </>
  );
}
