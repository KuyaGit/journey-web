const trustPoints = [
  { icon: "🇵🇭", label: "Taglish · Filipino Faith" },
  { icon: "📱", label: "iOS · Android · Web" },
  { icon: "🆓", label: "Completely Free" },
  { icon: "🏠", label: "Built for Life Groups" },
  { icon: "🌱", label: "The Seed Cycle" },
];

export function TrustStrip() {
  return (
    <section
      className="border-y border-sand/70 py-4"
      style={{ background: "#f3e9dc" }}
      aria-label="App highlights"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
          {trustPoints.map((point, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-muted font-medium"
            >
              <span aria-hidden="true">{point.icon}</span>
              <span>{point.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
