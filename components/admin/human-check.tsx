"use client";

import { useRef, useState } from "react";
import type { HumanChallenge } from "@/lib/human-check";
import { Icon } from "./icons";

type Status = "idle" | "working" | "done" | "error";

function leadingZeroBits(bytes: Uint8Array): number {
  let bits = 0;
  for (const b of bytes) {
    if (b === 0) {
      bits += 8;
      continue;
    }
    bits += Math.clz32(b) - 24;
    break;
  }
  return bits;
}

/** Finds a counter whose SHA-256(`${nonce}:${counter}`) has `bits` leading zero bits. */
async function solve(nonce: string, bits: number, signal: { cancelled: boolean }): Promise<number | null> {
  const enc = new TextEncoder();
  for (let i = 0; ; i++) {
    if (signal.cancelled) return null;
    const digest = await crypto.subtle.digest("SHA-256", enc.encode(`${nonce}:${i}`));
    if (leadingZeroBits(new Uint8Array(digest)) >= bits) return i;
    if (i % 1500 === 1499) await new Promise((r) => setTimeout(r)); // keep the page responsive
  }
}

/**
 * "I'm not a robot" checkbox. The parent keeps its submit button disabled until `onChange(true)`.
 * It renders hidden `hc` / `hs` fields that the server re-verifies on submit.
 */
export function HumanCheck({
  request,
  onChange,
}: {
  request: () => Promise<HumanChallenge | null>;
  onChange: (verified: boolean) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const signal = useRef({ cancelled: false });

  async function start() {
    if (status === "working" || status === "done") return;
    setStatus("working");
    onChange(false);
    signal.current = { cancelled: false };
    try {
      const c = await request();
      if (!c) throw new Error("no challenge");
      const counter = await solve(c.nonce, c.bits, signal.current);
      if (counter === null) return;
      setChallenge(c.challenge);
      setSolution(String(counter));
      setStatus("done");
      onChange(true);
    } catch {
      setStatus("error");
    }
  }

  const done = status === "done";

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
        done ? "border-sage/40 bg-sage/10" : status === "error" ? "border-rose/30 bg-rose/10" : "border-sand bg-white"
      }`}
    >
      <input type="hidden" name="hc" value={challenge} />
      <input type="hidden" name="hs" value={solution} />

      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label="I'm not a robot"
        onClick={start}
        disabled={status === "working" || done}
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 transition ${
          done ? "border-sage bg-sage text-white" : "border-clay/30 bg-white hover:border-clay"
        }`}
      >
        {status === "working" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-clay/20 border-t-clay" />
        ) : done ? (
          <Icon name="check" className="h-4 w-4" />
        ) : null}
      </button>

      <div className="min-w-0 flex-1" aria-live="polite">
        <p className="text-sm font-medium text-clay">
          {done ? "Verified. You're human." : status === "working" ? "Verifying…" : "I'm not a robot"}
        </p>
        <p className="text-xs text-muted">
          {status === "error"
            ? "Couldn't verify. Click the box to try again."
            : done
              ? "You can send your profile now."
              : "Tick the box to enable the send button."}
        </p>
      </div>

      <Icon name="lock" className="h-4 w-4 shrink-0 text-muted/50" />
    </div>
  );
}
