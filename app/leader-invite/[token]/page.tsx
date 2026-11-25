import { LeaderForm } from "@/components/admin/leader-form";
import { Icon, type IconName } from "@/components/admin/icons";
import { card } from "@/components/admin/ui";
import { contactEmailExists, listLifeGroupLeaderOptions } from "@/lib/hygraph/leaders";
import { verifyInvite } from "@/lib/invites/token";
import { requestHumanCheck, submitInvite } from "./actions";

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

export default async function LeaderInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await verifyInvite(token);

  if (invite.status === "expired") {
    return (
      <Notice icon="clock" title="This QR code has expired">
        Invite links only last 24 hours. Please ask your admin for a new QR code or link.
      </Notice>
    );
  }

  if (invite.status === "invalid") {
    return (
      <Notice icon="lock" title="This link isn't valid">
        It may have been mistyped or copied incompletely. Please ask your admin to send you a new QR code or
        link.
      </Notice>
    );
  }

  const claims = invite;

  // Older links were issued for one email and are single use. Open QR links have no email, and the
  // submit action checks the email each leader types.
  if (claims.email && (await contactEmailExists(claims.email))) {
    return (
      <Notice icon="check" title="This invite was already used">
        Your profile has been received. If you need to change something, ask your admin.
      </Notice>
    );
  }

  const lifeGroupLeaders = await listLifeGroupLeaderOptions();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Life Group leader</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight text-clay sm:text-4xl">
          {claims.name ? `Welcome, ${claims.name.split(" ")[0]}` : "Welcome"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tell us about yourself and your group. This takes about 3 minutes. Your profile will be pending
          until an admin approves it, and nobody sees it before then.
        </p>
        <p className="mt-1 text-xs text-muted">
          This link is open until{" "}
          {claims.expiresAt.toLocaleString("en-US", {
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
          })}
          .
        </p>
      </div>
      <LeaderForm
        variant="invite"
        lockedEmail={claims.email}
        initialName={claims.name}
        action={submitInvite.bind(null, token)}
        humanCheck={requestHumanCheck.bind(null, token)}
        lifeGroupLeaders={lifeGroupLeaders}
      />
    </div>
  );
}
