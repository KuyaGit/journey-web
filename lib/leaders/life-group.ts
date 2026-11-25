import "server-only";
import { listLifeGroupLeaderOptions } from "@/lib/hygraph/leaders";
import { canBeLifeGroupLeader, type LeaderInput } from "./schema";

/**
 * Server-side check of the chosen Life Group leader. The form only lists valid choices, but a
 * script can post any id. Returns an error message, or null when the choice is allowed.
 */
export async function lifeGroupLeaderError(v: LeaderInput, selfId: string | null): Promise<string | null> {
  if (selfId && v.lifeGroupLeaderId === selfId) return "A leader can't be their own Life Group leader.";
  const options = await listLifeGroupLeaderOptions();
  const chosen = options.find((o) => o.id === v.lifeGroupLeaderId);
  if (!chosen || !canBeLifeGroupLeader(chosen, { gender: v.gender, lifeStage: v.lifeStages })) {
    return "Choose a Life Group leader from the list. It must match your gender and life stage.";
  }
  return null;
}
