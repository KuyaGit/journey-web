"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cleanTag, tagKey, TAG_MAX_LENGTH, type AddTagResult } from "@/lib/leaders/tags";
import { fold } from "@/lib/text";
import { Icon } from "./icons";

/**
 * Multi-select for a shared list (hobbies, interests): chips for what's picked, a search box, and an
 * "Add" row that saves a new item to Hygraph when it isn't in the list and isn't picked yet.
 * Posts the picked values comma-joined in a hidden input named `name`.
 */
export function TagSelect({
  name,
  label,
  options: initialOptions,
  defaultValue = [],
  onAdd,
  placeholder = "Search or add…",
  hint,
}: {
  name: string;
  label: string;
  /** Approved items from Hygraph. */
  options: string[];
  defaultValue?: string[];
  /** Saves a new item in Hygraph and returns its stored spelling. */
  onAdd: (name: string) => Promise<AddTagResult>;
  placeholder?: string;
  hint?: React.ReactNode;
}) {
  const id = useId();
  const [options, setOptions] = useState(initialOptions);
  const [picked, setPicked] = useState<string[]>(defaultValue);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const pickedKeys = useMemo(() => new Set(picked.map(tagKey)), [picked]);
  const typed = cleanTag(query);
  const typedKey = tagKey(typed);

  const hits = useMemo(() => {
    const q = fold(typed);
    return options.filter((o) => !pickedKeys.has(tagKey(o)) && (!q || fold(o).includes(q)));
  }, [options, pickedKeys, typed]);

  // "Add" only when the text matches nothing in the list and nothing already picked.
  const canAdd =
    !!typed && !pickedKeys.has(typedKey) && !options.some((o) => tagKey(o) === typedKey);
  const rows = hits.length + (canAdd ? 1 : 0);
  const listId = `${id}-list`;

  // Close on any click outside.
  useEffect(() => {
    if (!open) return;
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

  function pick(value: string) {
    if (!pickedKeys.has(tagKey(value))) setPicked((p) => [...p, value]);
    setQuery("");
    setActive(0);
    setError("");
    inputRef.current?.focus();
  }

  function remove(value: string) {
    setPicked((p) => p.filter((v) => v !== value));
    inputRef.current?.focus();
  }

  async function add() {
    if (!canAdd || adding) return;
    if (typed.length > TAG_MAX_LENGTH) {
      setError(`Keep it under ${TAG_MAX_LENGTH} characters.`);
      return;
    }
    setAdding(true);
    setError("");
    try {
      const res = await onAdd(typed);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOptions((o) => (o.some((x) => tagKey(x) === tagKey(res.name)) ? o : [...o, res.name].sort()));
      pick(res.name);
    } catch {
      setError("Couldn't add it. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(rows - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      // Never submit the surrounding form from inside the search box.
      e.preventDefault();
      if (!open) return;
      if (active < hits.length) pick(hits[active]);
      else if (canAdd) void add();
    } else if (e.key === "Backspace" && !query && picked.length) {
      setPicked((p) => p.slice(0, -1));
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={picked.join(",")} />
      <span id={`${id}-label`} className="block text-sm font-medium text-clay">
        {label}
      </span>

      <div
        onClick={() => {
          inputRef.current?.focus();
          setOpen(true);
        }}
        className={`mt-1.5 flex min-h-[46px] w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl border bg-white px-2.5 py-2 text-sm transition ${
          open ? "border-rose ring-4 ring-rose/15" : "border-sand hover:border-clay/30"
        }`}
      >
        {picked.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-clay"
          >
            {v}
            <button
              type="button"
              aria-label={`Remove ${v}`}
              onClick={(e) => {
                e.stopPropagation();
                remove(v);
              }}
              className="grid h-4 w-4 place-items-center rounded-full text-muted hover:bg-clay/10 hover:text-clay"
            >
              <Icon name="x" className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-labelledby={`${id}-label`}
          aria-activedescendant={open && rows ? `${id}-opt-${active}` : undefined}
          value={query}
          maxLength={TAG_MAX_LENGTH + 10}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setError("");
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={picked.length ? "" : placeholder}
          autoComplete="off"
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-clay outline-none placeholder:text-muted/60"
        />
      </div>

      {error ? (
        <span role="alert" className="mt-1.5 block text-xs text-rose-deep">
          {error}
        </span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>
      )}

      {open && (
        <div className="animate-pop-in absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-sand bg-white shadow-[0_24px_48px_-20px_rgba(59,42,32,0.35)]">
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-multiselectable
            aria-labelledby={`${id}-label`}
            className="max-h-60 overflow-y-auto p-1.5"
          >
            {rows === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted">
                {typed ? "Already picked." : options.length ? "Everything is picked." : "Type to add the first one."}
              </li>
            )}
            {hits.map((o, i) => (
              <li
                key={o}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={false}
                data-index={i}
                onPointerMove={() => setActive(i)}
                onClick={() => pick(o)}
                className={`cursor-pointer truncate rounded-xl px-2.5 py-2 text-sm text-clay transition-colors ${
                  i === active ? "bg-cream" : ""
                }`}
              >
                {o}
              </li>
            ))}
            {canAdd && (
              <li
                id={`${id}-opt-${hits.length}`}
                role="option"
                aria-selected={false}
                data-index={hits.length}
                onPointerMove={() => setActive(hits.length)}
                onClick={() => void add()}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-rose-deep transition-colors ${
                  active === hits.length ? "bg-cream" : ""
                } ${adding ? "pointer-events-none opacity-60" : ""}`}
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose/10">
                  <Icon name="plus" className="h-3.5 w-3.5" />
                </span>
                <span className="truncate">{adding ? `Adding “${typed}”…` : `Add “${typed}”`}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
