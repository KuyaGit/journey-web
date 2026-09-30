import { Icon, type IconName } from "./icons";

export const card =
  "rounded-2xl border border-sand bg-white shadow-[0_1px_2px_rgba(59,42,32,0.05),0_12px_32px_-16px_rgba(59,42,32,0.18)]";

const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";
export const btnPrimary = `${btn} bg-clay text-cream shadow-sm hover:bg-clay/90`;
export const btnRose = `${btn} bg-rose text-white shadow-sm hover:bg-rose-deep`;
export const btnGhost = `${btn} border border-sand bg-white text-clay hover:bg-cream`;
export const btnDanger = `${btn} border border-rose/30 bg-white text-rose-deep hover:bg-rose/10`;

export const inputCls =
  "mt-1.5 w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm text-clay placeholder:text-muted/60 transition focus:border-rose focus:ring-4 focus:ring-rose/15";

export const labelCls = "block text-sm font-medium text-clay";

type Tone = "sage" | "amber" | "muted" | "rose" | "sky";
const TONES: Record<Tone, string> = {
  sage: "bg-sage/15 text-[#4d6b54] ring-sage/30",
  amber: "bg-amber/15 text-[#9a6412] ring-amber/35",
  muted: "bg-sand text-muted ring-clay/10",
  rose: "bg-rose/10 text-rose-deep ring-rose/25",
  sky: "bg-sky-brand/12 text-[#3f6a8d] ring-sky-brand/25",
};

export function Pill({
  tone = "muted",
  dot = false,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: IconName;
  tone: Tone;
}) {
  return (
    <div className={`${card} relative overflow-hidden p-5`}>
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ring-inset ${TONES[tone]}`}>
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 font-display text-4xl tracking-tight text-clay">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">{eyebrow}</p>
        )}
        <h1 className="mt-1 font-display text-3xl tracking-tight text-clay sm:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-muted">{description}</p>}
      </div>
      {actions}
    </header>
  );
}
