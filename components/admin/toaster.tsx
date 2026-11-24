"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

type Tone = "success" | "error";
type Toast = { id: number; tone: Tone; message: string };
type ToastFn = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ToastFn>(() => {});

/** Shows a short message at the bottom of the screen. Works from inside modals. */
export function useToast() {
  return useContext(ToastContext);
}

const DURATION = 4000;

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const toast = useCallback<ToastFn>(
    (message, tone = "success") => {
      const id = ++nextId.current;
      setToasts((t) => [...t.slice(-2), { id, tone, message }]);
      timers.current.set(id, setTimeout(() => dismiss(id), DURATION));
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="admin pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className="animate-pop-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-clay px-4 py-3 text-sm text-cream shadow-2xl ring-1 ring-black/10"
          >
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                t.tone === "error" ? "bg-rose text-white" : "bg-sage text-white"
              }`}
            >
              <Icon name={t.tone === "error" ? "alert" : "check"} className="h-3 w-3" />
            </span>
            <p className="min-w-0 flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="-mr-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-cream/70 transition hover:bg-white/10 hover:text-cream"
            >
              <Icon name="x" className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
