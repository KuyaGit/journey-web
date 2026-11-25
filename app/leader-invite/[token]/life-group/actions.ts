"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SaveState } from "@/app/admin/(panel)/leaders/actions";
import { getLeader, listLifeGroupLeaderOptions, setLifeGroupLeader } from "@/lib/hygraph/leaders";
import { verifyHumanCheck } from "@/lib/human-check";
import { verifyInvite } from "@/lib/invites/token";
import { canBeLifeGroupLeader } from "@/lib/leaders/schema";
import { clientIp, createLimiter } from "@/lib/rate-limit";

// Every submit per IP (generous: many leaders share church Wi-Fi), and wrong emails per chosen leader,
// so nobody can guess a leader's email by trying again and again.
const limiter = createLimiter({ max: 40, windowMs: 60 * 60 * 1000 });
const wrongEmail = createLimiter({ max: 5, windowMs: 60 * 60 * 1000 });

const EMAIL_MISMATCH =
  "That email doesn't match the profile you chose. Use the email you gave when you registered as a leader.";
const ALREADY_HAS = "You already have a Life Group leader. If it's wrong, please ask your admin.";

/**
 * Public action. The invite token is the credential, and the leader proves who they are with the email on
 * their profile. The change is saved to the DRAFT only: an admin approves it. Never publish here, and never
 * log the email or token.
 */
export async function submitLifeGroupLeader(token: string, _prev: SaveState, formData: FormData): Promise<SaveState> {
  const claims = await verifyInvite(token);
  if (claims.status === "expired") return { errors: ["This QR code has expired. Ask your admin for a new one."] };
  if (claims.status === "invalid") return { errors: ["This link is no longer valid. Ask your admin for a new one."] };

  const ip = clientIp(await headers());
  if (limiter.isBlocked(ip)) return { errors: ["Too many attempts. Please try again later."] };
  limiter.fail(ip);

  // Honeypot: bots fill the hidden field. Pretend it worked.
  if (String(formData.get("website") ?? "").trim()) redirect("/leader-invite/life-group-thanks");

  if (!(await verifyHumanCheck(String(formData.get("hc") ?? ""), String(formData.get("hs") ?? "")))) {
    return { errors: ["Please confirm you're not a robot, then try again."] };
  }

  const selfId = String(formData.get("self") ?? "");
  const lglId = String(formData.get("lifeGroupLeader") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const errors: string[] = [];
  if (!selfId) errors.push("Choose your name.");
  if (!email) errors.push("Enter your email.");
  if (!lglId) errors.push("Choose your Life Group leader.");
  if (errors.length) return { errors };

  if (wrongEmail.isBlocked(selfId)) {
    return { errors: ["Too many wrong emails for this profile. Please try again in an hour or ask your admin."] };
  }

  try {
    const options = await listLifeGroupLeaderOptions();
    const self = options.find((o) => o.id === selfId);
    if (!self) return { errors: ["Choose your name from the list."] };

    const profile = await getLeader(selfId);
    if (!profile?.leaderContact || profile.leaderContact.email.toLowerCase() !== email) {
      wrongEmail.fail(selfId);
      return { errors: [EMAIL_MISMATCH] };
    }
    wrongEmail.reset(selfId);

    // Read from the DRAFT, so this also blocks a second try while an earlier choice awaits approval.
    if (profile.lifeGroupLeader) return { errors: [ALREADY_HAS] };

    const chosen = options.find((o) => o.id === lglId);
    if (
      lglId === selfId ||
      !chosen ||
      !self.gender ||
      !self.lifeStages ||
      !canBeLifeGroupLeader(chosen, { gender: self.gender, lifeStage: self.lifeStages })
    ) {
      return { errors: ["Choose a Life Group leader from the list. It must match your gender and life stage."] };
    }

    await setLifeGroupLeader(selfId, lglId);
  } catch {
    // Don't echo Hygraph's message to the public: it can contain field values.
    return { errors: ["Something went wrong saving your choice. Please try again."] };
  }

  redirect("/leader-invite/life-group-thanks");
}
