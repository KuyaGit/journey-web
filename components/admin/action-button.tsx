"use client";

import { useFormStatus } from "react-dom";

/**
 * Submit button for server-action forms. Disables itself while the form is pending; the loading
 * state itself is shown by an overlay (see LeaderActionForm), not on the button.
 */
export function ActionButton({ className, children }: { className: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending} aria-busy={pending}>
      {children}
    </button>
  );
}
