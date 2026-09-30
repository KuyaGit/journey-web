import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leader profile",
  robots: { index: false, follow: false },
};

// Public, but private-by-link: no marketing header/footer and no admin sidebar.
// `admin` only scopes the focus-ring overrides in globals.css.
export default function LeaderInviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin flex min-h-screen flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center gap-3 px-5 pt-8">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose to-amber font-display text-xl font-semibold text-white shadow-lg shadow-rose/30">
          J
        </span>
        <span className="font-display text-lg text-clay">Journey</span>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8 sm:py-10">{children}</main>
    </div>
  );
}
