"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";
import { Icon, type IconName } from "./icons";

const NAV: { href: string; label: string; icon: IconName; match: (p: string) => boolean }[] = [
  {
    href: "/admin/leaders",
    label: "Leaders",
    icon: "users",
    match: (p) => p.startsWith("/admin/leaders") && p !== "/admin/leaders/new",
  },
  { href: "/admin/leaders/new", label: "New leader", icon: "plus", match: (p) => p === "/admin/leaders/new" },
  { href: "/admin/invites", label: "Invite leader", icon: "mail", match: (p) => p.startsWith("/admin/invites") },
];

function Brand() {
  return (
    <Link href="/admin/leaders" className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose to-amber font-display text-xl font-semibold text-white shadow-lg shadow-rose/30">
        J
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg text-cream">Journey</span>
        <span className="block text-[11px] uppercase tracking-[0.16em] text-cream/50">Leaders admin</span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-clay text-cream lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:px-5 lg:py-7">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:p-0">
        <Brand />
        <form action={logout} className="lg:hidden">
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-cream/70 transition hover:bg-white/10 hover:text-cream"
            aria-label="Sign out"
          >
            <Icon name="logout" />
          </button>
        </form>
      </div>

      <nav
        aria-label="Admin"
        className="flex gap-1 overflow-x-auto px-3 pb-3 lg:mt-9 lg:flex-col lg:overflow-visible lg:p-0"
      >
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white/12 text-white shadow-inner ring-1 ring-white/10"
                  : "text-cream/65 hover:bg-white/8 hover:text-cream"
              }`}
            >
              <Icon name={item.icon} className="h-[18px] w-[18px]" />
              {item.label}
              {active && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-rose lg:block" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden lg:block">
        <p className="rounded-xl bg-white/6 p-3.5 text-xs leading-relaxed text-cream/60 ring-1 ring-white/8">
          Saves are drafts. Nothing reaches the Grow app until you <em className="not-italic text-cream">Approve</em> it.
          Use Deactivate to hide a leader instead of deleting.
        </p>
        <form action={logout} className="mt-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-cream/65 transition hover:bg-white/8 hover:text-cream">
            <Icon name="logout" className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
