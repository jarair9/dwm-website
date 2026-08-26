import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;

if (redisUrl && redisToken) {
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
  });
}

// In-memory fallback when Redis is unavailable
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function checkMemoryLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, reset: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}

// Clean up expired entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of memoryStore) {
      if (now > val.resetAt) memoryStore.delete(key);
    }
  }, 60_000);
}

export async function checkRateLimit(
  identifier: string,
  limit = 10,
  windowSeconds = 10
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  // Try Redis first
  if (ratelimit) {
    try {
      const result = await ratelimit.limit(identifier);
      return {
        allowed: result.success,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch {
      // Redis failed — fall through to memory
    }
  }

  // In-memory fallback (never silently allow)
  return checkMemoryLimit(identifier, limit, windowSeconds * 1000);
}
