import { SectionWrapper } from "@/components/ui/section";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { faqs } from "@/lib/content";
import { faqPageJsonLd } from "@/lib/jsonld";

export function FaqSection() {
  const jsonLd = faqPageJsonLd(faqs);

  return (
    <SectionWrapper className="bg-cream" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-3">
            FAQ
          </p>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-clay"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Common questions
          </h2>
        </div>

        <FaqAccordion items={faqs} />
      </div>
    </SectionWrapper>
  );
}
