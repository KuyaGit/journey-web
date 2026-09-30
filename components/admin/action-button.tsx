"use client";

import { useFormStatus } from "react-dom";

/** Submit button for server-action forms: disables itself and shows a pending label. */
export function ActionButton({
  className,
  pendingLabel = "Working…",
  children,
}: {
  className: string;
  pendingLabel?: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
