import type { Platform } from '@/types';

/**
 * Given a URL string and the full list of platform records,
 * returns the matching Platform or null.
 */
export function detectPlatform(
  url: string,
  platforms: Platform[]
): Platform | null {
  if (!url) return null;

  let hostname: string;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }

  for (const p of platforms) {
    // p.pattern is stored as a domain-match string, e.g. "github.com"
    if (hostname.includes(p.pattern)) {
      return p;
    }
  }

  return null;
}

/**
 * Returns the Simple Icons CDN url for a given slug and optional hex color.
 */
export function getPlatformIconUrl(slug: string, color?: string): string {
  const c = color ? color.replace('#', '') : 'ffffff';
  return `https://cdn.simpleicons.org/${slug}/${c}`;
}
