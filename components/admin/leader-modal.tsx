"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  approveAction,
  deleteAction,
  rejectAction,
  setActiveAction,
  unpublishAction,
} from "@/app/admin/(panel)/leaders/actions";
import type { AdminLeader } from "@/lib/hygraph/leaders";
import { unmatchableWarnings } from "@/lib/leaders/matching";
import { reviewState } from "@/lib/leaders/review";
import { GENDER_LABELS, LIFE_STAGE_LABELS } from "@/lib/leaders/schema";
import { ActionButton } from "./action-button";
import { Avatar } from "./avatar";
import { Icon } from "./icons";
import { MatchPreview } from "./match-preview";
import { Pill, btnDanger, btnGhost, btnPrimary, btnRose } from "./ui";

function Chips({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-muted/60">Not set</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span key={i} className="rounded-full bg-sand px-2.5 py-1 text-xs text-clay">
          {i}
        </span>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-clay">{children}</dd>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard unavailable: ignore */
        }
      }}
      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-sand hover:text-clay"
    >
      <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
    </button>
  );
}

export function LeaderModal({ leader, onClose }: { leader: AdminLeader; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const review = reviewState(leader);
  const isNew = review === "new";
  const live = review === "live";
  const active = leader.isActive ?? true;
  const matchable = {
    isActive: active,
    lifeStages: leader.lifeStages,
    supportedGenders: leader.supportedGenders,
    acceptsLgbt: leader.acceptsLgbt ?? false,
  };
  const warnings = unmatchableWarnings(matchable);
  const socials = [
    ["Facebook", leader.facebookUrl],
    ["Instagram", leader.instagramUrl],
    ["X / Twitter", leader.twitterUrl],
  ].filter((s): s is [string, string] => !!s[1]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="admin fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leader-modal-title"
    >
      <div
        className="animate-overlay-in absolute inset-0 bg-clay/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="animate-sheet-in sm:animate-pop-in relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl ring-1 ring-clay/10 sm:max-h-[88vh] sm:rounded-3xl">
        <div className="relative h-28 shrink-0 bg-gradient-to-br from-rose/80 via-rose-deep/70 to-amber/80">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]"
          />
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35"
          >
            <Icon name="x" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end gap-4">
            <Avatar
              name={leader.name}
              url={leader.profileImage?.url}
              className="h-24 w-24 rounded-2xl text-3xl ring-4 ring-cream shadow-lg"
            />
            <div className="min-w-0 flex-1 pb-1">
              <h2 id="leader-modal-title" className="truncate font-display text-2xl tracking-tight text-clay">
                {leader.name}
              </h2>
              <p className="font-mono text-xs text-muted">/{leader.slug}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Pill tone={isNew ? "amber" : live ? "sage" : "sky"} dot>
              {isNew ? "New submission" : live ? "Live" : "Changes pending"}
            </Pill>
            <Pill tone={active ? "sky" : "muted"} dot>
              {active ? "Active" : "Inactive"}
            </Pill>
            {leader.lifeStages && <Pill tone="rose">{LIFE_STAGE_LABELS[leader.lifeStages]}</Pill>}
          </div>

          {!live && (
            <p
              className={`mt-5 flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm ${
                isNew ? "bg-amber/15 text-[#8a5a10]" : "bg-sky-brand/12 text-[#3f6a8d]"
              }`}
            >
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              {isNew
                ? "New submission. Nobody can see this in the app yet. Review the details, then approve to publish or reject to remove it."
                : "These edits aren't live yet. The app still shows the last approved version until you approve."}
            </p>
          )}

          <div className="mt-6 grid gap-6 md:grid-cols-5">
            <div className="space-y-6 md:col-span-3">
              {leader.shortBio && (
                <p className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-clay ring-1 ring-sand">
                  {leader.shortBio}
                </p>
              )}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                <Field label="Group type">{leader.lifeGroupType || <span className="text-muted/60">Not set</span>}</Field>
                <Field label="Leader's gender">
                  {leader.gender ? GENDER_LABELS[leader.gender] : <span className="text-muted/60">Not set</span>}
                </Field>
                <Field label="Supports">
                  <Chips items={leader.supportedGenders.map((g) => GENDER_LABELS[g])} />
                </Field>
                <Field label="Members">{leader.memberCount ?? <span className="text-muted/60">Not set</span>}</Field>
                <Field label="Accepts LGBT">{leader.acceptsLgbt ? "Yes" : "No"}</Field>
                <Field label="Languages">
                  <Chips items={leader.languages} />
                </Field>
                <div className="col-span-2">
                  <Field label="Hobbies">
                    <Chips items={leader.hobbies} />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field label="Interests">
                    <Chips items={leader.interests} />
                  </Field>
                </div>
                {socials.length > 0 && (
                  <div className="col-span-2">
                    <Field label="Links">
                      <div className="flex flex-wrap gap-2">
                        {socials.map(([label, href]) => (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-sand bg-white px-3 py-1 text-xs text-clay transition hover:bg-sand"
                          >
                            {label} ↗
                          </a>
                        ))}
                      </div>
                    </Field>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-5 md:col-span-2">
              <section className="rounded-2xl bg-white p-4 ring-1 ring-sand">
                <h3 className="mb-3 text-sm font-semibold text-clay">Appears for</h3>
                <MatchPreview leader={matchable} compact />
              </section>

              <section className="rounded-2xl bg-white p-4 ring-1 ring-sand">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-clay">
                  <Icon name="lock" className="h-4 w-4 text-muted" />
                  Private contact
                </h3>
                {leader.leaderContact ? (
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Icon name="mail" className="h-4 w-4 shrink-0 text-muted" />
                      <span className="min-w-0 flex-1 truncate">{leader.leaderContact.email}</span>
                      <CopyButton value={leader.leaderContact.email} label="email" />
                    </li>
                    {leader.leaderContact.phone && (
                      <li className="flex items-center gap-2">
                        <Icon name="phone" className="h-4 w-4 shrink-0 text-muted" />
                        <span className="min-w-0 flex-1 truncate">{leader.leaderContact.phone}</span>
                        <CopyButton value={leader.leaderContact.phone} label="phone" />
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="flex items-start gap-2 text-sm text-[#8a5a10]">
                    <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                    No contact yet. Join requests can&apos;t reach this leader.
                  </p>
                )}
                <p className="mt-3 text-[11px] text-muted">Never shown in the app.</p>
              </section>
            </div>
          </div>

          {warnings.length > 0 && (
            <p className="mt-5 flex items-start gap-2 rounded-xl bg-amber/15 px-3 py-2 text-xs text-[#8a5a10]">
              <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {warnings[0]}
            </p>
          )}
        </div>

        <footer className="shrink-0 border-t border-sand bg-white/80 px-6 py-4 backdrop-blur sm:px-8">
          {confirmingDelete ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-md text-sm text-clay">
                {isNew ? (
                  <>
                    Reject <strong>{leader.name}</strong>? Their submission, contact and photo will be deleted.
                  </>
                ) : (
                  <>
                    Delete <strong>{leader.name}</strong> permanently? Past join requests will point to a
                    missing leader. <span className="text-muted">Deactivating is usually safer.</span>
                  </>
                )}
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setConfirmingDelete(false)} className={btnGhost}>
                  Keep
                </button>
                <form action={isNew ? rejectAction : deleteAction}>
                  <input type="hidden" name="id" value={leader.id} />
                  <ActionButton className={btnDanger} pendingLabel={isNew ? "Rejecting…" : "Deleting…"}>
                    <Icon name="trash" /> {isNew ? "Yes, reject" : "Yes, delete"}
                  </ActionButton>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {!live && (
                <form action={approveAction}>
                  <input type="hidden" name="id" value={leader.id} />
                  <ActionButton className={btnRose} pendingLabel="Publishing…">
                    <Icon name="check" /> Approve &amp; publish
                  </ActionButton>
                </form>
              )}
              <Link href={`/admin/leaders/${leader.id}`} className={live ? btnPrimary : btnGhost}>
                <Icon name="pencil" /> Edit
              </Link>
              {live && (
                <>
                  <form action={unpublishAction}>
                    <input type="hidden" name="id" value={leader.id} />
                    <ActionButton className={btnGhost}>
                      <Icon name="eyeOff" /> Unpublish
                    </ActionButton>
                  </form>
                  <form action={setActiveAction}>
                    <input type="hidden" name="id" value={leader.id} />
                    <input type="hidden" name="isActive" value={String(!active)} />
                    <ActionButton className={btnGhost}>{active ? "Deactivate" : "Activate"}</ActionButton>
                  </form>
                </>
              )}
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className={`${btnDanger} ml-auto`}
              >
                <Icon name="trash" /> {isNew ? "Reject" : "Delete"}
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
