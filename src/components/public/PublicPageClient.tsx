'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { trackView, trackClick } from '@/lib/analytics';
import { themeToCSS } from '@/lib/resolve-theme';
import { Logo } from '@/components/shared/Logo';
import type { Profile, Link, ThemeConfig, Platform } from '@/types';

interface PublicPageClientProps {
  profile: Profile;
  links: Link[];
  themeConfig: ThemeConfig | null;
  platforms?: Platform[];
}

export default function PublicPageClient({ profile, links, themeConfig, platforms = [] }: PublicPageClientProps) {
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
    const defaultBg = {
      background: 'linear-gradient(135deg, hsl(263 90% 12%) 0%, hsl(240 25% 4%) 50%, hsl(190 90% 8%) 100%)',
    };

    if (!themeConfig || !themeConfig.background) {
      return defaultBg;
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

    return defaultBg;
  }, [themeConfig]);

  const textColor = themeConfig?.typography?.text_color || 'hsl(0 0% 98%)';
  const bioColor = themeConfig?.typography?.bio_color || 'rgba(255, 255, 255, 0.6)';
  const accentColor = themeConfig?.typography?.accent_color || 'hsl(263 90% 64%)';
  const fontFamily = themeStyles['--theme-font'] || 'var(--font-outfit)';
  const btnRadius = themeStyles['--theme-btn-radius'] || '12px';
  const btnStyle = themeConfig?.buttons?.style || 'glass';
  const ringColor = themeConfig?.avatar_ring?.color || 'hsl(263 90% 64%)';
  const ringEnabled = themeConfig?.avatar_ring?.enabled ?? true;
  const ringThickness = themeStyles['--theme-ring-thickness'] || '3px';

  const isDarkText = useMemo(() => {
    const txt = (themeStyles['--theme-text-color'] || textColor).toLowerCase();
    return txt === '#000000' || txt === '#0f172a' || txt === '#1c1917' || txt === '#3b0764' || txt === '#0c4a6e' || txt === '#880e4f' || txt === '#052e16';
  }, [themeStyles, textColor]);

  function handleLinkClick(linkId: string) {
    trackClick(linkId, profile.id);
  }

  function getButtonClasses(): string {
    return 'w-full py-3.5 px-6 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] select-none cursor-pointer';
  }

  function getButtonStyle(): React.CSSProperties {
    const style: React.CSSProperties = {
      borderRadius: btnRadius,
    };

    const bg = themeStyles['--theme-btn-bg'] || 'rgba(255, 255, 255, 0.12)';
    const text = themeStyles['--theme-btn-text'] || 'hsl(0 0% 98%)';
    const border = themeStyles['--theme-btn-border'] || bg;

    if (btnStyle === 'solid') {
      style.background = bg;
      style.color = text;
      style.border = '1px solid transparent';
      style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    } else if (btnStyle === 'outline') {
      style.background = 'transparent';
      style.color = text;
      style.border = `2px solid ${border || text}`;
    } else if (btnStyle === 'glass') {
      if (isDarkText) {
        style.background = 'rgba(0, 0, 0, 0.05)';
        style.border = '1px solid rgba(0, 0, 0, 0.08)';
      } else {
        style.background = 'rgba(255, 255, 255, 0.08)';
        style.border = '1px solid rgba(255, 255, 255, 0.12)';
      }
      style.backdropFilter = 'blur(16px)';
      style.WebkitBackdropFilter = 'blur(16px)';
      style.color = text;
    } else if (btnStyle === 'shadow') {
      style.background = bg;
      style.color = text;
      style.border = '2px solid #000000';
      style.boxShadow = '4px 4px 0px 0px #000000';
    } else if (btnStyle === 'gradient') {
      style.background = bg.includes('gradient') ? bg : `linear-gradient(135deg, ${bg}, ${bg}cc)`;
      style.color = text;
      style.border = 'none';
      style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    }

    return style;
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
                boxShadow: ringEnabled && ringThickness !== '0px'
                  ? `0 0 0 ${ringThickness} ${ringColor}, 0 0 20px ${ringColor}40`
                  : 'none',
              }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{
                background: `${accentColor}30`,
                boxShadow: ringEnabled && ringThickness !== '0px'
                  ? `0 0 0 ${ringThickness} ${ringColor}, 0 0 20px ${ringColor}40`
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
            className="text-sm text-center max-w-sm mb-6"
            style={{ color: bioColor }}
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
            {Object.entries(profile.social_links).map(([platform, url]) => {
              const platObj = platforms.find((p) => p.slug === platform);
              let iconColor = platObj?.brand_color || '#ffffff';
              
              const socialsStyle = themeConfig?.socials_style || 'brand';
              if (socialsStyle === 'white') {
                iconColor = '#ffffff';
              } else if (socialsStyle === 'black') {
                iconColor = '#000000';
              }

              return (
                <a
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 hover:scale-110 transition-all transform duration-200"
                >
                  <PlatformIcon
                    slug={platform}
                    size={22}
                    color={iconColor}
                    variant="clean"
                    fallbackUrl={url as string}
                  />
                </a>
              );
            })}
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

            // Determine monochrome icon color that matches the button text color unless a custom color is specified
            const btnTextColor = themeStyles['--theme-btn-text'] || 'hsl(0 0% 98%)';
            const iconColor = link.icon_color || btnTextColor;

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
                style={getButtonStyle()}
              >
                <PlatformIcon
                  slug={link.icon || ''}
                  color={iconColor}
                  size={20}
                  variant="clean"
                  fallbackUrl={link.url}
                  title={link.title}
                />
                <span className="flex-1 text-sm font-semibold">{link.title}</span>
                {link.is_featured && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">⭐</span>
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Viral CTA Button */}
        <a
          href={`https://cosmolink.app/auth/register?utm_source=public_page&utm_medium=cta&utm_campaign=viral&ref=${profile.username}`}
          className="w-full max-w-[320px] sm:max-w-[280px] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            margin: '24px auto 0',
            padding: '13px 24px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
            color: '#fff',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(108,92,231,0.35)',
            width: '100%',
          }}
        >
          <span>Crea il tuo CosmoLink gratis →</span>
        </a>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-8 flex flex-col items-center gap-3 w-full text-center"
      >
        <Logo size="md" />
        {profile.plan !== 'pro' && (
          <p className="text-sm font-semibold tracking-wider opacity-70">
            Powered by CosmoLink
          </p>
        )}
        <p className="text-sm opacity-50">
          Il tuo universo di link
        </p>
        <p className="text-sm opacity-80 mt-1">
          Realizzato da{' '}
          <a
            href="https://www.cosmonet.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-extrabold underline decoration-white/40"
          >
            CosmoNet — Daniele Spalletti
          </a>
        </p>
      </motion.footer>
    </div>
  );
}
