import type { Metadata } from "next";
import Link from "next/link";

// Where a Life Group leader lands after tapping "Decline" in the join request email.
// Static and public: it holds no applicant details. Kept out of search results and the sitemap, like /leader-thanks.
export const metadata: Metadata = {
  title: "Thank You for Replying",
  description: "Thank you for letting us know. We will help the applicant find another leader.",
  robots: { index: false, follow: false },
};

export default function LeaderDeclinedPage() {
  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4 sm:px-6"
      style={{
        background:
          "linear-gradient(180deg, #fbf6ef 0%, rgba(91,139,176,0.10) 60%, #fbf6ef 100%)",
      }}
    >
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-7 inline-block" aria-hidden="true">
          🤝
        </div>

        <h1
          className="text-4xl sm:text-5xl font-semibold text-clay mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Thank you for letting us know
        </h1>

        <p className="text-lg text-muted leading-relaxed mb-5 max-w-sm mx-auto">
          Knowing your limits is part of leading well. We&apos;re grateful you replied
          honestly, and there is nothing more you need to do.
        </p>

        <p className="text-base text-muted leading-relaxed mb-10 max-w-sm mx-auto">
          Discipleship is a team effort, and every leader has a season. We&apos;ll thank
          you for the care you&apos;ve already shown, and your yes may be needed again
          another time.
        </p>

        <div className="rounded-2xl border border-sand bg-sand/40 px-6 py-5 text-left">
          <p className="text-sm font-semibold text-clay mb-1">What happens next</p>
          <p className="text-sm text-muted leading-relaxed">
            We&apos;ve let the applicant know, kindly, and invited them to choose another
            leader so they can keep moving forward.
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
