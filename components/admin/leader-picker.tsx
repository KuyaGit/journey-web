"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LIFE_STAGES, LIFE_STAGE_SHORT, type LifeGroupLeaderOption } from "@/lib/leaders/schema";
import { Avatar } from "./avatar";
import { Icon } from "./icons";

/** Lower-case, accents removed, so "jose" finds "José". */
const fold = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const stageLabel = (o: LifeGroupLeaderOption) =>
  o.lifeStages ? `Anointed ${LIFE_STAGE_SHORT[o.lifeStages]}` : "No life stage";

/**
 * Searchable leader picker (ARIA combobox + listbox). Posts the chosen id in a hidden input named
 * `name`. Options are grouped by life stage, oldest first. Required-ness is enforced on the server,
 * because the browser does not validate hidden inputs.
 */
export function LeaderPicker({
  name,
  label,
  options,
  value,
  onChange,
  placeholder = "Select a leader",
  disabled = false,
  disabledText,
  emptyText = "No leaders to choose yet",
  hint,
}: {
  name: string;
  label: string;
  options: LifeGroupLeaderOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Shown on the closed picker while it is disabled (e.g. "Choose your life stage first"). */
  disabledText?: string;
  emptyText?: string;
  hint?: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.id === value) ?? null;

  // Flat list in display order (grouped by stage), so arrow keys move through it top to bottom.
  const groups = useMemo(() => {
    const q = fold(query.trim());
    const hits = q ? options.filter((o) => fold(o.name).includes(q)) : options;
    const order = [...LIFE_STAGES, null] as const;
    return order
      .map((stage) => ({ stage, items: hits.filter((o) => o.lifeStages === stage) }))
      .filter((g) => g.items.length > 0);
  }, [options, query]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const isDisabled = disabled || options.length === 0;

  function openList() {
    if (isDisabled) return;
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.id === value)));
    setOpen(true);
  }

  function choose(o: LifeGroupLeaderOption) {
    onChange(o.id);
    setOpen(false);
  }

  // Focus the search box on open; close on any click outside.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted row in view while moving with the keyboard.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      // Never submit the surrounding form from inside the search box.
      e.preventDefault();
      if (flat[active]) choose(flat[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const listId = `${id}-list`;
  let index = -1;

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <span id={`${id}-label`} className="block text-sm font-medium text-clay">
        {label}
      </span>

      {/* Closed state: shows the chosen leader, or the placeholder. */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        disabled={isDisabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openList();
          }
        }}
        className={`mt-1.5 flex w-full items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-left text-sm transition focus-visible:border-rose focus-visible:ring-4 focus-visible:ring-rose/15 disabled:cursor-not-allowed disabled:bg-cream ${
          open ? "border-rose ring-4 ring-rose/15" : "border-sand hover:border-clay/30"
        }`}
      >
        {selected ? (
          <>
            <Avatar name={selected.name} url={selected.imageUrl} className="h-9 w-9 rounded-lg text-xs" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-clay">{selected.name}</span>
              <span className="block truncate text-xs text-muted">{stageLabel(selected)}</span>
            </span>
          </>
        ) : (
          <>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-dashed border-clay/20 text-muted">
              <Icon name="users" className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1 truncate text-muted">
              {isDisabled ? (disabled ? (disabledText ?? placeholder) : emptyText) : placeholder}
            </span>
          </>
        )}
        <Icon
          name="chevron"
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </button>

      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}

      {open && (
        <div className="animate-pop-in absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-sand bg-white shadow-[0_24px_48px_-20px_rgba(59,42,32,0.35)]">
          <div className="flex items-center gap-2 border-b border-sand px-3.5">
            <Icon name="search" className="h-4 w-4 shrink-0 text-muted" />
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={flat[active] ? `${id}-opt-${flat[active].id}` : undefined}
              aria-label={`Search ${label.replace(/\s*\*$/, "").toLowerCase()}`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search by name…"
              autoComplete="off"
              className="w-full bg-transparent py-3 text-sm text-clay outline-none placeholder:text-muted/60"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted hover:bg-sand hover:text-clay"
              >
                <Icon name="x" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <ul ref={listRef} id={listId} role="listbox" aria-labelledby={`${id}-label`} className="max-h-72 overflow-y-auto p-1.5">
            {groups.length === 0 && (
              <li className="px-3 py-8 text-center text-sm text-muted">No leader named “{query.trim()}”.</li>
            )}
            {groups.map((g) => (
              <li key={g.stage ?? "none"} role="presentation">
                <p className="px-2.5 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-deep">
                  {g.stage ? `Anointed ${LIFE_STAGE_SHORT[g.stage]}` : "No life stage"}
                </p>
                <ul role="presentation">
                  {g.items.map((o) => {
                    index += 1;
                    const i = index;
                    const isActive = i === active;
                    const isSelected = o.id === value;
                    return (
                      <li
                        key={o.id}
                        id={`${id}-opt-${o.id}`}
                        role="option"
                        aria-selected={isSelected}
                        data-index={i}
                        onPointerMove={() => setActive(i)}
                        onClick={() => choose(o)}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors ${
                          isActive ? "bg-cream" : ""
                        }`}
                      >
                        <Avatar name={o.name} url={o.imageUrl} className="h-9 w-9 rounded-lg text-xs" />
                        <span className="min-w-0 flex-1 truncate text-sm text-clay">{o.name}</span>
                        {isSelected && (
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage/20 text-[#4d6b54]">
                            <Icon name="check" className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          <p className="border-t border-sand bg-cream/60 px-3.5 py-2 text-[11px] text-muted">
            {flat.length} of {options.length} leader{options.length === 1 ? "" : "s"} · ↑↓ to move, Enter to choose
          </p>
        </div>
      )}
    </div>
  );
}
