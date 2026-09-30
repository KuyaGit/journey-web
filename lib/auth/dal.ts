import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./token";

/** Call at the top of every admin page and server action. Proxy alone is not trusted. */
export async function requireAdmin(): Promise<void> {
  const store = await cookies();
  if (!(await verifySessionToken(store.get(SESSION_COOKIE)?.value))) {
    redirect("/admin/login");
  }
}
