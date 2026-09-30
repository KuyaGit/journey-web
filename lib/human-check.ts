import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { inviteKey } from "@/lib/invites/token";

// Self-hosted proof-of-work "I'm not a robot". The server signs a challenge, the browser must find a
// counter whose SHA-256(`${nonce}:${counter}`) starts with `bits` zero bits, and the server re-checks
// it on submit. No third-party service or API key. It raises the cost of scripted submissions;
// it is not a substitute for a CAPTCHA against a determined, targeted attacker.
const BITS = 15; // ~32k hashes on average: about a second in a browser
const AUDIENCE = "human-check";
const MIN_SOLVE_MS = 1500; // a real browser can't solve it instantly

export type HumanChallenge = { challenge: string; nonce: string; bits: number };

export async function issueHumanCheck(): Promise<HumanChallenge> {
  const nonce = randomBytes(12).toString("hex");
  const challenge = await new SignJWT({ nonce, bits: BITS })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(inviteKey());
  return { challenge, nonce, bits: BITS };
}

function leadingZeroBits(buf: Buffer): number {
  let bits = 0;
  for (const byte of buf) {
    if (byte === 0) {
      bits += 8;
      continue;
    }
    bits += Math.clz32(byte) - 24;
    break;
  }
  return bits;
}

export async function verifyHumanCheck(challenge: string, solution: string): Promise<boolean> {
  try {
    if (!challenge || !/^\d{1,9}$/.test(solution)) return false;
    const { payload } = await jwtVerify(challenge, inviteKey(), {
      algorithms: ["HS256"],
      audience: AUDIENCE,
    });
    const { nonce, bits, iat } = payload as { nonce?: string; bits?: number; iat?: number };
    if (typeof nonce !== "string" || typeof bits !== "number" || typeof iat !== "number") return false;
    if (Date.now() - iat * 1000 < MIN_SOLVE_MS) return false;
    const digest = createHash("sha256").update(`${nonce}:${solution}`).digest();
    return leadingZeroBits(digest) >= bits;
  } catch {
    return false;
  }
}
