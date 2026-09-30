import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { LeaderForm } from "@/components/admin/leader-form";
import { PageHeader } from "@/components/admin/ui";
import { saveLeader } from "../actions";

export default async function NewLeaderPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/admin/leaders" className="text-sm text-muted underline-offset-4 hover:text-clay hover:underline">
          ← All leaders
        </Link>
        <div className="mt-3">
          <PageHeader
            eyebrow="Life Groups"
            title="New leader"
            description="Add a leader. They become visible in the app as soon as you save."
          />
        </div>
      </div>
      <LeaderForm action={saveLeader.bind(null, null, null)} />
    </div>
  );
}
