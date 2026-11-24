import { card } from "@/components/admin/ui";

const bar = "animate-pulse rounded-lg bg-sand";

// Matches the edit page layout (form + sticky sidebar) so the swap-in doesn't jump.
export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading leader">
      <div className="space-y-3">
        <div className={`${bar} h-3 w-20`} />
        <div className={`${bar} h-3 w-24`} />
        <div className={`${bar} h-9 w-56`} />
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${card} space-y-5 p-6`}>
              <div className={`${bar} h-5 w-32`} />
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className={`${bar} h-3 w-20`} />
                    <div className={`${bar} h-10 w-full rounded-xl`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="space-y-5">
          <div className={`${card} flex items-center gap-4 p-4`}>
            <div className={`${bar} h-16 w-16 rounded-2xl`} />
            <div className="flex-1 space-y-2">
              <div className={`${bar} h-3.5 w-32`} />
              <div className={`${bar} h-3 w-20`} />
            </div>
          </div>
          <div className={`${card} space-y-3 p-4`}>
            <div className={`${bar} h-5 w-28`} />
            <div className={`${bar} h-40 w-full rounded-xl`} />
          </div>
        </aside>
      </div>
    </div>
  );
}
