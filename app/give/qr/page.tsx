import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import qrImage from "@/public/qr.jpeg";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Give a Love Gift — Scan to Send",
  description:
    "Scan the InstaPay QR code or copy the account details below to send a love gift and support the Grow Together discipleship ministry.",
  alternates: { canonical: "/give/qr" },
  openGraph: {
    title: "Give a Love Gift — Scan to Send",
    description:
      "Scan the InstaPay QR code or copy the account details to send a love gift and support the ministry.",
    url: `${siteConfig.url}/give/qr`,
  },
};

export default function GiveQrPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Give", url: `${siteConfig.url}/give` },
    { name: "Give a Love Gift", url: `${siteConfig.url}/give/qr` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section
        className="py-20 px-4 sm:px-6"
        style={{
          background:
            "linear-gradient(180deg, #fbf6ef 0%, rgba(224,90,122,0.06) 60%, #fbf6ef 100%)",
        }}
      >
        <div className="max-w-md mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl font-semibold text-clay mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Send a Love Gift
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-10 max-w-sm mx-auto">
            Scan the QR code below with your banking or e-wallet app, or use
            the account details to send your gift directly.
          </p>

          {/* QR card */}
          <div
            className="bg-white rounded-3xl p-4 mb-8 mx-auto max-w-xs"
            style={{ boxShadow: "0 8px 32px 0 rgba(59,42,32,0.12)" }}
          >
            <Image
              src={qrImage}
              alt="GoTyme Bank InstaPay QR code for Mark Lowel Montealto"
              placeholder="blur"
              className="w-full h-auto rounded-2xl"
              sizes="(max-width: 640px) 90vw, 360px"
            />
          </div>

          {/* Save QR */}
          <a
            href="/qr.jpeg"
            download="grow-together-love-gift-qr.jpeg"
            className="inline-flex items-center gap-2 text-sm font-semibold text-clay px-6 py-3 rounded-xl border border-sand transition-all hover:-translate-y-0.5 hover:bg-sand/40 mb-10"
          >
            <span aria-hidden="true">⬇️</span>
            Save QR image
          </a>

          {/* Account details */}
          <div className="bg-white/60 rounded-2xl border border-sand p-6 mb-10 text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-4">
              Account details
            </p>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Bank</dt>
                <dd className="font-semibold text-clay">GoTyme Bank</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Account name</dt>
                <dd className="font-semibold text-clay">
                  Mark Lowel Montealto
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Account no.</dt>
                <dd className="font-semibold text-clay">•••• 6303</dd>
              </div>
            </dl>
            <p className="text-xs text-muted/70 mt-4 pt-4 border-t border-sand">
              Transfer fees may apply.
            </p>
          </div>

          {/* Scan instructions */}
          <div className="text-left mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-4 text-center">
              How to give
            </p>
            <ol className="space-y-3 text-sm text-muted leading-relaxed list-decimal list-inside">
              <li>Open your banking or e-wallet app.</li>
              <li>
                Scan this InstaPay QR code, or upload the saved image if
                you&apos;re on desktop.
              </li>
              <li>Enter any amount and confirm your gift.</li>
            </ol>
          </div>

          <p className="text-sm text-muted/60 italic mb-10 px-4">
            &ldquo;Each of you should give what you have decided in your
            heart to give, not reluctantly or under compulsion, for God
            loves a cheerful giver.&rdquo;
            <br />
            — 2 Corinthians 9:7
          </p>

          <Link
            href="/give"
            className="text-sm font-semibold text-clay hover:text-rose transition-colors"
          >
            ← Back to Give
          </Link>
        </div>
      </section>
    </>
  );
}
