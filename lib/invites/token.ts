import "server-only";
import { randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

export const INVITE_TTL_DAYS = 7;
const AUDIENCE = "leader-invite";

export type InviteClaims = { email: string; name: string };

// Separate secret from SESSION_SECRET so an invite token can never be mistaken for an admin session.
export function inviteKey() {
  const secret = process.env.INVITE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("INVITE_SECRET must be set to at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function signInvite({ email, name }: InviteClaims): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
  const token = await new SignJWT({ email: email.toLowerCase(), name })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience(AUDIENCE)
    .setJti(randomBytes(8).toString("hex"))
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(inviteKey());
  return { token, expiresAt };
}

/** Returns the claims, or null when the token is missing, tampered, expired or for another purpose. */
export async function verifyInvite(token: string): Promise<InviteClaims | null> {
  try {
    const { payload } = await jwtVerify(token, inviteKey(), { algorithms: ["HS256"], audience: AUDIENCE });
    if (typeof payload.email !== "string" || !payload.email) return null;
    return { email: payload.email, name: typeof payload.name === "string" ? payload.name : "" };
  } catch {
    return null;
  }
}
