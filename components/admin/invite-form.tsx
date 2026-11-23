"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createInviteAction, type InviteState } from "@/app/admin/(panel)/invites/actions";
import { Icon } from "./icons";
import { btnGhost, btnPrimary, card } from "./ui";

function CopyButton({ value, label, disabled }: { value: string; label: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
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

/** "23h 41m" / "12m" / "less than a minute" */
function timeLeft(ms: number): string {
  const mins = Math.max(0, Math.floor(ms / 60000));
  if (mins < 1) return "less than a minute";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function formatExpiry(d: Date): string {
  return d.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });
}

function FullScreenQr({ svg, expiresAt, onClose }: { svg: string; expiresAt: Date; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Leader invite QR code"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white p-6 text-center"
    >
      <button type="button" onClick={onClose} className={`${btnGhost} absolute right-4 top-4`}>
        <Icon name="x" /> Close
      </button>
      <h2 className="font-display text-3xl text-clay sm:text-4xl">Scan to join as a Life Group leader</h2>
      <div
        className="aspect-square w-[min(80vw,70vh)] [&>svg]:h-full [&>svg]:w-full"
        // The SVG is generated on the server from our own link by the qrcode library.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="text-sm text-muted">Open until {formatExpiry(expiresAt)}</p>
    </div>
  );
}

export function InviteForm() {
  const [state, action, pending] = useActionState<InviteState, FormData>(createInviteAction, undefined);
  const result = state && "link" in state ? state : null;

  const [now, setNow] = useState(() => Date.now());
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!result) return;
    // Refresh straight away (the page may have been open for hours before generating), then every 30s.
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [result]);

  const expiresAt = result ? new Date(result.expiresAt) : null;
  const expired = !!expiresAt && now >= expiresAt.getTime();

  // A QR that points at localhost can't be opened from a phone.
  const localOnly = !!result && /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(result.link);

  const message =
    result && expiresAt
      ? `Hi! Please fill in your Life Group leader profile using this link. It expires on ${formatExpiry(
          expiresAt,
        )}:\n${result.link}`
      : "";

  return (
    <div className="space-y-6">
      <form action={action} className={`${card} space-y-4 p-5 sm:p-6`}>
        <p className="text-sm text-muted">
          One QR code and link works for any number of leaders for 24 hours. Each leader enters their own
          email. After that it expires and you can make a new one.
        </p>
        {state && "error" in state && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-rose/10 px-3.5 py-2.5 text-sm text-rose-deep">
            <Icon name="alert" className="h-4 w-4 shrink-0" />
            {state.error}
          </p>
        )}
        <button disabled={pending} className={btnPrimary}>
          <Icon name="qr" />
          {pending ? "Generating…" : result ? "Generate a new QR & link" : "Generate QR & link"}
        </button>
      </form>

      {result && expiresAt && (
        <section className={`${card} animate-fade-up space-y-5 p-5 sm:p-6`} aria-live="polite">
          <div className="flex items-start gap-3">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                expired ? "bg-rose/10 text-rose-deep" : "bg-sage/20 text-[#4d6b54]"
              }`}
            >
              <Icon name={expired ? "clock" : "check"} />
            </span>
            <div>
              <h2 className="font-display text-xl text-clay">{expired ? "This QR code has expired" : "Invite ready"}</h2>
              <p className="text-sm text-muted">
                {expired
                  ? "Generate a new QR code to invite more leaders."
                  : `Expires in ${timeLeft(expiresAt.getTime() - now)} (${formatExpiry(expiresAt)}).`}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <div
                className={`h-52 w-52 rounded-xl border border-sand bg-white p-1 transition [&>svg]:h-full [&>svg]:w-full ${
                  expired ? "opacity-20 blur-[1px]" : ""
                }`}
                role="img"
                aria-label="QR code for the leader invite link"
                // The SVG is generated on the server from our own link by the qrcode library.
                dangerouslySetInnerHTML={{ __html: result.svg }}
              />
              {expired && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="rounded-full bg-rose px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                    Expired
                  </span>
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div
                className={`break-all rounded-xl border border-sand bg-cream px-3.5 py-3 font-mono text-xs text-clay ${
                  expired ? "line-through opacity-50" : ""
                }`}
              >
                {result.link}
              </div>

              <div className="flex flex-wrap gap-2">
                {expired ? (
                  <span className={`${btnGhost} pointer-events-none opacity-60`} aria-disabled="true">
                    <Icon name="download" /> Download QR
                  </span>
                ) : (
                  <a href={result.png} download="journey-leader-invite.png" className={btnGhost}>
                    <Icon name="download" /> Download QR
                  </a>
                )}
                <CopyButton value={result.link} label="Copy link" disabled={expired} />
                <CopyButton value={message} label="Copy message" disabled={expired} />
                <button type="button" disabled={expired} onClick={() => setFull(true)} className={btnGhost}>
                  <Icon name="expand" /> Show full screen
                </button>
              </div>
            </div>
          </div>

          {localOnly && !expired && (
            <p role="alert" className="flex items-start gap-2 rounded-xl bg-amber/15 px-3.5 py-2.5 text-sm text-[#9a6412]">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                This QR points to localhost, so phones can&apos;t open it. Open the admin at your
                computer&apos;s network address (for example http://192.168.1.20:3000) and generate it again.
              </span>
            </p>
          )}

          <p className="text-xs text-muted">
            Anyone with this QR or link can send a profile until it expires, so share it only with the
            leaders you mean to invite. New registrations appear under{" "}
            <Link href="/admin/leaders" className="font-medium text-rose-deep underline underline-offset-2">
              Leaders &rarr; Pending review
            </Link>{" "}
            and nothing goes live until you approve it.
          </p>
        </section>
      )}

      {full && result && expiresAt && !expired && (
        <FullScreenQr svg={result.svg} expiresAt={expiresAt} onClose={() => setFull(false)} />
      )}
    </div>
  );
}
