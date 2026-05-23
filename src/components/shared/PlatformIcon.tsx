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

  if (slug === 'linkedin') {
    return (
      <div
        className={className}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: finalColor + '18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        title={title}
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          style={{ width: size, height: size, fill: finalColor }}
        >
          <title>LinkedIn</title>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </div>
    );
  }

  if (error || !slug || slug === 'link') {
    return (
      <div
        className={className}
        style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'rgba(108,92,231,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Outfit, sans-serif', fontWeight: 800,
          fontSize: 16, color: '#6c5ce7', flexShrink: 0
        }}
        title={title || fallbackUrl}
      >
        {title?.charAt(0)?.toUpperCase() || '?'}
      </div>
    );
  }

  const mappedSlug = slug === 'twitter' ? 'x' : slug;
  const src = `https://cdn.simpleicons.org/${mappedSlug}/${hexColor}`;

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
