"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SaveState } from "@/app/admin/(panel)/leaders/actions";
import { contactEmailExists, createLeader } from "@/lib/hygraph/leaders";
import { issueHumanCheck, verifyHumanCheck, type HumanChallenge } from "@/lib/human-check";
import { verifyInvite } from "@/lib/invites/token";
import { uploadFormImage } from "@/lib/leaders/image";
import { parseLeaderForm, slugify } from "@/lib/leaders/schema";
import { clientIp, createLimiter } from "@/lib/rate-limit";

// Counts every submit attempt per IP, not only failures.
const limiter = createLimiter({ max: 10, windowMs: 60 * 60 * 1000 });

const challengeLimiter = createLimiter({ max: 30, windowMs: 60 * 60 * 1000 });

const INVALID = "This invite link is no longer valid. Ask your admin for a new one.";

/** Issues the "I'm not a robot" puzzle. Only holders of a valid invite link can ask for one. */
export async function requestHumanCheck(token: string): Promise<HumanChallenge | null> {
  if (!(await verifyInvite(token))) return null;
  const ip = clientIp(await headers());
  if (challengeLimiter.isBlocked(ip)) return null;
  challengeLimiter.fail(ip);
  return issueHumanCheck();
}

/**
 * Public action. The invite token is the only credential. The result is always a DRAFT:
 * nothing reaches the app until an admin approves it. Never log the email, phone or token.
 */
export async function submitInvite(token: string, _prev: SaveState, formData: FormData): Promise<SaveState> {
  const claims = await verifyInvite(token);
  if (!claims) return { errors: [INVALID] };

  const ip = clientIp(await headers());
  if (limiter.isBlocked(ip)) return { errors: ["Too many attempts. Please try again later."] };
  limiter.fail(ip);

  // Honeypot: bots fill the hidden field. Pretend it worked.
  if (String(formData.get("website") ?? "").trim()) redirect("/leader-invite/thanks");

  // Enforced here, not just by the disabled button: a script can post the form directly.
  if (!(await verifyHumanCheck(String(formData.get("hc") ?? ""), String(formData.get("hs") ?? "")))) {
    return { errors: ["Please confirm you're not a robot, then try again."] };
  }

  // The leader can't change their email, and can't choose their slug or active state.
  formData.set("email", claims.email);
  formData.delete("slug");

  const parsed = parseLeaderForm(formData);
  if (!parsed.ok) return { errors: parsed.errors };

  const errors: string[] = [];
  if (!parsed.value.lifeStages) errors.push("Please choose the life stage you lead.");
  if (parsed.value.supportedGenders.length === 0 && !parsed.value.acceptsLgbt) {
    errors.push("Please choose who you welcome into your group.");
  }
  if (errors.length) return { errors };

  try {
    // Single use: once a leader exists for this email, the invite is spent.
    if (await contactEmailExists(claims.email)) {
      return { errors: ["This invite was already used. Ask your admin for a new one if you need to change something."] };
    }

    const { imageId, error } = await uploadFormImage(formData);
    if (error) return { errors: [error] };
    if (!imageId) return { errors: ["Please add a profile photo."] };

    const value = { ...parsed.value, isActive: true, memberCount: null };
    try {
      await createLeader(value, imageId);
    } catch (e) {
      // Slug is unique. Retry once with a short suffix if another leader has the same name.
      if (!(e instanceof Error) || !/unique/i.test(e.message)) throw e;
      await createLeader(
        { ...value, slug: `${slugify(value.name)}-${randomBytes(2).toString("hex")}` },
        imageId,
      );
    }
  } catch {
    // Don't echo Hygraph's message to the public: it can contain field values.
    return { errors: ["Something went wrong sending your profile. Please try again."] };
  }

  redirect("/leader-invite/thanks");
}
