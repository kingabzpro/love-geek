const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

/**
 * Very basic in-memory rate limiter.
 * In a real production environment with serverless functions,
 * you should use a distributed store like Redis (e.g. @upstash/ratelimit).
 */
export function rateLimit(key: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return true; // Allowed
  }

  // If the window has expired, reset
  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return true; // Allowed
  }

  // If within the window, check the count
  if (record.count >= limit) {
    return false; // Rate limited
  }

  record.count += 1;
  return true; // Allowed
}
