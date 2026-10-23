import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

// Host-based routing (one app, two audiences):
//   admin.<domain>            -> admin area + leader invite form only
//   <domain> / other hosts    -> landing site only (/admin and /leader-invite are 404)
// This decides what a host SHOWS. It is not the security boundary: admin pages still require
// a valid session (requireAdmin in lib/auth/dal.ts), and Host headers can be forged.
const ADMIN_SUBDOMAIN = "admin";

function hostOf(request: NextRequest): string {
  const raw = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  return raw.split(",")[0].trim().split(":")[0].toLowerCase();
}

function isAdminHost(host: string): boolean {
  // "admin.example.com" and "admin.localhost" match; a bare "admin" does not.
  const [first, ...rest] = host.split(".");
  return first === ADMIN_SUBDOMAIN && rest.length > 0;
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone(); // keeps the public host, unlike building from request.url
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const onAdminHost = isAdminHost(hostOf(request));
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isInvitePath = pathname === "/leader-invite" || pathname.startsWith("/leader-invite/");

  if (!onAdminHost) {
    // Landing host. In development plain localhost stays unrestricted so /admin is reachable.
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    if (isAdminPath || isInvitePath) {
      // A path that does not exist, so Next renders its normal 404 page.
      return NextResponse.rewrite(new URL("/not-found-on-this-host", request.url));
    }
    return NextResponse.next();
  }

  // Admin host: never serve the landing site here.
  const signedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!isAdminPath && !isInvitePath) {
    return redirectTo(request, signedIn ? "/admin/leaders" : "/admin/login");
  }

  // Optimistic, cookie-only check. Real authorization is requireAdmin() in lib/auth/dal.ts.
  // The invite form is public by design (its token is the credential) and so is /admin/login.
  const needsSession = isAdminPath && pathname !== "/admin/login";
  if (needsSession && !signedIn) return redirectTo(request, "/admin/login");

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  // Everything except Next internals and files with an extension (images, icons, robots.txt, ...).
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
