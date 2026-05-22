'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { trackView, trackClick } from '@/lib/analytics';
import { themeToCSS } from '@/lib/resolve-theme';
import { Logo } from '@/components/shared/Logo';
import type { Profile, Link, ThemeConfig } from '@/types';

interface PublicPageClientProps {
  profile: Profile;
  links: Link[];
  themeConfig: ThemeConfig | null;
}

export default function PublicPageClient({ profile, links, themeConfig }: PublicPageClientProps) {
  // Track page view on mount
  useEffect(() => {
    trackView(profile.id);
  }, [profile.id]);

  // Resolve theme CSS variables
  const themeStyles = useMemo(() => {
    if (!themeConfig) return {};
    return themeToCSS(themeConfig);
  }, [themeConfig]);

  // Build background style
  const bgStyle = useMemo(() => {
    if (!themeConfig) {
      return {
        background: 'linear-gradient(135deg, hsl(263 90% 12%) 0%, hsl(240 25% 4%) 50%, hsl(190 90% 8%) 100%)',
      };
    }

    if (themeConfig.background.type === 'solid') {
      return { background: themeConfig.background.value };
    } else if (themeConfig.background.type === 'gradient') {
      return { background: themeConfig.background.value };
    } else if (themeConfig.background.type === 'image') {
      return {
        backgroundImage: `url(${themeConfig.background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    return {};
  }, [themeConfig]);

  const textColor = themeConfig?.typography?.text_color || 'hsl(0 0% 98%)';
  const accentColor = themeConfig?.typography?.accent_color || 'hsl(263 90% 64%)';
  const fontFamily = themeStyles['--theme-font'] || 'var(--font-outfit)';
  const btnRadius = themeStyles['--theme-btn-radius'] || '12px';
  const btnStyle = themeConfig?.buttons?.style || 'glass';
  const ringColor = themeConfig?.avatar_ring?.color || 'hsl(263 90% 64%)';
  const ringEnabled = themeConfig?.avatar_ring?.enabled ?? true;

  function handleLinkClick(linkId: string) {
    trackClick(linkId, profile.id);
  }

  function getButtonClasses(): string {
    const base = 'w-full py-3.5 px-6 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]';

    switch (btnStyle) {
      case 'glass':
        return `${base} bg-white/[0.06] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.15] shadow-lg shadow-black/20`;
      case 'outline':
        return `${base} bg-transparent border-2 border-white/20 hover:bg-white/[0.06] hover:border-white/40`;
      case 'soft':
        return `${base} bg-white/[0.1] hover:bg-white/[0.18]`;
      case 'solid':
      default:
        return `${base} bg-white/[0.12] hover:bg-white/[0.2]`;
    }
  }

  // Filter scheduled links
  const visibleLinks = links.filter((link) => {
    if (link.link_type !== 'link' && link.link_type !== 'embed') return true;
    const now = new Date();
    if (link.starts_at && new Date(link.starts_at) > now) return false;
    if (link.ends_at && new Date(link.ends_at) < now) return false;
    return true;
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        ...bgStyle,
        ...themeStyles,
        fontFamily,
        color: textColor,
      }}
    >
      {/* Cosmic glow effects for dark themes */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse-glow-1"
          style={{ background: `${accentColor}`, opacity: 0.06 }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full blur-[130px] animate-pulse-glow-2"
          style={{ background: 'hsl(190 95% 45%)', opacity: 0.04 }}
        />
      </div>

      <div className="w-full max-w-lg px-4 py-12 flex-1 flex flex-col items-center">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-5"
        >
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 rounded-full object-cover"
              style={{
                boxShadow: ringEnabled
                  ? `0 0 0 3px ${ringColor}, 0 0 20px ${ringColor}40`
                  : 'none',
              }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{
                background: `${accentColor}30`,
                boxShadow: ringEnabled
                  ? `0 0 0 3px ${ringColor}, 0 0 20px ${ringColor}40`
                  : 'none',
              }}
            >
              {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
            </div>
          )}
        </motion.div>

        {/* Display name */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xl font-bold text-center mb-1"
        >
          {profile.display_name || profile.username}
        </motion.h1>

        {/* Username */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-sm opacity-60 mb-2"
        >
          @{profile.username}
        </motion.p>

        {/* Bio */}
        {profile.bio && (
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm text-center opacity-70 max-w-sm mb-6"
          >
            {profile.bio}
          </motion.p>
        )}

        {/* Social links row */}
        {profile.social_links && Object.keys(profile.social_links).length > 0 && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            {Object.entries(profile.social_links).map(([platform, url]) => (
              <a
                key={platform}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <PlatformIcon slug={platform} size={22} />
              </a>
            ))}
          </motion.div>
        )}

        {/* Links */}
        <div className="w-full space-y-3">
          {visibleLinks.map((link, i) => {
            if (link.link_type === 'header') {
              return (
                <motion.div
                  key={link.id}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                  className="text-center pt-4 pb-1"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-widest opacity-50">
                    {link.title}
                  </h3>
                </motion.div>
              );
            }

            if (link.link_type === 'divider') {
              return (
                <motion.div
                  key={link.id}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                  className="h-px bg-white/10 my-2"
                />
              );
            }

            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                className={getButtonClasses()}
                style={{
                  borderRadius: btnRadius,
                }}
              >
                <PlatformIcon
                  slug={link.icon || ''}
                  color={link.icon_color?.replace('#', '') || undefined}
                  size={22}
                />
                <span className="flex-1 text-sm font-medium">{link.title}</span>
                {link.is_featured && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">⭐</span>
                )}
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-6 flex flex-col items-center gap-2"
      >
        <Logo size="sm" />
        <p className="text-[10px] opacity-30">
          Il tuo universo di link
        </p>
      </motion.footer>
    </div>
  );
}
