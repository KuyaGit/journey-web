interface StoreBadgesProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

const heights = {
  sm: "h-10 px-3.5 text-[11px]",
  md: "h-12 px-4 text-[12px]",
  lg: "h-14 px-5 text-[13px]",
};

const iconSizes = { sm: 16, md: 20, lg: 22 };

export function StoreBadges({
  className = "",
  size = "md",
  variant = "dark",
}: StoreBadgesProps) {
  const bg =
    variant === "dark"
      ? "bg-clay hover:bg-clay/90 text-cream"
      : "bg-cream hover:bg-sand text-clay border border-sand";

  const h = heights[size];
  const iconSize = iconSizes[size];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* App Store — coming soon */}
      <div
        aria-label="App Store — Coming Soon"
        aria-disabled="true"
        className={`relative inline-flex items-center gap-2.5 ${h} ${bg} rounded-xl font-medium opacity-50 cursor-not-allowed select-none`}
      >
        <AppleIcon size={iconSize} />
        <span className="flex flex-col items-start leading-tight">
          <span className="opacity-70" style={{ fontSize: "0.65em" }}>
            Download on the
          </span>
          <span style={{ fontSize: "1em" }}>App Store</span>
        </span>
        <span
          className="absolute -top-2 -right-2 rounded-full bg-rose px-1.5 py-0.5 text-cream leading-none font-semibold"
          style={{ fontSize: "0.6em" }}
        >
          Soon
        </span>
      </div>

      {/* Google Play */}
      <a
        href="https://play.google.com/store/apps/details?id=grow.ja1rosario.com"
        aria-label="Get it on Google Play"
        className={`inline-flex items-center gap-2.5 ${h} ${bg} rounded-xl transition-colors font-medium`}
      >
        <PlayIcon size={iconSize} />
        <span className="flex flex-col items-start leading-tight">
          <span className="opacity-70" style={{ fontSize: "0.65em" }}>
            Get it on
          </span>
          <span style={{ fontSize: "1em" }}>Google Play</span>
        </span>
      </a>
    </div>
  );
}

function AppleIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M3.18 23.76c.3.17.65.17.96 0l11.44-6.6-2.9-2.91L3.18 23.76z" fill="#7c9a82" />
      <path d="M21.54 10.6L19.11 9.2 16 12.25l3.11 3.1 2.43-1.4a1.72 1.72 0 0 0 0-3.35z" fill="#e8a23d" />
      <path d="M3.18.24a1 1 0 0 0-.96 0C2 .4 2 .57 2 .77v22.46l9.5-9.52L3.18.24z" fill="#5b8bb0" />
      <path d="M12.68 12.25 3.18.24 14.62 6.85l-1.94 5.4z" fill="#e05a7a" />
      <path d="M12.68 12.25l1.94 5.4-1.94 5.36L3.18 23.76l9.5-11.51z" fill="#c4456a" opacity=".8" />
    </svg>
  );
}
