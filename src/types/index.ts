export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme_slug: string;
  custom_theme: CustomTheme | null;
  social_links: Record<string, string>; // e.g. { github: 'username', twitter: 'username' }
  plan: 'free' | 'pro';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string | null;
  icon_color: string | null;
  position: number;
  is_active: boolean;
  is_featured: boolean;
  link_type: 'link' | 'header' | 'divider' | 'embed';
  embed_type: 'youtube' | 'vimeo' | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface Platform {
  id?: number;
  slug: string;
  name: string;
  brand_color: string;
  category?: string;
  domain_patterns?: string[];
}

export interface Theme {
  slug: string;
  name: string;
  is_pro: boolean;
  config: ThemeConfig;
}

export interface ThemeConfig {
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string; // HSL color or CSS gradient or image URL
  };
  buttons: {
    style: 'solid' | 'outline' | 'soft' | 'glass';
    radius: 'none' | 'md' | 'full';
    bg_color?: string; // HSL string (pro only)
    text_color?: string; // HSL string (pro only)
    border_color?: string; // HSL string (pro only)
    shadow?: 'none' | 'sm' | 'md';
  };
  typography: {
    font_family: 'outfit' | 'dm-sans' | 'syne' | 'playfair' | 'space-mono' | 'nunito';
    text_color: string; // HSL string
    accent_color: string; // HSL string
  };
  avatar_ring: {
    enabled: boolean;
    color: string; // HSL string
  };
}

export type CustomTheme = ThemeConfig;

export interface ClickTracking {
  id: string;
  link_id: string;
  device: string;
  referrer: string;
  country: string;
  created_at: string;
}

export interface ViewTracking {
  id: string;
  profile_id: string;
  device: string;
  referrer: string;
  country: string;
  created_at: string;
}

export interface AnalyticsSummary {
  views: number;
  clicks: number;
  ctr: number;
  viewsOverTime: { date: string; value: number }[];
  clicksOverTime: { date: string; value: number }[];
  deviceDistribution: { name: string; value: number }[];
  countryDistribution: { name: string; value: number }[];
  topLinks: { id: string; title: string; url: string; clicks: number }[];
}
