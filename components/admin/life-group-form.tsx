"use client";

import { startTransition, useActionState, useState } from "react";
import type { SaveState } from "@/app/admin/(panel)/leaders/actions";
import type { HumanChallenge } from "@/lib/human-check";
import { canBeLifeGroupLeader, type LifeGroupLeaderOption } from "@/lib/leaders/schema";
import { HumanCheck } from "./human-check";
import { Icon } from "./icons";
import { LeaderPicker } from "./leader-picker";
import { LoadingOverlay } from "./loading-overlay";
import { btnPrimary, card, inputCls, labelCls } from "./ui";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className={`${card} p-5 sm:p-6`}>
      <h2 className="flex items-center gap-3 font-display text-xl tracking-tight text-clay">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-clay font-sans text-xs font-semibold text-cream">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

/** Public form: a leader picks themselves, proves it with their email, then picks their Life Group leader. */
export function LifeGroupForm({
  leaders,
  action,
  humanCheck,
}: {
  /** Approved, active leaders: both "who are you" and the Life Group leader come from this list. */
  leaders: LifeGroupLeaderOption[];
  action: (prev: SaveState, fd: FormData) => Promise<SaveState>;
  humanCheck: () => Promise<HumanChallenge | null>;
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(action, undefined);
  const [verified, setVerified] = useState(false);
  const [selfId, setSelfId] = useState("");
  const [lglId, setLglId] = useState("");

  const self = leaders.find((l) => l.id === selfId) ?? null;
  const lglOptions =
    self?.gender && self.lifeStages
      ? leaders.filter(
          (o) =>
            o.id !== self.id &&
            canBeLifeGroupLeader(o, { gender: self.gender!, lifeStage: self.lifeStages! }),
        )
      : [];
  // Picking a different "you" can rule out the current choice.
  const lglValue = lglOptions.some((o) => o.id === lglId) ? lglId : "";

  return (
    <form
      // Submit via a transition so React 19 doesn't reset the fields after a validation error.
      onSubmit={(e) => {
        e.preventDefault();
        if (!verified) return;
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="space-y-6"
    >
      {state?.errors && (
        <div role="alert" className="rounded-2xl border border-rose/30 bg-rose/10 p-4 text-sm text-rose-deep">
          <p className="flex items-center gap-2 font-medium">
            <Icon name="alert" className="h-4 w-4" />
            Couldn&apos;t save
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-9">
            {state.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot: real people never see or fill this; bots often do. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Step n={1} title="Who are you?">
        <LeaderPicker
          name="self"
          label="Your name *"
          options={leaders}
          value={selfId}
          onChange={setSelfId}
          placeholder="Find your name"
          emptyText="No approved leaders yet"
          hint="Only approved leaders are listed. Not here? Ask your admin."
        />
        <label className={labelCls}>
          Your email *
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="The email you registered with"
            className={inputCls}
          />
          <span className="mt-1.5 block text-xs font-normal text-muted">
            We check it against your profile so nobody else can change your details.
          </span>
        </label>
      </Step>

      <Step n={2} title="Who is your Life Group leader?">
        <LeaderPicker
          name="lifeGroupLeader"
          label="Your Life Group leader *"
          options={lglOptions}
          value={lglValue}
          onChange={setLglId}
          disabled={!self}
          disabledText="Choose your name first"
          emptyText="No leader matches your gender and life stage yet"
          hint={
            self && lglOptions.length === 0
              ? "No approved leader matches your gender and life stage yet. Ask your admin."
              : "Leaders of your gender, from your life stage or the one above it."
          }
        />
      </Step>

      <HumanCheck request={humanCheck} onChange={setVerified} />

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-sand bg-white/90 p-3 pl-5 shadow-[0_12px_40px_-12px_rgba(59,42,32,0.35)]">
        <p className="hidden text-sm text-muted sm:block">An admin approves the change before it&apos;s saved.</p>
        <button
          disabled={pending || !verified}
          title={!verified ? "Tick “I'm not a robot” first" : undefined}
          className={`${btnPrimary} ml-auto`}
        >
          Send
        </button>
      </div>

      {pending && <LoadingOverlay label="Sending…" hint="This can take a few seconds." />}
    </form>
  );
}
