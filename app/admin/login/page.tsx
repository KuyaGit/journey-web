"use client";

import { useActionState } from "react";
import { Icon } from "@/components/admin/icons";
import { btnPrimary, inputCls, labelCls } from "@/components/admin/ui";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <div className="grid flex-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden bg-clay p-14 text-cream lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-rose/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-amber/30 blur-3xl"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-rose to-amber font-display text-2xl font-semibold text-white">
            J
          </span>
          <span className="font-display text-xl">Journey</span>
        </div>
        <div className="relative">
          <h1 className="font-display text-5xl leading-[1.1] tracking-tight">
            Help every person
            <br />
            find their <em className="text-amber">Life Group.</em>
          </h1>
          <p className="mt-5 max-w-md text-cream/70">
            Manage the leaders people meet in the Grow app: add, edit, publish or pause them in one place.
          </p>
        </div>
        <p className="relative text-xs text-cream/40">Private admin area. Authorised access only.</p>
      </section>

      {/* Form */}
      <main className="flex items-center justify-center px-6 py-14">
        <div className="animate-fade-up w-full max-w-sm">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-rose to-amber font-display text-2xl font-semibold text-white lg:hidden">
            J
          </span>
          <h2 className="mt-5 font-display text-3xl tracking-tight text-clay lg:mt-0">Welcome back</h2>
          <p className="mt-1.5 text-sm text-muted">Sign in to manage leaders.</p>

          <form action={action} className="mt-8 space-y-5">
            <label className={labelCls}>
              Username
              <input name="username" autoComplete="username" required className={inputCls} />
            </label>
            <label className={labelCls}>
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={inputCls}
              />
            </label>

            {state?.error && (
              <p
                role="alert"
                className="flex items-center gap-2 rounded-xl bg-rose/10 px-3.5 py-2.5 text-sm text-rose-deep"
              >
                <Icon name="alert" className="h-4 w-4 shrink-0" />
                {state.error}
              </p>
            )}

            <button disabled={pending} className={`${btnPrimary} w-full py-3`}>
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
