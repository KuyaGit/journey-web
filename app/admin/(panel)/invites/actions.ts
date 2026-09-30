"use server";

import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth/dal";
import { contactEmailExists } from "@/lib/hygraph/leaders";
import { signInvite } from "@/lib/invites/token";

export type InviteState =
  | { error: string }
  | { link: string; expiresAt: string; email: string; name: string }
  | undefined;

export async function createInviteAction(_prev: InviteState, formData: FormData): Promise<InviteState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  try {
    if (await contactEmailExists(email)) {
      return { error: "A leader with this email already exists, so no invite is needed." };
    }
    const { token, expiresAt } = await signInvite({ email, name });

    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

    return { link: `${proto}://${host}/leader-invite/${token}`, expiresAt: expiresAt.toISOString(), email, name };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create the invite." };
  }
}
