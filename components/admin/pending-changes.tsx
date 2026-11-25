import type { LeaderChange } from "@/lib/leaders/changes";

function Value({ value, tone }: { value: string; tone: "before" | "after" }) {
  if (!value) return <span className="italic text-muted/70">Empty</span>;
  return (
    <span
      className={`whitespace-pre-line break-words ${
        tone === "before" ? "text-muted line-through decoration-rose/50" : "font-medium text-clay"
      }`}
    >
      {value}
    </span>
  );
}

function Photo({ url, label }: { url: string | null; label: string }) {
  if (!url) return <span className="italic text-muted/70">No photo</span>;
  // eslint-disable-next-line @next/next/no-img-element -- small Hygraph thumbnail, already sized by the CDN
  return <img src={url} alt={label} className="h-14 w-14 rounded-xl object-cover ring-1 ring-sand" />;
}

/** "Before -> after" list of a leader's unapproved edits, shown next to the Approve button. */
export function PendingChanges({ changes }: { changes: LeaderChange[] }) {
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-sand">
      <h3 className="text-sm font-semibold text-clay">
        Pending changes <span className="font-normal text-muted">({changes.length})</span>
      </h3>
      {changes.length === 0 ? (
        <p className="mt-2 text-sm text-muted">
          No field differences found. Approving republishes the same details.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-sand">
          {changes.map((c) => (
            <li key={c.label} className="grid gap-1.5 py-2.5 text-sm sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted sm:pt-0.5">{c.label}</span>
              {c.kind === "image" ? (
                <span className="flex items-center gap-3">
                  <Photo url={c.before} label="Current photo" />
                  <span aria-hidden className="text-muted">→</span>
                  <Photo url={c.after} label="New photo" />
                </span>
              ) : (
                <span className="flex min-w-0 flex-col gap-0.5">
                  <Value value={c.before} tone="before" />
                  <span className="flex min-w-0 items-start gap-1.5">
                    <span aria-hidden className="text-muted">→</span>
                    <Value value={c.after} tone="after" />
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
