import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  size?: number;
}

export function Logo({ className = "", variant = "light", size = 36 }: LogoProps) {
  const textColor = variant === "dark" ? "text-cream" : "text-clay";

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className}`}
      aria-label="Journey — Home"
    >
      <Image
        src="/icon.png"
        alt="Journey app icon"
        width={size}
        height={size}
        style={{ width: size, height: "auto" }}
        className="flex-shrink-0 rounded-[8px]"
        priority
      />
      <span
        className={`text-[1.25rem] font-semibold tracking-tight leading-none ${textColor}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        Journey
      </span>
    </Link>
  );
}
