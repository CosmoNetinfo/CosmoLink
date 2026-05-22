'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface PlatformIconProps {
  slug: string;
  color?: string;
  size?: number;
  className?: string;
}

export function PlatformIcon({ slug, color, size = 20, className = '' }: PlatformIconProps) {
  const [error, setError] = useState(false);

  if (error || !slug) {
    return <Globe size={size} className={`text-[hsl(240_5%_70%)] ${className}`} />;
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
