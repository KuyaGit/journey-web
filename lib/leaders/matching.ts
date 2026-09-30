import type { Gender, LifeStage } from "./schema";

// Product-owner rule (final). Do not change without asking them.
export type MatchableLeader = {
  isActive: boolean;
  lifeStages: LifeStage | null;
  supportedGenders: Gender[];
  acceptsLgbt: boolean;
};

export type UserProfile = {
  gender: "male" | "female" | "lgbtqia";
  /** Required when gender is lgbtqia: the group they'd be most comfortable joining. */
  comfortGroup?: "male" | "female";
  lifeStage: LifeStage;
};

export function matches(leader: MatchableLeader, user: UserProfile): boolean {
  if (!leader.isActive) return false;
  if (leader.lifeStages !== user.lifeStage) return false;
  if (user.gender === "lgbtqia") {
    return (
      !!user.comfortGroup &&
      leader.supportedGenders.includes(user.comfortGroup) &&
      leader.acceptsLgbt
    );
  }
  return leader.supportedGenders.includes(user.gender);
}

/** Warnings for leaders nobody can ever match. */
export function unmatchableWarnings(leader: MatchableLeader): string[] {
  if (!leader.isActive) return [];
  const w: string[] = [];
  if (!leader.lifeStages) w.push("Active but no life stage set: nobody can find this leader.");
  if (leader.supportedGenders.length === 0 && !leader.acceptsLgbt) {
    w.push("No supported genders and LGBT not accepted: nobody can find this leader.");
  }
  return w;
}
