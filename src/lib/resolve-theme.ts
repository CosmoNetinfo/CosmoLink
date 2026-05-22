import type { ThemeConfig, Profile, Theme } from '@/types';

/**
 * Normalizes flat theme database configs to the nested frontend ThemeConfig structure.
 */
export function normalizeThemeConfig(raw: any): ThemeConfig {
  if (!raw) return defaultTheme;

  // If already in nested format, return it
  if (raw.background && typeof raw.background === 'object' && raw.background.type) {
    return raw as ThemeConfig;
  }

  // Map flat structure from DB seeds
  let type: 'solid' | 'gradient' | 'image' = 'solid';
  if (raw.bg_type === 'gradient') type = 'gradient';
  else if (raw.bg_type === 'image') type = 'image';

  let btnStyle: 'solid' | 'outline' | 'soft' | 'glass' = 'solid';
  if (raw.btn_style === 'outline') btnStyle = 'outline';
  else if (raw.btn_style === 'glass') btnStyle = 'glass';
  else if (raw.btn_style === 'soft') btnStyle = 'soft';

  let btnRadius: 'none' | 'md' | 'full' = 'md';
  if (raw.btn_radius === 0) btnRadius = 'none';
  else if (raw.btn_radius > 16) btnRadius = 'full';

  let font: 'outfit' | 'dm-sans' | 'syne' | 'playfair' | 'space-mono' | 'nunito' = 'outfit';
  const rawFont = (raw.font_family || '').toLowerCase().replace(/\s+/g, '-');
  if (['outfit', 'dm-sans', 'syne', 'playfair', 'space-mono', 'nunito'].includes(rawFont)) {
    font = rawFont as any;
  }

  return {
    background: {
      type,
      value: raw.bg_value || '#0f0f18',
    },
    buttons: {
      style: btnStyle,
      radius: btnRadius,
      bg_color: raw.btn_bg || undefined,
      text_color: raw.btn_text || undefined,
      border_color: raw.btn_border || undefined,
      shadow: raw.avatar_shadow ? 'md' : 'none',
    },
    typography: {
      font_family: font,
      text_color: raw.page_text || 'hsl(0 0% 98%)',
      accent_color: raw.btn_bg || 'hsl(263 90% 64%)',
    },
    avatar_ring: {
      enabled: (raw.avatar_ring_width || 0) > 0,
      color: raw.avatar_ring_color || 'hsl(263 90% 64%)',
    },
  };
}

/**
 * Resolves the effective theme configuration for a profile.
 * PRO users may have a custom_theme override; free users use presets only.
 */
export function resolveTheme(profile: Profile, themes: Theme[]): ThemeConfig {
  // If PRO user has custom theme overrides, use them
  if (profile.plan === 'pro' && profile.custom_theme) {
    return normalizeThemeConfig(profile.custom_theme);
  }

  // Find the preset theme by slug
  const preset = themes.find((t) => t.slug === profile.theme_slug);
  if (preset) {
    return normalizeThemeConfig(preset.config);
  }

  // Fallback to cosmo-dark defaults
  return defaultTheme;
}

/**
 * Converts a ThemeConfig into CSS custom property declarations
 * that can be applied as inline styles on a container element.
 */
export function themeToCSS(config: ThemeConfig): Record<string, string> {
  const css: Record<string, string> = {};

  const normalized = normalizeThemeConfig(config);

  // Background
  if (normalized.background.type === 'solid') {
    css['--theme-bg'] = normalized.background.value;
    css['--theme-bg-style'] = normalized.background.value;
  } else if (normalized.background.type === 'gradient') {
    css['--theme-bg'] = 'transparent';
    css['--theme-bg-style'] = normalized.background.value;
  } else if (normalized.background.type === 'image') {
    css['--theme-bg'] = 'transparent';
    css['--theme-bg-image'] = `url(${normalized.background.value})`;
  }

  // Buttons
  css['--theme-btn-style'] = normalized.buttons.style;
  css['--theme-btn-radius'] =
    normalized.buttons.radius === 'none'
      ? '0px'
      : normalized.buttons.radius === 'md'
        ? '12px'
        : '9999px';

  if (normalized.buttons.bg_color) css['--theme-btn-bg'] = normalized.buttons.bg_color;
  if (normalized.buttons.text_color) css['--theme-btn-text'] = normalized.buttons.text_color;
  if (normalized.buttons.border_color) css['--theme-btn-border'] = normalized.buttons.border_color;

  // Typography
  css['--theme-font'] = fontFamilyMap[normalized.typography.font_family] || 'var(--font-outfit)';
  css['--theme-text-color'] = normalized.typography.text_color;
  css['--theme-accent'] = normalized.typography.accent_color;

  // Avatar ring
  if (normalized.avatar_ring.enabled) {
    css['--theme-ring'] = normalized.avatar_ring.color;
  }

  return css;
}

const fontFamilyMap: Record<string, string> = {
  outfit: 'var(--font-outfit)',
  'dm-sans': 'var(--font-dm-sans)',
  syne: 'var(--font-syne)',
  playfair: 'var(--font-playfair)',
  'space-mono': 'var(--font-space-mono)',
  nunito: 'var(--font-nunito)',
};

const defaultTheme: ThemeConfig = {
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, hsl(263 90% 12%) 0%, hsl(240 25% 4%) 50%, hsl(190 90% 8%) 100%)',
  },
  buttons: {
    style: 'glass',
    radius: 'md',
    shadow: 'md',
  },
  typography: {
    font_family: 'outfit',
    text_color: 'hsl(0 0% 98%)',
    accent_color: 'hsl(263 90% 64%)',
  },
  avatar_ring: {
    enabled: true,
    color: 'hsl(263 90% 64%)',
  },
};
