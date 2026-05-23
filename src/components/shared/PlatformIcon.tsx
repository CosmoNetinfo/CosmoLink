'use client';

import React, { useState } from 'react';

interface PlatformIconProps {
  slug: string;
  color?: string;
  title?: string;
  size?: number;
  className?: string;
  fallbackUrl?: string; // kept for compatibility
}

export function PlatformIcon({ slug, color = '#6C5CE7', title = '', size = 20, className = '', fallbackUrl }: PlatformIconProps) {
  const [error, setError] = useState(false);

  // Normalizza colore aggiungendo fallback per il brand color base se assente
  const finalColor = color.startsWith('#') ? color : `#${color}`;
  const hexColor = color.replace('#', '');

  if (error || !slug || slug === 'link') {
    return (
      <div
        className={className}
        style={{
          width: 36, height: 36, borderRadius: 8,
          background: finalColor + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Outfit, sans-serif', fontWeight: 800,
          fontSize: 16, color: finalColor, flexShrink: 0
        }}
        title={title || fallbackUrl}
      >
        {title?.charAt(0)?.toUpperCase() || '?'}
      </div>
    );
  }

  const src = `https://cdn.simpleicons.org/${slug}/${hexColor}`;

  return (
    <div
      className={className}
      style={{
        width: 36, height: 36, borderRadius: 8,
        background: finalColor + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}
      title={title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={slug}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
