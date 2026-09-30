import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { getLeader } from "@/lib/hygraph/leaders";
import { Avatar } from "@/components/admin/avatar";
import { LeaderForm } from "@/components/admin/leader-form";
import { MatchPreview } from "@/components/admin/match-preview";
import { ActionButton } from "@/components/admin/action-button";
import { Icon } from "@/components/admin/icons";
import { PageHeader, Pill, btnRose, card } from "@/components/admin/ui";
import { reviewState } from "@/lib/leaders/review";
import { approveAction, saveLeader } from "../actions";

export default async function EditLeaderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const leader = await getLeader(id);
  if (!leader) notFound();

  const review = reviewState(leader);
  const active = leader.isActive ?? true;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/leaders" className="text-sm text-muted underline-offset-4 hover:text-clay hover:underline">
          ← All leaders
        </Link>
        <div className="mt-3">
          <PageHeader
            eyebrow="Edit leader"
            title={leader.name}
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={review === "new" ? "amber" : review === "live" ? "sage" : "sky"} dot>
                  {review === "new" ? "New submission" : review === "live" ? "Live" : "Changes pending"}
                </Pill>
                <Pill tone={active ? "sky" : "muted"} dot>
                  {active ? "Active" : "Inactive"}
                </Pill>
                {review !== "live" && (
                  <form action={approveAction}>
                    <input type="hidden" name="id" value={leader.id} />
                    <ActionButton className={btnRose} pendingLabel="Publishing…">
                      <Icon name="check" /> Approve &amp; publish
                    </ActionButton>
                  </form>
                )}
              </div>
            }
          />
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <LeaderForm
          leader={leader}
          action={saveLeader.bind(null, leader.id, leader.leaderContact?.id ?? null)}
        />
        <aside className="space-y-5 lg:sticky lg:top-8">
          <div className={`${card} flex items-center gap-4 p-4`}>
            <Avatar name={leader.name} url={leader.profileImage?.url} className="h-16 w-16 rounded-2xl text-xl" />
            <div className="min-w-0">
              <p className="truncate font-medium text-clay">{leader.name}</p>
              <p className="truncate font-mono text-xs text-muted">/{leader.slug}</p>
            </div>
          </div>
          <div className={`${card} p-4`}>
            <h2 className="mb-1 font-display text-lg text-clay">Appears for</h2>
            <p className="mb-3 text-xs text-muted">Based on the last saved version.</p>
            <MatchPreview
              leader={{
                isActive: active,
                lifeStages: leader.lifeStages,
                supportedGenders: leader.supportedGenders,
                acceptsLgbt: leader.acceptsLgbt ?? false,
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
