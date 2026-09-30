import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// `admin` scopes the focus-ring overrides in globals.css. No marketing header/footer here:
// those live in app/(site)/layout.tsx.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin flex min-h-screen flex-1 flex-col">{children}</div>;
}
