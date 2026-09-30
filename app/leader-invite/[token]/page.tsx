import { LeaderForm } from "@/components/admin/leader-form";
import { Icon, type IconName } from "@/components/admin/icons";
import { card } from "@/components/admin/ui";
import { contactEmailExists } from "@/lib/hygraph/leaders";
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
  const claims = await verifyInvite(token);

  if (!claims) {
    return (
      <Notice icon="lock" title="This link isn't valid">
        It may have expired or been mistyped. Please ask your admin to send you a new invite link.
      </Notice>
    );
  }

  if (await contactEmailExists(claims.email)) {
    return (
      <Notice icon="check" title="This invite was already used">
        Your profile has been received. If you need to change something, ask your admin.
      </Notice>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep">Life Group leader</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight text-clay sm:text-4xl">
          {claims.name ? `Welcome, ${claims.name.split(" ")[0]}` : "Welcome"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tell us about yourself and your group. This takes about 3 minutes. An admin will review your
          profile before anyone sees it.
        </p>
      </div>
      <LeaderForm
        variant="invite"
        lockedEmail={claims.email}
        initialName={claims.name}
        action={submitInvite.bind(null, token)}
        humanCheck={requestHumanCheck.bind(null, token)}
      />
    </div>
  );
}
