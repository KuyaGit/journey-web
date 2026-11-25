import { Icon, type IconName } from "@/components/admin/icons";
import { LifeGroupForm } from "@/components/admin/life-group-form";
import { card } from "@/components/admin/ui";
import { listLifeGroupLeaderOptions } from "@/lib/hygraph/leaders";
import { verifyInvite } from "@/lib/invites/token";
import { requestHumanCheck } from "../actions";
import { submitLifeGroupLeader } from "./actions";

function Notice({ icon, title, children }: { icon: IconName; title: string; children: React.ReactNode }) {
  return (
    <div className={`${card} flex flex-col items-center px-6 py-14 text-center`}>
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sand text-muted">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h1 className="mt-4 font-display text-2xl text-clay">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">{children}</p>
    </div>
  );
}

export default async function LifeGroupLeaderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await verifyInvite(token);

  if (invite.status === "expired") {
    return (
      <Notice icon="clock" title="This QR code has expired">
        Links only last 24 hours. Please ask your admin for a new QR code or link.
      </Notice>
    );
  }
  if (invite.status === "invalid") {
    return (
      <Notice icon="lock" title="This link isn't valid">
        It may have been mistyped or copied incompletely. Please ask your admin for a new link.
      </Notice>
    );
  }

  const leaders = await listLifeGroupLeaderOptions();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Life Group leader</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight text-clay sm:text-4xl">
          Who leads your Life Group?
        </h1>
        <p className="mt-2 text-sm text-muted">
          Find your name, confirm your email, then choose the leader of your own Life Group. It takes less
          than a minute.
        </p>
      </div>
      <LifeGroupForm
        leaders={leaders}
        action={submitLifeGroupLeader.bind(null, token)}
        humanCheck={requestHumanCheck.bind(null, token)}
      />
    </div>
  );
}
