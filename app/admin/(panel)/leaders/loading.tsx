import { card } from "@/components/admin/ui";

const bar = "animate-pulse rounded-lg bg-sand";

export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading leaders">
      <div className="space-y-3">
        <div className={`${bar} h-3 w-24`} />
        <div className={`${bar} h-9 w-48`} />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${card} space-y-3 p-5`}>
            <div className={`${bar} h-3 w-20`} />
            <div className={`${bar} h-9 w-14`} />
            <div className={`${bar} h-3 w-28`} />
          </div>
        ))}
      </div>
      <div className={`${card} divide-y divide-sand`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className={`${bar} h-11 w-11 rounded-xl`} />
            <div className="flex-1 space-y-2">
              <div className={`${bar} h-3.5 w-40`} />
              <div className={`${bar} h-3 w-24`} />
            </div>
            <div className={`${bar} h-6 w-20 rounded-full`} />
          </div>
        ))}
      </div>
    </div>
  );
}
