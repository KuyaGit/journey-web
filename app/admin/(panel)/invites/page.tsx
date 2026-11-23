import { requireAdmin } from "@/lib/auth/dal";
import { InviteForm } from "@/components/admin/invite-form";
import { PageHeader } from "@/components/admin/ui";

export default async function InvitesPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Life Groups"
        title="Invite leaders"
        description="Generate a QR code or link any leader can use for 24 hours. Nothing goes live until you approve it."
      />
      <InviteForm />
    </div>
  );
}
