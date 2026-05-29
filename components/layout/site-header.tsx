import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 border-b border-sand/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <Logo />

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-7 flex-1 justify-center"
          aria-label="Main navigation"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted hover:text-clay transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={siteConfig.storeLinks.appStore}
            className="hidden md:inline-flex items-center bg-rose text-cream text-sm font-semibold px-4 py-2 rounded-xl hover:bg-rose-deep transition-colors"
          >
            Get the App
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
