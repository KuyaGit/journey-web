import type { Metadata } from "next";
import Link from "next/link";

// Where a Life Group leader lands after tapping "Accept" in the join request email.
// Static and public: it holds no applicant details, so anyone who opens the link sees only this thank-you.
// Kept out of search results and the sitemap because it is not meant to be found, only reached from the email.
export const metadata: Metadata = {
  title: "Thank You, Leader",
  description: "Thank you for saying yes to walking with someone in their faith.",
  robots: { index: false, follow: false },
};

export default function LeaderThanksPage() {
  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4 sm:px-6"
      style={{
        background:
          "linear-gradient(180deg, #fbf6ef 0%, rgba(124,154,130,0.12) 60%, #fbf6ef 100%)",
      }}
    >
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-7 inline-block" aria-hidden="true">
          🌱
        </div>

        <h1
          className="text-4xl sm:text-5xl font-semibold text-clay mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Thank you for saying yes
        </h1>

        <p className="text-lg text-muted leading-relaxed mb-5 max-w-sm mx-auto">
          Because of you, someone won&apos;t have to walk their faith alone. We&apos;re
          grateful for your time, your patience, and your heart for people.
        </p>

        <p className="text-base text-muted leading-relaxed mb-5 max-w-sm mx-auto">
          Discipleship rarely looks big. It&apos;s a message that says &ldquo;how are
          you?&rdquo;, a prayer said quietly, a seat saved at the table. Your yes is
          where it begins, and the person you&apos;re about to meet will remember it.
        </p>

        <p className="text-sm text-muted/60 italic mb-10 px-4">
          &ldquo;Therefore go and make disciples.&rdquo;
          <br />
          — Matthew 28:19
        </p>

        <div className="rounded-2xl border border-sand bg-sand/40 px-6 py-5 text-left">
          <p className="text-sm font-semibold text-clay mb-1">What happens next</p>
          <p className="text-sm text-muted leading-relaxed">
            We&apos;ve let the applicant know you accepted. Please reach out to them soon
            using the contact details in your email. A short, warm hello goes a long way.
          </p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-rose-deep underline-offset-4 hover:underline"
        >
          Back to Journey
        </Link>
      </div>
    </section>
  );
}
