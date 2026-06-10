'use client';

import React, { useState } from 'react';

interface PlatformIconProps {
  slug: string;
  color?: string;
  title?: string;
  size?: number;
  className?: string;
  fallbackUrl?: string; // kept for compatibility
  variant?: 'classic' | 'clean' | 'circle';
}

export function PlatformIcon({
  slug,
  color = '#6C5CE7',
  title = '',
  size = 20,
  className = '',
  fallbackUrl,
  variant = 'classic'
}: PlatformIconProps) {
  const [error, setError] = useState(false);

  // Helper to determine if a color is light or dark and return monochrome hex
  const hexColor = React.useMemo(() => {
    if (!color) return 'ffffff';
    const clean = color.trim().toLowerCase();
    
    // If it's a CSS variable or hsl
    if (clean.includes('var(--') || clean.includes('hsl')) {
      if (clean.includes('98%') || clean.includes('white') || clean.includes('fff')) {
        return 'ffffff';
      }
      return '000000';
    }
    
    let r = 255, g = 255, b = 255;
    if (clean.startsWith('#')) {
      const hex = clean.replace('#', '');
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length >= 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    } else if (clean.startsWith('rgb')) {
      const match = clean.match(/\d+/g);
      if (match && match.length >= 3) {
        r = parseInt(match[0], 10);
        g = parseInt(match[1], 10);
        b = parseInt(match[2], 10);
      }
    }
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'ffffff' : '000000';
  }, [color]);

  const finalColor = `#${hexColor}`;

  const wrapperStyle = React.useMemo((): React.CSSProperties => {
    if (variant === 'clean') {
      return {
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      };
    }

    return {
      width: 38,
      height: 38,
      borderRadius: variant === 'circle' ? '50%' : '10px',
      background: finalColor + '15',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      border: variant === 'circle' ? `1px solid ${finalColor}25` : 'none',
    };
  }, [variant, size, finalColor]);

  const [faviconError, setFaviconError] = useState(false);

  // Estrae l'host dal link per recuperare la favicon
  const domain = React.useMemo(() => {
    if (!fallbackUrl) return '';
    try {
      let url = fallbackUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }, [fallbackUrl]);

  // Se abbiamo un dominio valido, proviamo a caricare la favicon nativa (per tutti i link)
  if (domain && !faviconError) {
    const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    return (
      <div className={className} style={wrapperStyle} title={title || fallbackUrl}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl}
          alt={title || slug || 'favicon'}
          width={size}
          height={size}
          style={{ width: size, height: size, objectFit: 'contain', borderRadius: '4px' }}
          onError={() => setFaviconError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  if (slug === 'linkedin') {
    return (
      <div className={className} style={wrapperStyle} title={title}>
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

  if (error || !slug || slug === 'link' || (slug === 'link' && faviconError)) {
    return (
      <div className={className} style={wrapperStyle} title={title || fallbackUrl}>
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill="none"
          stroke={finalColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: size, height: size }}
        >
          <title>{title || 'Web'}</title>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      </div>
    );
  }

  const mappedSlug = slug === 'twitter' ? 'x' : slug;
  const src = `https://cdn.simpleicons.org/${mappedSlug}/${hexColor}`;

  return (
    <div className={className} style={wrapperStyle} title={title}>
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
