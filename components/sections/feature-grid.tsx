import { SectionWrapper } from "@/components/ui/section";
import { features } from "@/lib/content";

const accentStyles: Record<
  string,
  { card: string; iconBg: string; title: string }
> = {
  rose: {
    card: "border-rose/20 hover:border-rose/40",
    iconBg: "bg-rose/10",
    title: "text-rose",
  },
  sage: {
    card: "border-sage/20 hover:border-sage/40",
    iconBg: "bg-sage/10",
    title: "text-sage",
  },
  amber: {
    card: "border-amber/20 hover:border-amber/40",
    iconBg: "bg-amber/10",
    title: "text-amber",
  },
};

export function FeatureGrid() {
  return (
    <SectionWrapper className="bg-sand/25" id="features">
      <div className="text-center mb-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-3">
          What&apos;s Inside
        </p>
        <h2
          className="text-3xl sm:text-4xl font-semibold text-clay"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Everything you need to grow
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const s = accentStyles[feature.accentColor] ?? accentStyles.rose;
          return (
            <div
              key={feature.id}
              className={`group rounded-3xl p-7 bg-white border ${s.card} transition-all hover:-translate-y-0.5`}
              style={{ boxShadow: "0 4px 28px 0 rgba(59,42,32,0.06)" }}
            >
              <div
                className={`w-13 h-13 rounded-2xl ${s.iconBg} flex items-center justify-center text-3xl mb-5`}
                style={{ width: "52px", height: "52px" }}
              >
                {feature.icon}
              </div>
              <h3
                className={`text-lg font-semibold ${s.title} mb-3`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
