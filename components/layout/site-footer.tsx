import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { StoreBadges } from "@/components/brand/store-badges";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-clay text-cream/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-cream/10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo variant="dark" />
            <p className="text-sm text-cream/55 leading-relaxed max-w-xs">
              {siteConfig.tagline}
              <br />A discipleship companion for Filipino church communities.
            </p>
            <StoreBadges size="sm" variant="light" />
          </div>

          {/* Pages */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cream/35 mb-4">
              Explore
            </p>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-cream/60 hover:text-cream transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cream/35 mb-4">
              Connect
            </p>
            <a
              href={`mailto:${siteConfig.organization.email}`}
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              {siteConfig.organization.email}
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/35">
            © {new Date().getFullYear()} {siteConfig.organization.name}. All
            rights reserved.
          </p>
          <p className="text-xs text-cream/35">
            Made with 🌱 for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}
