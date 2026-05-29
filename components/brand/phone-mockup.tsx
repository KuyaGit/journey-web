export function PhoneMockup() {
  return (
    <div
      className="relative mx-auto"
      style={{ width: "272px", height: "548px" }}
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-[-20px] rounded-[80px] animate-pulse-glow"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(224,90,122,0.18) 0%, rgba(232,162,61,0.08) 60%, transparent 80%)",
        }}
      />

      {/* Device shell */}
      <div
        className="absolute inset-0 rounded-[44px]"
        style={{
          background: "#2a1e18",
          boxShadow:
            "0 32px 80px -12px rgba(59,42,32,0.45), 0 4px 16px -4px rgba(59,42,32,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Screen bezel */}
        <div
          className="absolute rounded-[40px] overflow-hidden"
          style={{
            inset: "3px",
            background: "#fbf6ef",
          }}
        >
          {/* Dynamic island / notch */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-10"
            style={{
              width: "88px",
              height: "24px",
              borderRadius: "100px",
              background: "#2a1e18",
            }}
          />

          {/* App content */}
          <div
            className="absolute inset-0 flex flex-col"
            style={{ paddingTop: "48px", background: "#fbf6ef" }}
          >
            {/* Status-bar-like row */}
            <div className="flex items-center justify-between px-5 pb-3">
              {/* Hearts */}
              <div className="flex gap-1">
                {[true, true, false].map((active, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "14px",
                      filter: active ? "none" : "grayscale(1) opacity(0.35)",
                    }}
                  >
                    ❤️
                  </span>
                ))}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6b5648",
                  opacity: 0.7,
                }}
              >
                Q 3 / 10
              </span>
            </div>

            {/* XP bar */}
            <div className="px-5 pb-4">
              <div
                style={{
                  height: "6px",
                  borderRadius: "100px",
                  background: "#f3e9dc",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "28%",
                    height: "100%",
                    borderRadius: "100px",
                    background: "linear-gradient(90deg, #e8a23d, #e05a7a)",
                  }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="flex-1 px-4 pb-4 flex flex-col gap-3">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "16px",
                  boxShadow: "0 2px 12px 0 rgba(59,42,32,0.08)",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#e05a7a",
                  }}
                >
                  Volume 1 · Q3
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#3b2a20",
                    lineHeight: "1.4",
                  }}
                >
                  Ano ang ibig sabihin ng &ldquo;GO&rdquo; sa Seed Cycle?
                </div>

                {/* Answer options */}
                {[
                  { text: "Share the Gospel", selected: false },
                  { text: "Build Friendships", selected: true },
                  { text: "Connect to Church", selected: false },
                  { text: "Raise Up Leaders", selected: false },
                ].map((opt) => (
                  <div
                    key={opt.text}
                    style={{
                      borderRadius: "12px",
                      padding: "8px 12px",
                      fontSize: "11px",
                      fontWeight: opt.selected ? 600 : 500,
                      color: opt.selected ? "#e05a7a" : "#6b5648",
                      background: opt.selected
                        ? "rgba(224,90,122,0.08)"
                        : "transparent",
                      border: `1.5px solid ${opt.selected ? "#e05a7a" : "#f3e9dc"}`,
                    }}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom nav */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                paddingBottom: "20px",
                paddingTop: "6px",
                borderTop: "1px solid #f3e9dc",
              }}
            >
              {["🏠", "🎯", "📖", "❤️"].map((icon) => (
                <span
                  key={icon}
                  style={{ fontSize: "18px", opacity: icon === "🎯" ? 1 : 0.4 }}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side buttons */}
      <div
        style={{
          position: "absolute",
          right: "-2px",
          top: "96px",
          width: "3px",
          height: "52px",
          background: "#2a1e18",
          borderRadius: "0 4px 4px 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-2px",
          top: "84px",
          width: "3px",
          height: "36px",
          background: "#2a1e18",
          borderRadius: "4px 0 0 4px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-2px",
          top: "132px",
          width: "3px",
          height: "56px",
          background: "#2a1e18",
          borderRadius: "4px 0 0 4px",
        }}
      />
    </div>
  );
}
