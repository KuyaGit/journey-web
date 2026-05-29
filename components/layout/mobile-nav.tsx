"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex flex-col justify-center gap-[5px] w-9 h-9 rounded-lg hover:bg-sand transition-colors"
      >
        <span
          className="block w-5 h-[1.5px] bg-clay mx-auto transition-all duration-200 origin-center"
          style={
            open
              ? { transform: "translateY(6.5px) rotate(45deg)" }
              : undefined
          }
        />
        <span
          className="block w-5 h-[1.5px] bg-clay mx-auto transition-all duration-200"
          style={open ? { opacity: 0, transform: "scaleX(0)" } : undefined}
        />
        <span
          className="block w-5 h-[1.5px] bg-clay mx-auto transition-all duration-200 origin-center"
          style={
            open
              ? { transform: "translateY(-6.5px) rotate(-45deg)" }
              : undefined
          }
        />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-clay/20 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        className={`fixed inset-x-0 top-16 z-50 bg-cream border-b border-sand shadow-xl transition-all duration-200 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-5 py-6 flex flex-col gap-1">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-clay hover:text-rose transition-colors border-b border-sand last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4">
            <Link
              href={siteConfig.storeLinks.appStore}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full bg-rose text-cream text-sm font-semibold px-4 py-3 rounded-xl hover:bg-rose-deep transition-colors"
            >
              Get the App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
