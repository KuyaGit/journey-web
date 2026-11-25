"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SaveState } from "@/app/admin/(panel)/leaders/actions";
import { contactEmailExists, createLeader } from "@/lib/hygraph/leaders";
import { issueHumanCheck, verifyHumanCheck, type HumanChallenge } from "@/lib/human-check";
import { verifyInvite } from "@/lib/invites/token";
import { uploadFormImage } from "@/lib/leaders/image";
import { lifeGroupLeaderError } from "@/lib/leaders/life-group";
import { parseLeaderForm, slugify } from "@/lib/leaders/schema";
import { clientIp, createLimiter } from "@/lib/rate-limit";

// Counts every submit attempt per IP, not only failures. One QR code is shared by many leaders, often
// on the same church Wi-Fi (one IP), so these limits are generous. The puzzle, the honeypot, the
// one-profile-per-email rule and admin approval still stop abuse.
const limiter = createLimiter({ max: 40, windowMs: 60 * 60 * 1000 });

const challengeLimiter = createLimiter({ max: 120, windowMs: 60 * 60 * 1000 });

const INVALID = "This invite link is no longer valid. Ask your admin for a new one.";
const EXPIRED = "This QR code has expired. Ask your admin for a new one.";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Issues the "I'm not a robot" puzzle. Only holders of a valid invite link can ask for one. */
export async function requestHumanCheck(token: string): Promise<HumanChallenge | null> {
  if ((await verifyInvite(token)).status !== "valid") return null;
  const ip = clientIp(await headers());
  if (challengeLimiter.isBlocked(ip)) return null;
  challengeLimiter.fail(ip);
  return issueHumanCheck();
}

/**
 * Public action. The invite token is the only credential. The result is always a DRAFT (pending):
 * nothing reaches the app until an admin approves it. This flow must NEVER call publishLeader.
 * Never log the email, phone or token.
 */
export async function submitInvite(token: string, _prev: SaveState, formData: FormData): Promise<SaveState> {
  const claims = await verifyInvite(token);
  if (claims.status === "expired") return { errors: [EXPIRED] };
  if (claims.status === "invalid") return { errors: [INVALID] };

  const ip = clientIp(await headers());
  if (limiter.isBlocked(ip)) return { errors: ["Too many attempts. Please try again later."] };
  limiter.fail(ip);

  // Honeypot: bots fill the hidden field. Pretend it worked.
  if (String(formData.get("website") ?? "").trim()) redirect("/leader-invite/thanks");

  // Enforced here, not just by the disabled button: a script can post the form directly.
  if (!(await verifyHumanCheck(String(formData.get("hc") ?? ""), String(formData.get("hs") ?? "")))) {
    return { errors: ["Please confirm you're not a robot, then try again."] };
  }

  // Older links are tied to one email, which the leader can't change. Open QR links take the email the
  // leader typed. Either way they can't choose their slug or active state.
  const email = (claims.email ?? String(formData.get("email") ?? "")).trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { errors: ["Enter a valid email address."] };
  formData.set("email", email);
  formData.delete("slug");

  const parsed = parseLeaderForm(formData);
  if (!parsed.ok) return { errors: parsed.errors };

  // Gender and life stage are required by parseLeaderForm, which also sets who the leader serves.

  try {
    // One profile per email: once a leader exists for this email (pending or live), it can't be sent again.
    if (await contactEmailExists(email)) {
      return {
        errors: [
          claims.email
            ? "This invite was already used. Ask your admin for a new one if you need to change something."
            : "A profile with this email has already been sent. Ask your admin if you need to change something.",
        ],
      };
    }

    const lglError = await lifeGroupLeaderError(parsed.value, null);
    if (lglError) return { errors: [lglError] };

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
