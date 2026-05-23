'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface PlatformIconProps {
  slug: string;
  color?: string;
  size?: number;
  className?: string;
  fallbackUrl?: string; // Optional URL to extract initial letter
}

export function PlatformIcon({ slug, color, size = 20, className = '', fallbackUrl }: PlatformIconProps) {
  const [error, setError] = useState(false);

  function getDomainInitial(url?: string): string {
    if (!url || url === '#') return 'C';
    try {
      const hostname = new URL(url).hostname.replace(/^www\./, '');
      return hostname.charAt(0).toUpperCase();
    } catch {
      const clean = url.replace(/^(https?:\/\/)?(www\.)?/, '');
      return clean.charAt(0).toUpperCase() || 'C';
    }
  }

  if (error || !slug) {
    const initial = getDomainInitial(fallbackUrl);
    // Render custom premium initial badge
    return (
      <div
        style={{ width: `${size + 12}px`, height: `${size + 12}px` }}
        className={`flex items-center justify-center rounded-lg bg-[rgba(108,92,231,0.12)] text-[#6c5ce7] font-bold text-sm font-sans ${className}`}
        title={fallbackUrl}
      >
        {initial}
      </div>
    );
  }

  const c = color ? color.replace('#', '') : 'ffffff';
  const src = `https://cdn.simpleicons.org/${slug}/${c}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={slug}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
