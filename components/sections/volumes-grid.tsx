import { SectionWrapper } from "@/components/ui/section";
import { volumes } from "@/lib/content";

// Static level-badge colour pairs (index = volume index)
const levelColors = [
  { bg: "bg-sage/20", text: "text-sage" },
  { bg: "bg-sky-brand/20", text: "text-sky-brand" },
  { bg: "bg-amber/20", text: "text-amber" },
  { bg: "bg-rose/20", text: "text-rose" },
  { bg: "bg-rose-deep/20", text: "text-rose-deep" },
  { bg: "bg-clay/15", text: "text-clay" },
];

export function VolumesGrid() {
  return (
    <SectionWrapper className="bg-sand/20" id="volumes">
      <div className="text-center mb-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-3">
          6 Volumes
        </p>
        <h2
          className="text-3xl sm:text-4xl font-semibold text-clay"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your discipleship library
        </h2>
        <p className="mt-4 text-muted max-w-sm mx-auto">
          Each volume unlocks as you level up — quiz, read, and grow through
          every stage of the Seed Cycle.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {volumes.map((volume, i) => {
          const lc = levelColors[i] ?? levelColors[0];
          return (
            <div
              key={volume.id}
              className="bg-white rounded-2xl p-4 flex gap-4 items-start hover:shadow-md transition-all hover:-translate-y-0.5"
              style={{ boxShadow: "0 3px 18px 0 rgba(59,42,32,0.06)" }}
            >
              {/* Emoji */}
              <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-sand">
                {volume.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className="font-semibold text-clay text-sm leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {volume.title}
                  </h3>
                  <span
                    className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${lc.bg} ${lc.text}`}
                  >
                    Lv {volume.level}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {volume.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
