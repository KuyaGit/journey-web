import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SectionWrapper } from "@/components/ui/section";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

// Set this to the day this version goes live (the day the pull request is merged).
const EFFECTIVE_DATE = "24 October 2026";

const DESCRIPTION =
  "How Grow handles your data: your progress stays on your device, and a Life Group request you choose to send is stored and emailed to the leader you pick.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/data-privacy" },
  openGraph: {
    title: "Privacy Policy — Grow",
    description: DESCRIPTION,
    url: `${siteConfig.url}/data-privacy`,
  },
};

function PolicySection({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <h2
        className="text-xl font-semibold text-clay mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc list-inside space-y-1.5 text-base leading-relaxed pl-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

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
            <strong>Effective date:</strong> {EFFECTIVE_DATE}
          </p>
          <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto">
            Most of Grow stays on your device. If you choose to send a Life
            Group request, the details you enter are stored by us and emailed to
            the leader you chose. We do not sell your information and we do not
            use it for advertising.
          </p>
        </div>
      </section>

      {/* Policy body */}
      <SectionWrapper className="bg-cream">
        <div className="max-w-3xl mx-auto space-y-10 text-muted">
          <PolicySection title="Information we collect">
            <p>
              <strong>On your device only</strong> (never sent to us):
            </p>
            <BulletList
              items={[
                "reading progress and reading streak",
                "quiz scores, hearts, and completed volumes",
                "Seeds, Chapters, and earned badges",
                "whether you have seen the first-launch onboarding",
                "a saved draft of your Life Group form",
              ]}
            />
            <p>
              This is kept in your device&apos;s app storage. If you uninstall
              the app, it is removed.
            </p>
            <p>
              <strong>Only if you send a Life Group request:</strong> your full
              name, email address, mobile number, and Messenger name or link.
              If you choose to, you can also give your Facebook or Instagram,
              age, location, occupation or school, a short introduction, and
              your reason for joining. You also choose your gender group and
              life stage and, if you choose LGBT, the group you are most
              comfortable joining.
            </p>
            <p>
              <strong>
                Your gender group choice, and the LGBT option in particular, can
                reveal sensitive personal information about you.
              </strong>{" "}
              You only give it by sending a request, and we use it only to match
              you with a suitable leader and let that leader know.
            </p>
            <p>
              We also keep the leader you chose, the status of your request, the
              times it was sent and changed, and a one-way scrambled (hashed)
              form of your internet address, which we use only to stop spam. We
              do not keep your internet address itself.
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="Why we use it, and who receives it">
            <BulletList
              items={[
                "To connect you with the leader you chose. We email your request, including every detail above, to that leader. After that the leader holds your details in their own email and is responsible for them. We ask leaders to use them only to contact you about Life Group membership.",
                "To show you the status of your request and to email you when it changes, for example when the leader accepts.",
                "To keep the service safe and working, such as spam limits and finding emails that failed to send.",
              ]}
            />
            <p>
              Our service providers handle your request only to run the
              service: Supabase (our database, hosted in Sydney, Australia), our
              own email automation server, and our mail provider. Hygraph holds
              the leaders&apos; public profiles and holds no information about
              you.
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="How long we keep it">
            <p>
              We delete a Life Group request 12 months after it was last
              updated. You can ask us to delete it sooner (see below).
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="Your choices and rights">
            <p>
              Sending a request is optional. You may ask us to show you, correct
              or delete your information, to stop using it, or to withdraw your
              consent, by emailing the address below. We will answer within a
              reasonable time.
            </p>
            <p>
              Deleting your request from our records does not remove the email
              the leader has already received, so we will also ask that leader
              to delete it. If you are in the Philippines, you may also complain
              to the National Privacy Commission.
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="Status access code">
            <p>
              After you send a request, the app keeps a private access code on
              your device so it can show you the status. It is not shared with
              anyone.
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="No accounts, ads, or analytics">
            <p>
              Grow has no sign-in or user accounts, shows no ads, and includes
              no analytics or crash-reporting services.
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="Security">
            <p>
              Requests are sent over an encrypted connection and are stored in a
              database that the app cannot read directly. Access codes are
              stored only in scrambled form. No system is perfectly secure, so
              please share only what you are comfortable with.
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection
            title={<>The &ldquo;Give&rdquo; feature</>}
          >
            <p>
              The Give screen displays giving information (such as bank-transfer
              details) so you can give externally if you choose. It only{" "}
              <em>displays</em> this information. No payment is collected or
              processed inside the app.
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="Children's privacy">
            <p>The app is for people aged 13 and older.</p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="Changes to this policy">
            <p>
              We may update this policy from time to time. The effective date
              above shows the latest version, and we will update the app if the
              way we handle your information changes.
            </p>
          </PolicySection>

          <hr className="border-sand" />

          <PolicySection title="Contact">
            <p>
              Questions or requests about your information:{" "}
              <a
                href={`mailto:${siteConfig.organization.email}`}
                className="text-rose hover:text-rose-deep underline underline-offset-2 transition-colors"
              >
                {siteConfig.organization.email}
              </a>
            </p>
          </PolicySection>
        </div>
      </SectionWrapper>
    </>
  );
}
