import { SectionWrapper } from "@/components/ui/section";

const badges = ["🗺️", "🤝", "⛪", "🕊️", "👑", "🌻"];
const earnedCount = 3;

export function GamificationSection() {
  return (
    <SectionWrapper className="bg-cream" id="gamification">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-3">
            Built to Keep You Going
          </p>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-clay"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Progress that feels rewarding
          </h2>
          <p className="mt-4 text-muted max-w-sm mx-auto">
            XP, levels, streaks, and badges make every session something to look
            forward to.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {/* XP & Levels */}
          <div
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: "0 4px 24px 0 rgba(59,42,32,0.07)" }}
          >
            <div className="text-2xl mb-3">⚡</div>
            <h3
              className="font-semibold text-clay text-[1.05rem] mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              XP &amp; Levels
            </h3>
            <p className="text-xs text-muted mb-5">
              +10 XP per correct answer. +5 XP for a perfect round.
            </p>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-muted">Level 2</span>
                <span className="font-bold text-amber">160 / 250 XP</span>
              </div>
              <div className="w-full h-2.5 bg-sand rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "64%",
                    background:
                      "linear-gradient(90deg, #e8a23d 0%, #e05a7a 100%)",
                  }}
                />
              </div>
              <p className="text-[11px] text-muted">90 XP until Level 3</p>
            </div>
          </div>

          {/* Streaks */}
          <div
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: "0 4px 24px 0 rgba(59,42,32,0.07)" }}
          >
            <div className="text-2xl mb-3">🔥</div>
            <h3
              className="font-semibold text-clay text-[1.05rem] mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Daily Streaks
            </h3>
            <p className="text-xs text-muted mb-5">
              Quiz and reading streaks — tracked separately, both count.
            </p>

            <div className="flex gap-3">
              <div className="flex-1 rounded-2xl p-3 text-center bg-rose/8 border border-rose/15">
                <div
                  className="text-2xl font-bold text-rose"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  7
                </div>
                <div className="text-[10px] text-muted mt-0.5">
                  Quiz streak
                </div>
              </div>
              <div className="flex-1 rounded-2xl p-3 text-center bg-sage/8 border border-sage/15">
                <div
                  className="text-2xl font-bold text-sage"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  4
                </div>
                <div className="text-[10px] text-muted mt-0.5">
                  Reading streak
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: "0 4px 24px 0 rgba(59,42,32,0.07)" }}
          >
            <div className="text-2xl mb-3">🏅</div>
            <h3
              className="font-semibold text-clay text-[1.05rem] mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Volume Badges
            </h3>
            <p className="text-xs text-muted mb-5">
              Earn a badge for each volume with a ≥ 60 % score.
            </p>

            <div className="flex flex-wrap gap-2">
              {badges.map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border"
                  style={{
                    background:
                      i < earnedCount
                        ? "rgba(232,162,61,0.15)"
                        : "rgba(243,233,220,0.5)",
                    borderColor:
                      i < earnedCount
                        ? "rgba(232,162,61,0.4)"
                        : "rgba(243,233,220,0.8)",
                    filter:
                      i >= earnedCount
                        ? "grayscale(1) opacity(0.35)"
                        : "none",
                  }}
                  title={i < earnedCount ? "Earned!" : "Locked"}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-3">
              {earnedCount} of {badges.length} badges earned
            </p>
          </div>
        </div>

        {/* Hearts callout */}
        <div className="mt-5 rounded-2xl p-4 flex items-center gap-4 border border-rose/20 bg-rose/5">
          <div className="flex gap-1 text-xl flex-shrink-0">
            <span>❤️</span>
            <span>❤️</span>
            <span style={{ filter: "grayscale(1) opacity(0.4)" }}>❤️</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-clay">
              3 hearts per session
            </p>
            <p className="text-xs text-muted leading-snug">
              Wrong answers cost a heart. Lose all 3 and the session ends
              early — stay sharp!
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
