const GRADIENTS = [
  "from-rose to-amber",
  "from-sky-brand to-sage",
  "from-amber to-rose-deep",
  "from-sage to-sky-brand",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({
  name,
  url,
  className = "h-10 w-10 rounded-xl text-sm",
}: {
  name: string;
  url?: string | null;
  className?: string;
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="" loading="lazy" className={`${className} shrink-0 bg-sand object-cover`} />
    );
  }
  const g = GRADIENTS[(name.charCodeAt(0) || 0) % GRADIENTS.length];
  return (
    <span
      aria-hidden
      className={`${className} grid shrink-0 place-items-center bg-gradient-to-br ${g} font-semibold text-white`}
    >
      {initials(name)}
    </span>
  );
}
