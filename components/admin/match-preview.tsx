import { matches, unmatchableWarnings, type MatchableLeader } from "@/lib/leaders/matching";
import { LIFE_STAGES, type LifeStage } from "@/lib/leaders/schema";
import { Icon } from "./icons";

const STAGE_SHORT: Record<LifeStage, string> = {
  anointedProfessional: "Professional",
  anointedYoungAdult: "Young Adult",
  anointedYouth: "Youth",
};

const PROFILES = [
  { label: "Male", gender: "male" as const },
  { label: "Female", gender: "female" as const },
  { label: "LGBT → Male group", gender: "lgbtqia" as const, comfortGroup: "male" as const },
  { label: "LGBT → Female group", gender: "lgbtqia" as const, comfortGroup: "female" as const },
];

// Reflects saved values only: what the app shows once this leader is published.
export function MatchPreview({ leader, compact = false }: { leader: MatchableLeader; compact?: boolean }) {
  const warnings = unmatchableWarnings(leader);

  return (
    <div>
      {warnings.map((w) => (
        <p
          key={w}
          className="mb-3 flex items-start gap-2 rounded-xl bg-amber/15 px-3 py-2 text-xs text-[#8a5a10]"
        >
          <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {w}
        </p>
      ))}
      <div className="overflow-hidden rounded-xl border border-sand">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-cream text-muted">
              <th className="px-3 py-2 text-left font-medium">Person is…</th>
              {LIFE_STAGES.map((s) => (
                <th key={s} className="px-2 py-2 text-center font-medium">
                  {STAGE_SHORT[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROFILES.map((p) => (
              <tr key={p.label} className="border-t border-sand">
                <td className={`px-3 text-clay ${compact ? "py-1.5" : "py-2.5"}`}>{p.label}</td>
                {LIFE_STAGES.map((stage) => {
                  const hit = matches(leader, {
                    gender: p.gender,
                    comfortGroup: p.comfortGroup,
                    lifeStage: stage,
                  });
                  return (
                    <td key={stage} className="px-2 text-center">
                      {hit ? (
                        <span
                          className="mx-auto grid h-5 w-5 place-items-center rounded-full bg-sage/20 text-[#4d6b54]"
                          title="Appears"
                        >
                          <Icon name="check" className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="text-muted/40" aria-label="Does not appear">
                          –
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
