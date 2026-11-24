"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/app/admin/(panel)/leaders/actions";
import { LoadingOverlay } from "./loading-overlay";
import { useToast } from "./toaster";

const HINT = "Talking to Hygraph. This can take a few seconds.";

/**
 * Reads the form's pending state. It must live inside the <form>: state set from within the
 * form action itself only renders after the action finishes, so it can't drive a loading UI.
 */
function PendingState({
  label,
  onPendingChange,
}: {
  label: string;
  onPendingChange?: (label: string | null) => void;
}) {
  const { pending } = useFormStatus();

  useEffect(() => {
    onPendingChange?.(pending ? label : null);
  }, [pending, label, onPendingChange]);

  if (onPendingChange || !pending) return null;
  return <LoadingOverlay label={label} hint={HINT} />;
}

/**
 * Form for a leader server action. Shows a loading overlay while the API call runs and a toast
 * with the outcome. On success the action revalidates /admin/leaders, so the table and any open
 * modal re-render with fresh data.
 *
 * Pass `onPendingChange` to show the loading state yourself (e.g. over a modal); otherwise a
 * full-screen overlay is shown.
 */
export function LeaderActionForm({
  action,
  id,
  fields,
  successMessage,
  pendingLabel = "Working…",
  onPendingChange,
  children,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  id: string;
  fields?: Record<string, string>;
  successMessage: string;
  pendingLabel?: string;
  onPendingChange?: (label: string | null) => void;
  children: React.ReactNode;
}) {
  const toast = useToast();

  return (
    <form
      action={async (formData) => {
        try {
          const result = await action(formData);
          if (result.ok) toast(successMessage);
          else toast(result.error, "error");
        } catch {
          toast("Something went wrong. Please try again.", "error");
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      {fields &&
        Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      {children}
      <PendingState label={pendingLabel} onPendingChange={onPendingChange} />
    </form>
  );
}
