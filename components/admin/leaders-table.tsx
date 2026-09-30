"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { AdminLeader } from "@/lib/hygraph/leaders";
import { unmatchableWarnings } from "@/lib/leaders/matching";
import { isPending, reviewState, type ReviewState } from "@/lib/leaders/review";
import { LIFE_STAGES, LIFE_STAGE_LABELS, type LifeStage } from "@/lib/leaders/schema";
import { Avatar } from "./avatar";
import { Icon } from "./icons";
import { LeaderModal } from "./leader-modal";
import { Pill, btnPrimary, card, inputCls } from "./ui";

type Status = "all" | "pending" | "live" | "inactive";
type SortKey = "name" | "stage" | "members";

const STAGE_SHORT: Record<LifeStage, string> = {
  anointedProfessional: "Professional",
  anointedYoungAdult: "Young Adult",
  anointedYouth: "Youth",
};

const isPendingLeader = (l: AdminLeader) => isPending(reviewState(l));
const isActive = (l: AdminLeader) => l.isActive ?? true;

const REVIEW_PILL: Record<ReviewState, { tone: "amber" | "sky" | "sage"; label: string }> = {
  new: { tone: "amber", label: "New submission" },
  changes: { tone: "sky", label: "Changes pending" },
  live: { tone: "sage", label: "Live" },
};

function SortHeader({
  label,
  k,
  sort,
  onSort,
  className = "",
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: 1 | -1 };
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const on = sort.key === k;
  return (
    <th
      scope="col"
      aria-sort={on ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
      className={`px-4 py-3 text-left font-medium ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1.5 transition hover:text-clay ${on ? "text-clay" : ""}`}
      >
        {label}
        <Icon name="sort" className={`h-3 w-3 ${on ? "opacity-100" : "opacity-40"}`} />
      </button>
    </th>
  );
}

export function LeadersTable({ leaders }: { leaders: AdminLeader[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [stage, setStage] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeModal = useCallback(() => setSelectedId(null), []);

  const counts = useMemo(
    () => ({
      all: leaders.length,
      pending: leaders.filter(isPendingLeader).length,
      live: leaders.filter((l) => !isPendingLeader(l)).length,
      inactive: leaders.filter((l) => !isActive(l)).length,
    }),
    [leaders],
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = leaders.filter((l) => {
      if (needle && !`${l.name} ${l.slug}`.toLowerCase().includes(needle)) return false;
      if (stage && l.lifeStages !== stage) return false;
      if (status === "pending" && !isPendingLeader(l)) return false;
      if (status === "live" && isPendingLeader(l)) return false;
      if (status === "inactive" && isActive(l)) return false;
      return true;
    });
    const stageIdx = (l: AdminLeader) => (l.lifeStages ? LIFE_STAGES.indexOf(l.lifeStages) : 99);
    return filtered.sort((a, b) => {
      const cmp =
        sort.key === "name"
          ? a.name.localeCompare(b.name)
          : sort.key === "stage"
            ? stageIdx(a) - stageIdx(b)
            : (a.memberCount ?? -1) - (b.memberCount ?? -1);
      return (cmp || a.name.localeCompare(b.name)) * sort.dir;
    });
  }, [leaders, q, status, stage, sort]);

  const selected = leaders.find((l) => l.id === selectedId) ?? null;
  const filtersOn = q !== "" || status !== "all" || stage !== "";

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));
  }

  const chips: { id: Status; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending review" },
    { id: "live", label: "Live" },
    { id: "inactive", label: "Inactive" },
  ];

  return (
    <section className={`${card} overflow-hidden`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-sand p-4">
        <div className="relative min-w-[200px] flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name…"
            aria-label="Search leaders"
            className={`${inputCls} !mt-0 pl-10`}
          />
        </div>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          aria-label="Filter by life stage"
          className={`${inputCls} !mt-0 w-auto`}
        >
          <option value="">All life stages</option>
          {LIFE_STAGES.map((s) => (
            <option key={s} value={s}>
              {LIFE_STAGE_LABELS[s]}
            </option>
          ))}
        </select>
        <div role="group" aria-label="Filter by status" className="flex rounded-xl bg-sand p-1">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={status === c.id}
              onClick={() => setStatus(c.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                status === c.id ? "bg-white text-clay shadow-sm" : "text-muted hover:text-clay"
              }`}
            >
              {c.label}
              <span className="ml-1.5 text-muted/70">{counts[c.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-sand bg-cream/70 text-xs uppercase tracking-wide text-muted">
              <SortHeader label="Leader" k="name" sort={sort} onSort={toggleSort} />
              <SortHeader label="Life stage" k="stage" sort={sort} onSort={toggleSort} className="hidden sm:table-cell" />
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Status
              </th>
              <SortHeader label="Members" k="members" sort={sort} onSort={toggleSort} className="hidden md:table-cell" />
              <th scope="col" className="w-10 px-4 py-3">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/70">
            {rows.map((l) => {
              const review = reviewState(l);
              const pill = REVIEW_PILL[review];
              const active = isActive(l);
              const warn = unmatchableWarnings({
                isActive: active,
                lifeStages: l.lifeStages,
                supportedGenders: l.supportedGenders,
                acceptsLgbt: l.acceptsLgbt ?? false,
              });
              return (
                <tr
                  key={l.id}
                  onClick={() => setSelectedId(l.id)}
                  className={`group cursor-pointer transition-colors hover:bg-cream/80 ${
                    review === "new" ? "bg-amber/[0.06]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={l.name} url={l.profileImage?.url} className="h-11 w-11 rounded-xl text-sm" />
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(l.id);
                          }}
                          className="flex items-center gap-1.5 text-left font-medium text-clay group-hover:text-rose-deep"
                        >
                          <span className="truncate">{l.name}</span>
                          {warn.length > 0 && (
                            <span title={warn[0]} className="text-amber">
                              <Icon name="alert" className="h-4 w-4" />
                              <span className="sr-only">{warn[0]}</span>
                            </span>
                          )}
                        </button>
                        <p className="truncate font-mono text-xs text-muted">/{l.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {l.lifeStages ? (
                      <Pill tone="rose">{STAGE_SHORT[l.lifeStages]}</Pill>
                    ) : (
                      <span className="text-muted/60">–</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Pill tone={pill.tone} dot>
                        {pill.label}
                      </Pill>
                      {!active && <Pill tone="muted">Inactive</Pill>}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 tabular-nums text-muted md:table-cell">{l.memberCount ?? "–"}</td>
                  <td className="px-4 py-3 text-right text-muted/50 transition group-hover:translate-x-0.5 group-hover:text-rose-deep">
                    <Icon name="chevron" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sand text-muted">
              <Icon name={leaders.length === 0 ? "users" : "search"} className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-xl text-clay">
              {leaders.length === 0 ? "No leaders yet" : "No leaders match"}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted">
              {leaders.length === 0
                ? "Add your first leader so people can find a Life Group."
                : "Try a different search or clear the filters."}
            </p>
            {leaders.length === 0 ? (
              <Link href="/admin/leaders/new" className={`${btnPrimary} mt-5`}>
                <Icon name="plus" /> Add leader
              </Link>
            ) : (
              filtersOn && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setStatus("all");
                    setStage("");
                  }}
                  className="mt-4 text-sm font-medium text-rose-deep underline underline-offset-4"
                >
                  Clear filters
                </button>
              )
            )}
          </div>
        )}
      </div>

      <div className="border-t border-sand bg-cream/50 px-4 py-2.5 text-xs text-muted">
        Showing {rows.length} of {leaders.length} · Click a row for details
      </div>

      {selected && <LeaderModal key={selected.id} leader={selected} onClose={closeModal} />}
    </section>
  );
}
