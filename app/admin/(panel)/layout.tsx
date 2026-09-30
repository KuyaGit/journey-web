import { requireAdmin } from "@/lib/auth/dal";
import { Sidebar } from "@/components/admin/sidebar";

// Authenticated shell. The login page sits outside this group, so it has no sidebar.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex-1 lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <Sidebar />
      <main className="min-w-0 px-4 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
