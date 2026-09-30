"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import type { SaveState } from "@/app/admin/(panel)/leaders/actions";
import {
  GENDERS,
  GENDER_LABELS,
  LIFE_STAGES,
  LIFE_STAGE_LABELS,
  slugify,
} from "@/lib/leaders/schema";
import type { AdminLeader } from "@/lib/hygraph/leaders";
import type { HumanChallenge } from "@/lib/human-check";
import { HumanCheck } from "./human-check";
import { Icon } from "./icons";
import { ImageCropper } from "./image-cropper";
import { btnGhost, btnPrimary, card, inputCls, labelCls } from "./ui";

type Props = {
  leader?: AdminLeader;
  action: (prev: SaveState, fd: FormData) => Promise<SaveState>;
  /** "invite" is the public form a leader fills in: no slug/active/member count, email locked. */
  variant?: "admin" | "invite";
  lockedEmail?: string;
  initialName?: string;
  /** When set, the submit button stays disabled until the visitor passes the "I'm not a robot" check. */
  humanCheck?: () => Promise<HumanChallenge | null>;
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${card} p-5 sm:p-6`}>
      <h2 className="font-display text-xl tracking-tight text-clay">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

/** Pill-style radio / checkbox. */
function Choice({
  type,
  name,
  value,
  label,
  defaultChecked,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="block rounded-xl border border-sand bg-white px-3.5 py-2 text-sm text-clay transition hover:border-clay/30 peer-checked:border-clay peer-checked:bg-clay peer-checked:text-cream peer-focus-visible:ring-4 peer-focus-visible:ring-rose/25">
        {label}
      </span>
    </label>
  );
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sand bg-cream/50 p-3.5">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-clay/20 transition peer-checked:bg-sage peer-focus-visible:ring-4 peer-focus-visible:ring-rose/25 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
      />
      <span>
        <span className="block text-sm font-medium text-clay">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
    </label>
  );
}

export function LeaderForm({
  leader,
  action,
  variant = "admin",
  lockedEmail,
  initialName,
  humanCheck,
}: Props) {
  const invite = variant === "invite";
  const [state, formAction, pending] = useActionState<SaveState, FormData>(action, undefined);
  const [verified, setVerified] = useState(!humanCheck);
  const [name, setName] = useState(leader?.name ?? initialName ?? "");
  const [slug, setSlug] = useState(leader?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!leader);

  return (
    <form
      // Submitting via a transition (not `action=`) stops React 19 from resetting every field
      // when the server returns a validation error.
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

      {invite && (
        // Honeypot: real people never see or fill this; bots often do.
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      )}

      <Section
        title={invite ? "About you" : "Identity"}
        description={
          invite
            ? "This is how you'll be introduced to people looking for a Life Group."
            : "How this leader is introduced in the app."
        }
      >
        <ImageCropper name="image" initialUrl={leader?.profileImage?.url ?? null} />
        <div className={invite ? "" : "grid gap-5 sm:grid-cols-2"}>
          <label className={labelCls}>
            {invite ? "Your full name *" : "Name *"}
            <input
              name="name"
              required
              value={name}
              className={inputCls}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </label>
          {!invite && (
            <label className={labelCls}>
              Slug *
              <input
                name="slug"
                required
                value={slug}
                className={`${inputCls} font-mono`}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
              />
            </label>
          )}
        </div>
        <label className={labelCls}>
          Short bio
          <textarea name="shortBio" rows={3} defaultValue={leader?.shortBio ?? ""} className={inputCls} />
        </label>
        <div className={invite ? "" : "grid gap-5 sm:grid-cols-2"}>
          <label className={labelCls}>
            Life group type
            <input
              name="lifeGroupType"
              placeholder="e.g. Professionals"
              defaultValue={leader?.lifeGroupType ?? ""}
              className={inputCls}
            />
          </label>
          {!invite && (
            <label className={labelCls}>
              Member count
              <input
                name="memberCount"
                type="number"
                min={0}
                step={1}
                defaultValue={leader?.memberCount ?? ""}
                className={inputCls}
              />
            </label>
          )}
        </div>
      </Section>

      <Section
        title={invite ? "Who you lead" : "Matching"}
        description={
          invite
            ? "This helps people find the group that fits them."
            : "Decides who sees this leader. Changes here affect the app."
        }
      >
        <fieldset>
          <legend className={labelCls}>{invite ? "Your gender" : "Leader's gender"}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            <Choice type="radio" name="gender" value="" label="Not set" defaultChecked={!leader?.gender} />
            {GENDERS.map((g) => (
              <Choice
                key={g}
                type="radio"
                name="gender"
                value={g}
                label={GENDER_LABELS[g]}
                defaultChecked={leader?.gender === g}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelCls}>{invite ? "Life stage you lead *" : "Life stage served"}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            <Choice type="radio" name="lifeStages" value="" label="Not set" defaultChecked={!leader?.lifeStages} />
            {LIFE_STAGES.map((s) => (
              <Choice
                key={s}
                type="radio"
                name="lifeStages"
                value={s}
                label={LIFE_STAGE_LABELS[s]}
                defaultChecked={leader?.lifeStages === s}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelCls}>Supported genders</legend>
          <p className="text-xs text-muted">
            {invite ? "Who you welcome into your group." : "Who this leader accepts into the group."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <Choice
                key={g}
                type="checkbox"
                name="supportedGenders"
                value={g}
                label={GENDER_LABELS[g]}
                defaultChecked={leader?.supportedGenders.includes(g)}
              />
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            name="acceptsLgbt"
            label="Accepts LGBT"
            hint={
              invite
                ? "Your group welcomes LGBT members."
                : "Shown to LGBT members who pick this group."
            }
            defaultChecked={leader?.acceptsLgbt ?? false}
          />
          {!invite && (
            <Toggle
              name="isActive"
              label="Active"
              hint="Turn off to hide this leader everywhere."
              defaultChecked={leader?.isActive ?? true}
            />
          )}
        </div>
      </Section>

      <Section title="Details" description={invite ? "Optional. Shown on your profile." : "Optional. Shown on the leader's card and profile."}>
        <div className="grid gap-5 sm:grid-cols-3">
          {(["hobbies", "interests", "languages"] as const).map((f) => (
            <label key={f} className={labelCls}>
              {f.replace(/^./, (c) => c.toUpperCase())}
              <input
                name={f}
                placeholder="Comma separated"
                defaultValue={leader?.[f].join(", ") ?? ""}
                className={inputCls}
              />
            </label>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {(
            [
              ["facebookUrl", "Facebook URL"],
              ["instagramUrl", "Instagram URL"],
              ["twitterUrl", "X / Twitter URL"],
            ] as const
          ).map(([f, label]) => (
            <label key={f} className={labelCls}>
              {label}
              <input name={f} type="url" placeholder="https://" defaultValue={leader?.[f] ?? ""} className={inputCls} />
            </label>
          ))}
        </div>
      </Section>

      <Section
        title="Private contact"
        description={
          invite
            ? "Used to tell you when someone asks to join. Never shown to the public."
            : "Used to email the leader about join requests. Never shown in the app."
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelCls}>
            Email *
            <input
              name="email"
              type="email"
              required
              readOnly={!!lockedEmail}
              defaultValue={lockedEmail ?? leader?.leaderContact?.email ?? ""}
              className={`${inputCls} ${lockedEmail ? "bg-cream text-muted" : ""}`}
            />
          </label>
          <label className={labelCls}>
            Phone
            <input name="phone" defaultValue={leader?.leaderContact?.phone ?? ""} className={inputCls} />
          </label>
        </div>
      </Section>

      {humanCheck && <HumanCheck request={humanCheck} onChange={setVerified} />}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-sand bg-white/90 p-3 pl-5 shadow-[0_12px_40px_-12px_rgba(59,42,32,0.35)] backdrop-blur">
        <p className="hidden text-sm text-muted sm:block">
          {invite
            ? "An admin reviews your profile before it goes live."
            : "Saved as a draft. Approve it to publish to the app."}
        </p>
        <div className="ml-auto flex gap-2">
          {!invite && (
            <Link href="/admin/leaders" className={btnGhost}>
              Cancel
            </Link>
          )}
          <button
            disabled={pending || !verified}
            title={!verified ? "Tick “I'm not a robot” first" : undefined}
            className={btnPrimary}
          >
            {pending ? (invite ? "Sending…" : "Saving…") : invite ? "Send for review" : "Save draft"}
          </button>
        </div>
      </div>
    </form>
  );
}
