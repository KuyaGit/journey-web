"use server";

import { headers } from "next/headers";
import QRCode from "qrcode";
import { requireAdmin } from "@/lib/auth/dal";
import { signInvite } from "@/lib/invites/token";

export type InviteState =
  | { error: string }
  | {
      link: string;
      expiresAt: string;
      svg: string;
      png: string;
      /** Same token, for existing leaders to set their own Life Group leader. */
      lifeGroupLink: string;
      lifeGroupSvg: string;
      lifeGroupPng: string;
    }
  | undefined;

/**
 * Makes one open invite: a link and the same link as a QR code. Any leader can use it until it
 * expires (one day), typing their own email. Whatever they send is only ever a draft that an admin
 * approves, so this action grants no access to the app.
 */
export async function createInviteAction(): Promise<InviteState> {
  await requireAdmin();

  try {
    const { token, expiresAt } = await signInvite();

    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    const link = `${proto}://${host}/leader-invite/${token}`;
    const lifeGroupLink = `${link}/life-group`;

    const qr = (url: string) =>
      Promise.all([
        QRCode.toString(url, { type: "svg", margin: 2, errorCorrectionLevel: "M" }),
        QRCode.toDataURL(url, { width: 1024, margin: 2, errorCorrectionLevel: "M" }),
      ]);
    const [[svg, png], [lifeGroupSvg, lifeGroupPng]] = await Promise.all([qr(link), qr(lifeGroupLink)]);

    return { link, expiresAt: expiresAt.toISOString(), svg, png, lifeGroupLink, lifeGroupSvg, lifeGroupPng };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create the invite." };
  }
}
