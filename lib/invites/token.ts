import "server-only";
import { randomBytes } from "node:crypto";
import { SignJWT, errors, jwtVerify } from "jose";

/** A QR code / link is valid for one day. The QR is just the link drawn as a picture, so both expire together. */
export const INVITE_TTL_HOURS = 24;
const AUDIENCE = "leader-invite";

/**
 * `email` is only set on older links that were issued for one specific leader. New invites are "open":
 * any leader can use them and types their own email.
 */
export type InviteClaims = { email?: string; name: string; expiresAt: Date };

export type InviteResult =
  | ({ status: "valid" } & InviteClaims)
  | { status: "expired" }
  | { status: "invalid" };

// Separate secret from SESSION_SECRET so an invite token can never be mistaken for an admin session.
export function inviteKey() {
  const secret = process.env.INVITE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("INVITE_SECRET must be set to at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

/** Creates an open invite that any leader can use until it expires. */
export async function signInvite(): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000);
  const token = await new SignJWT({ kind: "open" })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience(AUDIENCE)
    .setJti(randomBytes(8).toString("hex"))
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(inviteKey());
  return { token, expiresAt };
}

/**
 * Tells an expired link apart from a bad one so the leader sees "this QR code has expired"
 * rather than a vague "invalid" message.
 */
export async function verifyInvite(token: string): Promise<InviteResult> {
  try {
    const { payload } = await jwtVerify(token, inviteKey(), { algorithms: ["HS256"], audience: AUDIENCE });
    const expiresAt = new Date((payload.exp ?? 0) * 1000);
    // Older links were issued for one email; keep honouring them until they run out.
    const email = typeof payload.email === "string" && payload.email ? payload.email : undefined;
    return { status: "valid", email, name: typeof payload.name === "string" ? payload.name : "", expiresAt };
  } catch (e) {
    return e instanceof errors.JWTExpired ? { status: "expired" } : { status: "invalid" };
  }
}
