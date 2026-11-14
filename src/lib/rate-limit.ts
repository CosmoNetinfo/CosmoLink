/**
 * Rate limit minimale in memoria (per istanza serverless).
 * Non e' una protezione perfetta, ma ferma l'abuso piu' banale delle rotte di tracking.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    // pulizia opportunistica per non far crescere la mappa
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) {
        if (v.resetAt < now) buckets.delete(k);
      }
    }
    return true;
  }

  bucket.count += 1;
  return bucket.count <= limit;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
