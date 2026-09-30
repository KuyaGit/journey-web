"use server";

import { scrypt, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSessionToken } from "@/lib/auth/token";
import { clientIp, createLimiter } from "@/lib/rate-limit";

export type LoginState = { error?: string } | undefined;

const limiter = createLimiter({ max: 5, windowMs: 15 * 60 * 1000 });

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = clientIp(h);

  if (limiter.isBlocked(ip)) return { error: "Too many attempts. Try again later." };

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const [salt, hashHex] = (process.env.ADMIN_PASSWORD_HASH ?? "").split(":");
  if (!expectedUser || !salt || !hashHex) return { error: "Admin login is not configured." };

  const derived = await derive(password, salt);
  const userOk = safeEqual(Buffer.from(username), Buffer.from(expectedUser));
  const passOk = safeEqual(derived, Buffer.from(hashHex, "hex"));

  if (!userOk || !passOk) {
    limiter.fail(ip);
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Invalid credentials." };
  }

  limiter.reset(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/admin/leaders");
}

export async function logout() {
  const store = await cookies();
  store.delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
