/**
 * Blocks interaction and shows an animated loading card while waiting on the API.
 * `fixed` covers the whole screen; `contained` covers the nearest positioned parent (e.g. a modal).
 */
export function LoadingOverlay({
  label = "Working",
  hint,
  variant = "fixed",
}: {
  label?: string;
  hint?: string;
  variant?: "fixed" | "contained";
}) {
  // Labels are passed as "Unpublishing…"; the animated dots replace the ellipsis.
  const text = label.replace(/(…|\.\.\.)$/, "");

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-label={label}
      className={`admin animate-overlay-in ${
        variant === "fixed" ? "fixed z-[55]" : "absolute z-20"
      } inset-0 grid place-items-center bg-clay/30 p-6 backdrop-blur-sm`}
    >
      <div className="animate-pop-in w-full max-w-xs overflow-hidden rounded-3xl bg-cream text-center shadow-2xl ring-1 ring-clay/10">
        <div className="flex flex-col items-center px-8 pb-6 pt-8">
          <div className="relative grid h-16 w-16 place-items-center" aria-hidden>
            <span className="absolute inset-0 rounded-full border-4 border-sand" />
            <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-amber border-t-rose-deep" />
            <span className="h-3 w-3 animate-pulse rounded-full bg-rose" />
          </div>

          <p className="mt-5 flex items-baseline justify-center font-display text-xl tracking-tight text-clay">
            {text}
            <span className="ml-0.5 inline-flex gap-0.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="animate-loader-dot inline-block h-1 w-1 rounded-full bg-clay"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          </p>
          {hint && <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>}
        </div>

        <div className="h-1 w-full overflow-hidden bg-sand" aria-hidden>
          <div className="animate-loader-bar h-full w-2/5 rounded-full bg-gradient-to-r from-rose via-rose-deep to-amber" />
        </div>
      </div>
    </div>
  );
}
