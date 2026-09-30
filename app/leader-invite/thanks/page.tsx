import { Icon } from "@/components/admin/icons";
import { card } from "@/components/admin/ui";

export default function ThanksPage() {
  return (
    <div className={`${card} animate-fade-up flex flex-col items-center px-6 py-16 text-center`}>
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sage/20 text-[#4d6b54]">
        <Icon name="check" className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-3xl tracking-tight text-clay">Thank you!</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Your profile was sent for review. An admin will check it and publish it. You don&apos;t need to do
        anything else.
      </p>
    </div>
  );
}
