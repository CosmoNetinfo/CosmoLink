import { createClient } from '@/lib/supabase/client';
import type { Platform } from '@/types';

const cache = new Map<string, Platform>();

export async function detectPlatform(url: string): Promise<Platform> {
  const fallback: Platform = {
    id: 0, slug: 'link', name: 'Link',
    brand_color: '#6C5CE7', category: 'other', domain_patterns: []
  };
  
  if (!url) return fallback;

  // Pulizia URL aggressiva
  let clean = url.toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]   // prendi solo il dominio
    .split('?')[0]   // rimuovi query string
    .split('#')[0]   // rimuovi hash
    .trim();

  if (cache.has(clean)) return cache.get(clean)!;

  const supabase = createClient();
  
  // Cerca per OGNI pattern se il dominio lo contiene
  const { data: all } = await supabase
    .from('platforms')
    .select('*')
    .neq('slug', 'link');

  if (all) {
    for (const platform of all) {
      if (!platform.domain_patterns) continue;
      for (const pattern of platform.domain_patterns) {
        if (pattern && clean.includes(pattern)) {
          cache.set(clean, platform);
          return platform;
        }
      }
    }
  }

  cache.set(clean, fallback);
  return fallback;
}

export function getPlatformIconUrl(slug: string, color?: string): string {
  const c = color ? color.replace('#', '') : 'ffffff';
  return `https://cdn.simpleicons.org/${slug}/${c}`;
}
