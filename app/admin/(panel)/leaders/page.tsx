import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { listLeaders } from "@/lib/hygraph/leaders";
import { unmatchableWarnings } from "@/lib/leaders/matching";
import { isPending, reviewState } from "@/lib/leaders/review";
import { Icon } from "@/components/admin/icons";
import { LeadersTable } from "@/components/admin/leaders-table";
import { PageHeader, StatCard, btnPrimary } from "@/components/admin/ui";

export default async function LeadersPage() {
  await requireAdmin();
  const leaders = await listLeaders();

  const pendingCount = leaders.filter((l) => isPending(reviewState(l))).length;
  const newCount = leaders.filter((l) => reviewState(l) === "new").length;
  const needsAttention = leaders.filter(
    (l) =>
      unmatchableWarnings({
        isActive: l.isActive ?? true,
        lifeStages: l.lifeStages,
        supportedGenders: l.supportedGenders,
        acceptsLgbt: l.acceptsLgbt ?? false,
      }).length > 0 || !l.leaderContact,
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Life Groups"
        title="Leaders"
        description="The people shown to members in the Grow app. Nothing is visible until you approve it."
        actions={
          <Link href="/admin/leaders/new" className={btnPrimary}>
            <Icon name="plus" /> New leader
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total leaders" value={leaders.length} hint="In your Hygraph project" icon="users" tone="sky" />
        <StatCard
          label="Live"
          value={leaders.length - pendingCount}
          hint="Approved and visible in the app"
          icon="eye"
          tone="sage"
        />
        <StatCard
          label="Pending review"
          value={pendingCount}
          hint={newCount ? `${newCount} new submission${newCount === 1 ? "" : "s"}` : "Waiting for your approval"}
          icon="layers"
          tone={pendingCount ? "amber" : "muted"}
        />
        <StatCard
          label="Needs attention"
          value={needsAttention}
          hint="Can't be matched or no contact"
          icon="alert"
          tone={needsAttention ? "rose" : "muted"}
        />
      </div>

      <LeadersTable leaders={leaders} />
    </div>
  );
}
