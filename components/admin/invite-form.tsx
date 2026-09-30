"use client";

import { useActionState, useState } from "react";
import { createInviteAction, type InviteState } from "@/app/admin/(panel)/invites/actions";
import { Icon } from "./icons";
import { btnGhost, btnPrimary, card, inputCls, labelCls } from "./ui";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable: ignore */
        }
      }}
      className={btnGhost}
    >
      <Icon name={copied ? "check" : "copy"} />
      {copied ? "Copied" : label}
    </button>
  );
}

export function InviteForm() {
  const [state, action, pending] = useActionState<InviteState, FormData>(createInviteAction, undefined);
  const result = state && "link" in state ? state : null;

  const message = result
    ? `Hi${result.name ? ` ${result.name.split(" ")[0]}` : ""}! Please fill in your Life Group leader profile using this private link. It works once and expires on ${new Date(
        result.expiresAt,
      ).toLocaleDateString(undefined, { month: "long", day: "numeric" })}:\n${result.link}`
    : "";

  return (
    <div className="space-y-6">
      <form action={action} className={`${card} space-y-5 p-5 sm:p-6`}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelCls}>
            Leader&apos;s name <span className="font-normal text-muted">(optional)</span>
            <input name="name" autoComplete="off" className={inputCls} placeholder="e.g. Maria Santos" />
          </label>
          <label className={labelCls}>
            Leader&apos;s email *
            <input name="email" type="email" required autoComplete="off" className={inputCls} />
          </label>
        </div>
        {state && "error" in state && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-rose/10 px-3.5 py-2.5 text-sm text-rose-deep">
            <Icon name="alert" className="h-4 w-4 shrink-0" />
            {state.error}
          </p>
        )}
        <button disabled={pending} className={btnPrimary}>
          <Icon name="plus" />
          {pending ? "Creating…" : "Create invite link"}
        </button>
      </form>

      {result && (
        <section className={`${card} animate-fade-up space-y-4 p-5 sm:p-6`} aria-live="polite">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage/20 text-[#4d6b54]">
              <Icon name="check" />
            </span>
            <div>
              <h2 className="font-display text-xl text-clay">Invite ready</h2>
              <p className="text-sm text-muted">
                For <strong className="text-clay">{result.email}</strong>. Works once, expires{" "}
                {new Date(result.expiresAt).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
                .
              </p>
            </div>
          </div>

          <div className="break-all rounded-xl border border-sand bg-cream px-3.5 py-3 font-mono text-xs text-clay">
            {result.link}
          </div>

          <div className="flex flex-wrap gap-2">
            <CopyButton value={result.link} label="Copy link" />
            <CopyButton value={message} label="Copy message" />
          </div>
          <p className="text-xs text-muted">
            Send it yourself (Messenger, Viber, SMS or email). Anyone with the link can submit, so share it
            only with the leader. Their profile arrives here as a draft for you to approve.
          </p>
        </section>
      )}
    </div>
  );
}
