import "server-only";

// In-memory: fine for a single-instance container. Resets on restart.
export function createLimiter({ max, windowMs }: { max: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    isBlocked(key: string): boolean {
      const e = hits.get(key);
      return !!e && e.resetAt >= Date.now() && e.count >= max;
    },
    fail(key: string) {
      const now = Date.now();
      const e = hits.get(key);
      if (!e || e.resetAt < now) hits.set(key, { count: 1, resetAt: now + windowMs });
      else e.count += 1;
    },
    reset(key: string) {
      hits.delete(key);
    },
  };
}

/** Best-effort client IP behind a reverse proxy (Coolify/Traefik set x-forwarded-for). */
export function clientIp(h: Headers): string {
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
