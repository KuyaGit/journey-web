import { SectionWrapper } from "@/components/ui/section";
import { seedCycle } from "@/lib/content";

// Tailwind v4 custom-colour utilities are tree-shaken from static strings,
// so we spell them out in full rather than building them dynamically.
const stepStyles: Record<
  string,
  { border: string; iconBg: string; label: string }
> = {
  sage: {
    border: "border-l-sage",
    iconBg: "bg-sage/15",
    label: "text-sage",
  },
  sky: {
    border: "border-l-sky-brand",
    iconBg: "bg-sky-brand/15",
    label: "text-sky-brand",
  },
  amber: {
    border: "border-l-amber",
    iconBg: "bg-amber/15",
    label: "text-amber",
  },
  rose: {
    border: "border-l-rose",
    iconBg: "bg-rose/15",
    label: "text-rose",
  },
};

export function SeedCycleSection() {
  return (
    <SectionWrapper className="bg-cream" id="seed-cycle">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-3">
          The Framework
        </p>
        <h2
          className="text-3xl sm:text-4xl font-semibold text-clay"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The Seed Cycle
        </h2>
        <p className="mt-4 text-muted max-w-sm mx-auto text-base">
          Four movements that guide you from building friendships to raising
          disciples.
        </p>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {seedCycle.map((step, i) => {
          const s = stepStyles[step.color] ?? stepStyles.sage;
          return (
            <div
              key={step.id}
              className={`relative bg-white rounded-2xl p-6 border-l-4 ${s.border} shadow-sm hover:shadow-md transition-shadow`}
              style={{
                boxShadow: "0 4px 20px 0 rgba(59,42,32,0.06)",
                animationDelay: `${i * 80}ms`,
              }}
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-[11px] font-bold text-muted/40">
                0{i + 1}
              </span>

              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center text-2xl mb-4`}
              >
                {step.emoji}
              </div>

              <div
                className={`text-[11px] font-bold uppercase tracking-[0.12em] ${s.label} mb-1.5`}
              >
                {step.label}
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
