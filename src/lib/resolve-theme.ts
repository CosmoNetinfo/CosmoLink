import type { ThemeConfig, Profile, Theme } from '@/types';

/**
 * Normalizes flat theme database configs to the nested frontend ThemeConfig structure.
 */
export function normalizeThemeConfig(raw: any): ThemeConfig {
  if (!raw) return { ...defaultTheme };

  // If already in nested format, check/merge properties
  // Determine background
  const bgType = raw.background?.type || raw.bg_type || defaultTheme.background.type;
  const bgValue = raw.background?.value || raw.bg_value || defaultTheme.background.value;

  // Determine buttons
  let btnStyle = raw.buttons?.style || raw.btn_style || defaultTheme.buttons.style;
  if (btnStyle === 'filled' || btnStyle === 'pill' || btnStyle === 'solid') {
    btnStyle = 'solid';
  }
  
  let btnRadius = raw.buttons?.radius || defaultTheme.buttons.radius;
  if (raw.btn_radius !== undefined) {
    if (raw.btn_radius === 0) btnRadius = 'none';
    else if (raw.btn_radius <= 4) btnRadius = 'sm';
    else if (raw.btn_radius > 16) btnRadius = 'full';
    else btnRadius = 'md';
  }

  const btnBg = raw.buttons?.bg_color || raw.btn_bg || undefined;
  const btnText = raw.buttons?.text_color || raw.btn_text || undefined;
  const btnBorder = raw.buttons?.border_color || raw.btn_border || undefined;
  const btnShadow = raw.buttons?.shadow || (raw.avatar_shadow ? 'md' : 'none');

  // Determine typography
  let font = raw.typography?.font_family || raw.font_family || defaultTheme.typography.font_family;
  let rawFont = font.toLowerCase().replace(/\s+/g, '-');
  if (rawFont === 'playfair-display') rawFont = 'playfair';
  if (!['outfit', 'dm-sans', 'syne', 'playfair', 'space-mono', 'nunito'].includes(rawFont)) {
    rawFont = defaultTheme.typography.font_family;
  }

  const textColor = raw.typography?.text_color || raw.page_text || defaultTheme.typography.text_color;
  const bioColor = raw.typography?.bio_color || raw.page_bio || 'rgba(255,255,255,0.6)';
  const accentColor = raw.typography?.accent_color || raw.btn_bg || defaultTheme.typography.accent_color;

  // Determine avatar ring
  const ringEnabled = raw.avatar_ring?.enabled ?? ((raw.avatar_ring_width || 0) > 0 || !!raw.ring || defaultTheme.avatar_ring.enabled);
  const ringColor = raw.avatar_ring?.color || raw.ring || raw.avatar_ring_color || defaultTheme.avatar_ring.color;
  const ringThickness = raw.avatar_ring?.thickness || (raw.avatar_ring_width ? `${raw.avatar_ring_width}px` : '2px');

  // Determine socials style
  const socialsStyle = raw.socials_style || raw.social_style || 'brand';

  // Effetto animato di sfondo
  const rawEffect = raw.effect;
  const effect = (['aurora', 'stars', 'grid', 'grain', 'orbs'] as const).find((e) => e === rawEffect) ?? 'none';
  const effectColors = Array.isArray(raw.effect_colors)
    ? raw.effect_colors.filter((c: unknown) => typeof c === 'string').slice(0, 4)
    : [];

  return {
    background: {
      type: bgType,
      value: bgValue,
    },
    buttons: {
      style: btnStyle,
      radius: btnRadius,
      bg_color: btnBg,
      text_color: btnText,
      border_color: btnBorder,
      shadow: btnShadow,
    },
    typography: {
      font_family: rawFont as any,
      text_color: textColor,
      bio_color: bioColor,
      accent_color: accentColor,
    },
    avatar_ring: {
      enabled: ringEnabled,
      color: ringColor,
      thickness: ringThickness as any,
    },
    socials_style: socialsStyle,
    effect,
    effect_colors: effectColors,
  };
}

/**
 * Resolves the effective theme configuration for a profile.
 * Handles both preset themes and custom themes, enforcing restrictions for free users.
 */
export function resolveTheme(profile: Profile, themes: Theme[]): ThemeConfig {
  let config: ThemeConfig;

  if (profile.custom_theme) {
    config = normalizeThemeConfig(profile.custom_theme);
  } else {
    const preset = themes.find((t) => t.slug === profile.theme_slug);
    // Un tema PRO non si applica a un profilo Free (anche se il valore e' stato scritto a mano)
    const usable = preset && !(preset.is_pro && profile.plan === 'free');
    config = usable ? normalizeThemeConfig(preset.config) : { ...defaultTheme };
  }

  // Enforce restrictions for free plan users
  if (profile.plan === 'free') {
    // Free users cannot have background image
    if (config.background.type === 'image') {
      config.background.type = 'solid';
      config.background.value = '#0f0f18';
    }
    // Free users are restricted to Outfit font
    config.typography.font_family = 'outfit';
    
    // Free users cannot customize text / bio / accent colors independently
    // If they have customized background, we determine smart text/bio colors based on contrast
    const bgVal = config.background.value.toLowerCase();
    const isLightBg = bgVal === '#ffffff' || bgVal === '#faf9f5' || bgVal.includes('fff') || bgVal.includes('f4f7fb');
    config.typography.text_color = isLightBg ? '#0f172a' : '#ffffff';
    config.typography.bio_color = isLightBg ? '#475569' : 'rgba(255,255,255,0.6)';
    config.typography.accent_color = config.buttons.bg_color || 'hsl(263 90% 64%)';

    // Free users cannot have avatar ring
    config.avatar_ring.enabled = false;
    config.avatar_ring.thickness = '0px';

    // Free users cannot customize social style (always brand colors)
    config.socials_style = 'brand';

    // Gli effetti animati sono solo PRO
    config.effect = 'none';
    config.effect_colors = [];
  }

  return config;
}

/**
 * Converts a ThemeConfig into CSS custom property declarations.
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

  // Buttons Style
  css['--theme-btn-style'] = normalized.buttons.style;
  css['--theme-btn-radius'] =
    normalized.buttons.radius === 'none'
      ? '0px'
      : normalized.buttons.radius === 'sm'
        ? '4px'
        : normalized.buttons.radius === 'md'
          ? '14px'
          : '50px';

  if (normalized.buttons.bg_color) css['--theme-btn-bg'] = normalized.buttons.bg_color;
  if (normalized.buttons.text_color) css['--theme-btn-text'] = normalized.buttons.text_color;
  if (normalized.buttons.border_color) css['--theme-btn-border'] = normalized.buttons.border_color;
  css['--theme-btn-shadow'] = normalized.buttons.shadow || 'none';

  // Typography
  css['--theme-font'] = fontFamilyMap[normalized.typography.font_family] || 'var(--font-outfit)';
  css['--theme-text-color'] = normalized.typography.text_color;
  css['--theme-bio-color'] = normalized.typography.bio_color || 'rgba(255,255,255,0.6)';
  css['--theme-accent'] = normalized.typography.accent_color;

  // Avatar ring
  if (normalized.avatar_ring.enabled) {
    css['--theme-ring'] = normalized.avatar_ring.color;
    css['--theme-ring-thickness'] = normalized.avatar_ring.thickness || '2px';
  } else {
    css['--theme-ring'] = 'transparent';
    css['--theme-ring-thickness'] = '0px';
  }

  // Socials style
  css['--theme-socials-style'] = normalized.socials_style || 'brand';

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
