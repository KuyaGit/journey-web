import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Required for output: 'export' — prerender this image at build time
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const iconData = await readFile(join(process.cwd(), "public/icon.png"));
  const iconSrc = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fbf6ef 0%, #f3e9dc 55%, #fbf1e8 100%)",
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background warm glow top-right */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(224,90,122,0.18) 0%, transparent 65%)",
          }}
        />
        {/* Background glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "440px",
            height: "440px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,162,61,0.14) 0%, transparent 65%)",
          }}
        />

        {/* Real app icon — plain <img> is required inside ImageResponse JSX */}
        <img
          src={iconSrc}
          alt=""
          width={120}
          height={120}
          style={{ borderRadius: "28px", marginBottom: "28px" }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: "700",
            color: "#3b2a20",
            letterSpacing: "-2px",
            marginBottom: "16px",
            lineHeight: 1,
          }}
        >
          Journey
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "30px",
            color: "#6b5648",
            marginBottom: "40px",
            fontWeight: "400",
          }}
        >
          Grow in faith. One day at a time.
        </div>

        {/* Seed Cycle pills */}
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { label: "🌱 GO", color: "#7c9a82" },
            { label: "🌿 GROW", color: "#5b8bb0" },
            { label: "✨ GLOW", color: "#e8a23d" },
            { label: "🔥 GENERATE", color: "#e05a7a" },
          ].map((step) => (
            <div
              key={step.label}
              style={{
                padding: "10px 22px",
                borderRadius: "100px",
                border: `1.5px solid ${step.color}40`,
                background: `${step.color}15`,
                fontSize: "18px",
                fontWeight: "600",
                color: step.color,
              }}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
