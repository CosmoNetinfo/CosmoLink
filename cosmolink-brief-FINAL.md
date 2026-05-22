# CosmoLink — Brief Tecnico Completo v2.0
**Progetto:** CosmoLink  
**Ecosistema:** CosmoNet (cosmonet.info / github.com/CosmoNetinfo)  
**Tipo:** Web App SaaS — Link-in-bio aggregator (alternativa a Linktree)  
**Stack:** Next.js 14 + Supabase + Vercel  
**Autore:** DanyWolf / Cosmonet  
**Versione:** 2.0 — Brief unificato e completo, diviso per task  

> **ISTRUZIONI PER ANTIGRAVITY:** Esegui i task nell'ordine numerato. Ogni task è autonomo e contiene tutto il necessario. Non procedere al task successivo prima di aver completato e testato il precedente. Non inventare nulla che non sia specificato qui.

---

# PANORAMICA PROGETTO

CosmoLink è un'applicazione web SaaS che permette a ogni utente di creare una pagina pubblica personalizzata (`cosmolink.app/username`) dove raccogliere tutti i propri link importanti — social, sito, shop, servizi — in un'unica URL condivisibile. È l'alternativa italiana gratuita a Linktree.

**Modello di business:** Freemium. Piano Free con funzionalità base, piano PRO con personalizzazione avanzata. La distinzione Free/PRO è gestita tramite il campo `plan` in `profiles`.

**Mascotte:** L'alieno blu CosmoNet (PNG fornito separatamente) compare nel logo, nell'avatar di default, nel QR code al centro, nel footer della pagina pubblica. NON va usato come decorazione generica.

---

# TASK 1 — SETUP PROGETTO

## 1.1 Inizializzazione repository

```bash
pnpm create next-app@latest cosmolink \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd cosmolink
pnpm add @supabase/ssr @supabase/supabase-js
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
pnpm add qrcode.react
pnpm add recharts
pnpm add lucide-react
pnpm add framer-motion
pnpm add simple-icons
pnpm add -D @types/node
```

## 1.2 Struttura cartelle COMPLETA da creare

```
cosmolink/
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root layout
│   │   ├── page.tsx                       # Landing page marketing
│   │   ├── [username]/
│   │   │   └── page.tsx                   # Pagina pubblica SSR
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── callback/route.ts          # OAuth callback Supabase
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                 # Layout dashboard con sidebar
│   │   │   ├── page.tsx                   # Redirect → /dashboard/links
│   │   │   ├── links/page.tsx             # Editor link drag&drop
│   │   │   ├── appearance/page.tsx        # Temi e personalizzazione
│   │   │   ├── analytics/page.tsx         # Dashboard statistiche
│   │   │   ├── qrcode/page.tsx            # Generatore QR
│   │   │   └── settings/page.tsx          # Impostazioni account
│   │   └── api/
│   │       ├── track/click/route.ts       # POST traccia click link
│   │       ├── track/view/route.ts        # POST traccia visita profilo
│   │       └── og/[username]/route.ts     # GET OG Image dinamica
│   ├── components/
│   │   ├── ui/                            # Componenti base riutilizzabili
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Toggle.tsx
│   │   │   └── Spinner.tsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── LinkCard.tsx               # Card singolo link nell'editor
│   │   │   ├── DraggableList.tsx          # Lista drag & drop dnd-kit
│   │   │   ├── AddLinkModal.tsx           # Modal aggiungi/modifica link
│   │   │   ├── ThemePicker.tsx            # Griglia selezione tema
│   │   │   ├── AppearanceEditor.tsx       # Editor completo aspetto PRO
│   │   │   ├── ProfilePreview.tsx         # Preview mobile live
│   │   │   └── AnalyticsChart.tsx         # Grafici recharts
│   │   ├── public/
│   │   │   ├── PublicPage.tsx             # Rendering pagina pubblica
│   │   │   ├── LinkButton.tsx             # Bottone link pubblico
│   │   │   └── SocialRow.tsx              # Riga icone social
│   │   └── shared/
│   │       ├── Logo.tsx                   # Logo CosmoLink con mascotte
│   │       ├── MascotImage.tsx            # Componente mascotte
│   │       └── PlatformIcon.tsx           # Icona piattaforma da Simple Icons
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                  # Browser client
│   │   │   ├── server.ts                  # Server client SSR
│   │   │   └── middleware.ts              # Auth middleware helper
│   │   ├── detect-platform.ts             # Rilevamento piattaforma da URL
│   │   ├── resolve-theme.ts               # Risoluzione tema attivo
│   │   ├── avatar-upload.ts               # Upload e resize avatar
│   │   ├── analytics.ts                   # Funzioni tracking
│   │   └── utils.ts                       # Helper generici
│   ├── types/
│   │   └── index.ts                       # Tutti i TypeScript types
│   └── middleware.ts                      # Next.js middleware auth guard
├── public/
│   ├── mascot.png                         # Alieno blu CosmoNet (fornito)
│   ├── mascot-logo.png                    # Versione piccola per logo
│   └── og-default.png                     # OG image default
├── supabase/
│   └── migrations/                        # File SQL migrations (vedi Task 2)
├── .env.local
├── next.config.ts
└── tailwind.config.ts
```

## 1.3 Variabili d'ambiente `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://cosmolink.app
NEXT_PUBLIC_MASCOT_URL=/mascot.png
NEXT_PUBLIC_MASCOT_LOGO_URL=/mascot-logo.png
```

## 1.4 `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
    ],
  },
}

export default nextConfig
```

## 1.5 TypeScript types completi `src/types/index.ts`

```typescript
export type Plan = 'free' | 'pro'
export type BgType = 'solid' | 'gradient' | 'image'
export type BtnStyle = 'filled' | 'outline' | 'glass' | 'shadow' | 'gradient'
export type FontFamily = 'Outfit' | 'DM Sans' | 'Syne' | 'Playfair Display' | 'Space Mono' | 'Nunito'
export type LinkType = 'link' | 'header' | 'divider' | 'embed'
export type EmbedType = 'youtube' | 'vimeo'
export type SocialIconMode = 'brand' | 'white' | 'black' | 'theme'
export type DeviceType = 'mobile' | 'desktop' | 'tablet'

export interface ThemeConfig {
  bg_type:            BgType
  bg_value:           string
  bg_gradient_from?:  string
  bg_gradient_to?:    string
  bg_gradient_angle?: number
  page_text:          string
  page_bio:           string
  page_muted:         string
  btn_bg:             string
  btn_text:           string
  btn_border:         string
  btn_style:          BtnStyle
  btn_radius:         number
  btn_font_weight:    400 | 500 | 600 | 700
  avatar_ring_color:  string
  avatar_ring_width:  0 | 2 | 3 | 4
  avatar_shadow:      boolean
  social_icon_mode:   SocialIconMode
  social_bg:          string
  social_bg_opacity:  number
  font_family:        FontFamily
  divider_color:      string
}

export interface SocialLinks {
  instagram?:  string
  twitter?:    string
  youtube?:    string
  tiktok?:     string
  linkedin?:   string
  github?:     string
  website?:    string
  telegram?:   string
  whatsapp?:   string
  discord?:    string
  facebook?:   string
  snapchat?:   string
  pinterest?:  string
  twitch?:     string
  spotify?:    string
  patreon?:    string
}

export interface Profile {
  id:            string
  username:      string
  display_name:  string | null
  bio:           string | null
  avatar_url:    string | null
  theme_slug:    string
  custom_theme:  ThemeConfig | null
  social_links:  SocialLinks
  plan:          Plan
  is_verified:   boolean
  created_at:    string
  updated_at:    string
}

export interface Link {
  id:          string
  user_id:     string
  title:       string
  url:         string
  icon:        string | null       // slug Simple Icons o null
  icon_color:  string | null       // override colore icona
  position:    number
  is_active:   boolean
  is_featured: boolean
  link_type:   LinkType
  embed_type:  EmbedType | null
  starts_at:   string | null
  ends_at:     string | null
  created_at:  string
}

export interface Theme {
  id:          string
  name:        string
  slug:        string
  is_pro:      boolean
  preview_url: string | null
  config:      ThemeConfig
}

export interface Platform {
  id:               number
  slug:             string
  name:             string
  brand_color:      string
  category:         string
  domain_patterns:  string[]
}

export interface LinkClick {
  id:         string
  link_id:    string
  user_id:    string
  clicked_at: string
  country:    string | null
  device:     DeviceType | null
  browser:    string | null
  referrer:   string | null
}

export interface ProfileView {
  id:         string
  user_id:    string
  viewed_at:  string
  country:    string | null
  device:     DeviceType | null
  browser:    string | null
  referrer:   string | null
}

export interface AnalyticsSummary {
  total_views:       number
  total_clicks:      number
  ctr:               number
  top_links:         { link_id: string; title: string; clicks: number; pct: number }[]
  views_by_day:      { date: string; views: number; clicks: number }[]
  devices:           { device: DeviceType; count: number; pct: number }[]
  countries:         { country: string; count: number }[]
}
```

---

# TASK 2 — DATABASE SUPABASE

> Esegui ogni migration in ordine nel SQL Editor di Supabase, oppure tramite Supabase CLI.

## 2.1 Migration: `001_profiles.sql`

```sql
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL CHECK (username ~ '^[a-z0-9_-]{3,30}$'),
  display_name  TEXT CHECK (char_length(display_name) <= 60),
  bio           TEXT CHECK (char_length(bio) <= 200),
  avatar_url    TEXT,
  theme_slug    TEXT NOT NULL DEFAULT 'cosmo-dark',
  custom_theme  JSONB,
  social_links  JSONB NOT NULL DEFAULT '{}',
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro')),
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_owner_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

## 2.2 Migration: `002_links.sql`

```sql
CREATE TABLE links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL CHECK (char_length(title) <= 100),
  url         TEXT NOT NULL CHECK (char_length(url) <= 2000),
  icon        TEXT,
  icon_color  TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  link_type   TEXT NOT NULL DEFAULT 'link' CHECK (link_type IN ('link','header','divider','embed')),
  embed_type  TEXT CHECK (embed_type IN ('youtube','vimeo')),
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX links_user_id_position ON links(user_id, position);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "links_public_read"  ON links FOR SELECT USING (is_active = true OR auth.uid() = user_id);
CREATE POLICY "links_owner_all"    ON links FOR ALL USING (auth.uid() = user_id);
```

## 2.3 Migration: `003_tracking.sql`

```sql
CREATE TABLE link_clicks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id     UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clicked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country     TEXT,
  device      TEXT CHECK (device IN ('mobile','desktop','tablet')),
  browser     TEXT,
  referrer    TEXT
);

CREATE INDEX link_clicks_user_id ON link_clicks(user_id);
CREATE INDEX link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX link_clicks_clicked_at ON link_clicks(clicked_at);

CREATE TABLE profile_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country     TEXT,
  device      TEXT CHECK (device IN ('mobile','desktop','tablet')),
  browser     TEXT,
  referrer    TEXT
);

CREATE INDEX profile_views_user_id ON profile_views(user_id);
CREATE INDEX profile_views_viewed_at ON profile_views(viewed_at);

ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clicks_insert_open"   ON link_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "clicks_owner_select"  ON link_clicks FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "views_insert_open"    ON profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "views_owner_select"   ON profile_views FOR SELECT USING (auth.uid() = user_id);
```

## 2.4 Migration: `004_platforms.sql`

```sql
CREATE TABLE platforms (
  id               SERIAL PRIMARY KEY,
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  brand_color      TEXT NOT NULL,
  category         TEXT NOT NULL DEFAULT 'other',
  domain_patterns  TEXT[] NOT NULL DEFAULT '{}'
);

ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platforms_public_read" ON platforms FOR SELECT USING (true);
```

## 2.5 Migration: `005_themes.sql`

```sql
CREATE TABLE themes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  is_pro      BOOLEAN NOT NULL DEFAULT FALSE,
  preview_url TEXT,
  config      JSONB NOT NULL
);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "themes_public_read" ON themes FOR SELECT USING (true);
```

## 2.6 Migration: `006_storage.sql`

```sql
-- Eseguire in Supabase Dashboard → Storage → oppure via SQL:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,
  ARRAY['image/jpeg','image/png','image/webp']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
```

## 2.7 Migration: `007_seed_platforms.sql` — 150 piattaforme

```sql
INSERT INTO platforms (slug, name, brand_color, category, domain_patterns) VALUES
-- SOCIAL
('instagram','Instagram','#E4405F','social',ARRAY['instagram.com']),
('facebook','Facebook','#1877F2','social',ARRAY['facebook.com','fb.com','fb.me']),
('twitter','Twitter/X','#000000','social',ARRAY['twitter.com','x.com']),
('threads','Threads','#000000','social',ARRAY['threads.net']),
('snapchat','Snapchat','#FFFC00','social',ARRAY['snapchat.com','snap.com']),
('pinterest','Pinterest','#E60023','social',ARRAY['pinterest.com','pin.it']),
('reddit','Reddit','#FF4500','social',ARRAY['reddit.com','redd.it']),
('tumblr','Tumblr','#35465C','social',ARRAY['tumblr.com']),
('mastodon','Mastodon','#6364FF','social',ARRAY['mastodon.social','mastodon.online','mstdn.social']),
('bluesky','Bluesky','#0085FF','social',ARRAY['bsky.app','bsky.social']),
('vk','VK','#0077FF','social',ARRAY['vk.com']),
('weibo','Weibo','#E6162D','social',ARRAY['weibo.com']),
('ok','OK.ru','#F7931E','social',ARRAY['ok.ru']),
-- VIDEO
('youtube','YouTube','#FF0000','video',ARRAY['youtube.com','youtu.be']),
('tiktok','TikTok','#000000','video',ARRAY['tiktok.com','vm.tiktok.com']),
('twitch','Twitch','#9146FF','video',ARRAY['twitch.tv']),
('vimeo','Vimeo','#1AB7EA','video',ARRAY['vimeo.com']),
('dailymotion','Dailymotion','#0066DC','video',ARRAY['dailymotion.com']),
('kick','Kick','#53FC18','video',ARRAY['kick.com']),
('rumble','Rumble','#85C742','video',ARRAY['rumble.com']),
('bilibili','Bilibili','#00A1D6','video',ARRAY['bilibili.com','b23.tv']),
('odysee','Odysee','#EF1970','video',ARRAY['odysee.com','lbry.tv']),
-- MUSICA
('spotify','Spotify','#1DB954','music',ARRAY['spotify.com','open.spotify.com']),
('applemusic','Apple Music','#FC3C44','music',ARRAY['music.apple.com']),
('soundcloud','SoundCloud','#FF3300','music',ARRAY['soundcloud.com']),
('bandcamp','Bandcamp','#1DA0C3','music',ARRAY['bandcamp.com']),
('deezer','Deezer','#EF5466','music',ARRAY['deezer.com']),
('tidal','Tidal','#000000','music',ARRAY['tidal.com']),
('audiomack','Audiomack','#FFA200','music',ARRAY['audiomack.com']),
('mixcloud','Mixcloud','#52AAD8','music',ARRAY['mixcloud.com']),
('anchor','Anchor/Spotify Podcast','#1DB954','music',ARRAY['anchor.fm','podcasters.spotify.com']),
('podbean','Podbean','#F8A01C','music',ARRAY['podbean.com']),
-- DEV
('github','GitHub','#181717','dev',ARRAY['github.com']),
('gitlab','GitLab','#FC6D26','dev',ARRAY['gitlab.com']),
('bitbucket','Bitbucket','#0052CC','dev',ARRAY['bitbucket.org']),
('stackoverflow','Stack Overflow','#F58025','dev',ARRAY['stackoverflow.com']),
('hashnode','Hashnode','#2962FF','dev',ARRAY['hashnode.dev','hashnode.com']),
('devdotto','Dev.to','#0A0A0A','dev',ARRAY['dev.to']),
('codepen','CodePen','#000000','dev',ARRAY['codepen.io']),
('replit','Replit','#F26207','dev',ARRAY['replit.com']),
('producthunt','Product Hunt','#DA552F','dev',ARRAY['producthunt.com']),
('hackernews','Hacker News','#FF6600','dev',ARRAY['news.ycombinator.com']),
('npm','npm','#CB3837','dev',ARRAY['npmjs.com']),
('pypi','PyPI','#3775A9','dev',ARRAY['pypi.org']),
('dockerhub','Docker Hub','#2496ED','dev',ARRAY['hub.docker.com']),
('codesandbox','CodeSandbox','#151515','dev',ARRAY['codesandbox.io']),
-- PROFESSIONALE
('linkedin','LinkedIn','#0A66C2','professional',ARRAY['linkedin.com']),
('xing','Xing','#006567','professional',ARRAY['xing.com']),
('behance','Behance','#1769FF','professional',ARRAY['behance.net']),
('dribbble','Dribbble','#EA4C89','professional',ARRAY['dribbble.com']),
('fiverr','Fiverr','#1DBF73','professional',ARRAY['fiverr.com']),
('upwork','Upwork','#6FDA44','professional',ARRAY['upwork.com']),
('toptal','Toptal','#204ECF','professional',ARRAY['toptal.com']),
('glassdoor','Glassdoor','#0CAA41','professional',ARRAY['glassdoor.com']),
('wellfound','Wellfound','#000000','professional',ARRAY['angel.co','wellfound.com']),
('freelancer','Freelancer','#29B2FE','professional',ARRAY['freelancer.com']),
-- MESSAGGISTICA
('telegram','Telegram','#2CA5E0','messaging',ARRAY['t.me','telegram.me','telegram.org']),
('whatsapp','WhatsApp','#25D366','messaging',ARRAY['wa.me','whatsapp.com']),
('discord','Discord','#5865F2','messaging',ARRAY['discord.gg','discord.com','discord.io']),
('slack','Slack','#4A154B','messaging',ARRAY['slack.com']),
('signal','Signal','#3A76F0','messaging',ARRAY['signal.me','signal.group']),
('line','LINE','#00B900','messaging',ARRAY['line.me']),
('viber','Viber','#7360F2','messaging',ARRAY['viber.com']),
('wechat','WeChat','#07C160','messaging',ARRAY['wechat.com']),
('skype','Skype','#00AFF0','messaging',ARRAY['skype.com','join.skype.com']),
('messenger','Messenger','#00B2FF','messaging',ARRAY['m.me','messenger.com']),
-- CREATOR & MONETIZZAZIONE
('patreon','Patreon','#FF424D','creator',ARRAY['patreon.com']),
('kofi','Ko-fi','#FF5E5B','creator',ARRAY['ko-fi.com']),
('buymeacoffee','Buy Me a Coffee','#FFDD00','creator',ARRAY['buymeacoffee.com']),
('gumroad','Gumroad','#FF90E8','creator',ARRAY['gumroad.com']),
('substack','Substack','#FF6719','creator',ARRAY['substack.com']),
('beehiiv','Beehiiv','#000000','creator',ARRAY['beehiiv.com']),
('onlyfans','OnlyFans','#00AFF0','creator',ARRAY['onlyfans.com']),
('cameo','Cameo','#00D4A8','creator',ARRAY['cameo.com']),
('streamlabs','Streamlabs','#80F5D2','creator',ARRAY['streamlabs.com']),
('fourthwall','Fourthwall','#000000','creator',ARRAY['fourthwall.com']),
('sellfy','Sellfy','#21D37E','creator',ARRAY['sellfy.com']),
('stan','Stan.store','#000000','creator',ARRAY['stan.store']),
-- E-COMMERCE
('shopify','Shopify','#96BF48','shop',ARRAY['myshopify.com']),
('etsy','Etsy','#F1641E','shop',ARRAY['etsy.com']),
('amazon','Amazon','#FF9900','shop',ARRAY['amazon.com','amazon.it','amazon.de','amzn.to']),
('ebay','eBay','#E53238','shop',ARRAY['ebay.com','ebay.it']),
('depop','Depop','#FF2300','shop',ARRAY['depop.com']),
('vinted','Vinted','#007782','shop',ARRAY['vinted.it','vinted.com']),
('redbubble','Redbubble','#E41321','shop',ARRAY['redbubble.com']),
('woocommerce','WooCommerce','#96588A','shop',ARRAY['woocommerce.com']),
('bigcartel','Big Cartel','#2F2F2F','shop',ARRAY['bigcartel.com']),
-- FOTOGRAFIA & ARTE
('flickr','Flickr','#0063DC','photo',ARRAY['flickr.com']),
('vsco','VSCO','#000000','photo',ARRAY['vsco.co']),
('fivehundredpx','500px','#0099E5','photo',ARRAY['500px.com']),
('unsplash','Unsplash','#000000','photo',ARRAY['unsplash.com']),
('artstation','ArtStation','#13AFF0','photo',ARRAY['artstation.com']),
('deviantart','DeviantArt','#05CC47','photo',ARRAY['deviantart.com']),
('pixiv','Pixiv','#0096FA','photo',ARRAY['pixiv.net']),
('lens','Lens Protocol','#ABFE2C','photo',ARRAY['lens.xyz']),
-- GAMING
('steam','Steam','#000000','gaming',ARRAY['store.steampowered.com','steamcommunity.com']),
('epicgames','Epic Games','#2F2F2F','gaming',ARRAY['epicgames.com']),
('itchdotio','Itch.io','#FA5C5C','gaming',ARRAY['itch.io']),
('playstation','PlayStation','#003791','gaming',ARRAY['playstation.com','psnprofiles.com']),
('xbox','Xbox','#107C10','gaming',ARRAY['xbox.com']),
('nintendo','Nintendo','#E4000F','gaming',ARRAY['nintendo.com']),
('roblox','Roblox','#FF0000','gaming',ARRAY['roblox.com']),
('minecraft','Minecraft','#62B47A','gaming',ARRAY['minecraft.net']),
-- BLOG & CMS
('wordpress','WordPress','#21759B','blog',ARRAY['wordpress.com','wordpress.org']),
('medium','Medium','#000000','blog',ARRAY['medium.com']),
('ghost','Ghost','#15171A','blog',ARRAY['ghost.io','ghost.org']),
('wix','Wix','#0C6EFC','blog',ARRAY['wix.com','wixsite.com']),
('webflow','Webflow','#146EF5','blog',ARRAY['webflow.com','webflow.io']),
('notion','Notion','#000000','blog',ARRAY['notion.so','notion.site']),
('squarespace','Squarespace','#000000','blog',ARRAY['squarespace.com']),
('hashnode','Hashnode','#2962FF','blog',ARRAY['hashnode.dev']),
-- ALTRO
('paypal','PayPal','#003087','other',ARRAY['paypal.com','paypal.me']),
('stripe','Stripe','#635BFF','other',ARRAY['stripe.com']),
('calendly','Calendly','#006BFF','other',ARRAY['calendly.com']),
('linktree','Linktree','#43E55E','other',ARRAY['linktr.ee']),
('allmylinks','AllMyLinks','#FF3B30','other',ARRAY['allmylinks.com']),
('bento','Bento','#000000','other',ARRAY['bento.me']),
('carrd','Carrd','#0070EF','other',ARRAY['carrd.co']),
('beacons','Beacons','#FF5C5C','other',ARRAY['beacons.ai']),
('linkpop','Linkpop','#5C6AC4','other',ARRAY['linkpop.com']),
('campsite','Campsite','#000000','other',ARRAY['campsite.bio']),
-- LINK GENERICO (fallback sempre ultimo)
('link','Link generico','#6C5CE7','other',ARRAY['']);
```

## 2.8 Migration: `008_seed_themes.sql` — 10 temi completi

```sql
INSERT INTO themes (name, slug, is_pro, config) VALUES

('Cosmo Dark', 'cosmo-dark', false, '{
  "bg_type": "gradient",
  "bg_value": "160deg, #0f0f18, #1a1025, #0a1520",
  "page_text": "#ffffff",
  "page_bio": "rgba(255,255,255,0.55)",
  "page_muted": "rgba(255,255,255,0.3)",
  "btn_bg": "#6c5ce7",
  "btn_text": "#ffffff",
  "btn_border": "#6c5ce7",
  "btn_style": "filled",
  "btn_radius": 14,
  "btn_font_weight": 600,
  "avatar_ring_color": "#6c5ce7",
  "avatar_ring_width": 3,
  "avatar_shadow": true,
  "social_icon_mode": "white",
  "social_bg": "rgba(255,255,255,0.07)",
  "social_bg_opacity": 100,
  "font_family": "Outfit",
  "divider_color": "rgba(255,255,255,0.1)"
}'),

('Arctic', 'arctic', false, '{
  "bg_type": "solid",
  "bg_value": "#f4f7fb",
  "page_text": "#0f172a",
  "page_bio": "#64748b",
  "page_muted": "#94a3b8",
  "btn_bg": "#0ea5e9",
  "btn_text": "#ffffff",
  "btn_border": "#0ea5e9",
  "btn_style": "filled",
  "btn_radius": 12,
  "btn_font_weight": 600,
  "avatar_ring_color": "#0ea5e9",
  "avatar_ring_width": 3,
  "avatar_shadow": true,
  "social_icon_mode": "theme",
  "social_bg": "#e0f2fe",
  "social_bg_opacity": 100,
  "font_family": "Outfit",
  "divider_color": "#e2e8f0"
}'),

('Forest', 'forest', false, '{
  "bg_type": "gradient",
  "bg_value": "160deg, #0d2818, #0a1f10, #071408",
  "page_text": "#ffffff",
  "page_bio": "rgba(255,255,255,0.6)",
  "page_muted": "rgba(255,255,255,0.35)",
  "btn_bg": "#4ade80",
  "btn_text": "#052e16",
  "btn_border": "#4ade80",
  "btn_style": "filled",
  "btn_radius": 10,
  "btn_font_weight": 700,
  "avatar_ring_color": "#4ade80",
  "avatar_ring_width": 3,
  "avatar_shadow": true,
  "social_icon_mode": "white",
  "social_bg": "rgba(74,222,128,0.1)",
  "social_bg_opacity": 100,
  "font_family": "Outfit",
  "divider_color": "rgba(255,255,255,0.08)"
}'),

('Sand', 'sand', false, '{
  "bg_type": "solid",
  "bg_value": "#faf9f5",
  "page_text": "#1c1917",
  "page_bio": "#78716c",
  "page_muted": "#a8a29e",
  "btn_bg": "#c2855c",
  "btn_text": "#ffffff",
  "btn_border": "#c2855c",
  "btn_style": "filled",
  "btn_radius": 8,
  "btn_font_weight": 600,
  "avatar_ring_color": "#c2855c",
  "avatar_ring_width": 2,
  "avatar_shadow": false,
  "social_icon_mode": "theme",
  "social_bg": "#f0ebe3",
  "social_bg_opacity": 100,
  "font_family": "Playfair Display",
  "divider_color": "#e7e0d8"
}'),

('Nebula', 'nebula', true, '{
  "bg_type": "gradient",
  "bg_value": "160deg, #1a0a2e, #2d1b69, #0f2027",
  "page_text": "#ffffff",
  "page_bio": "rgba(255,255,255,0.6)",
  "page_muted": "rgba(255,255,255,0.35)",
  "btn_bg": "linear-gradient(135deg,#ff6eb4,#a855f7)",
  "btn_text": "#ffffff",
  "btn_border": "#ff6eb4",
  "btn_style": "gradient",
  "btn_radius": 20,
  "btn_font_weight": 600,
  "avatar_ring_color": "#ff6eb4",
  "avatar_ring_width": 3,
  "avatar_shadow": true,
  "social_icon_mode": "white",
  "social_bg": "rgba(255,110,180,0.12)",
  "social_bg_opacity": 100,
  "font_family": "Syne",
  "divider_color": "rgba(255,110,180,0.15)"
}'),

('Solar', 'solar', true, '{
  "bg_type": "gradient",
  "bg_value": "160deg, #150f00, #1f1500, #0a0800",
  "page_text": "#fef3c7",
  "page_bio": "rgba(254,243,199,0.6)",
  "page_muted": "rgba(254,243,199,0.35)",
  "btn_bg": "#f59e0b",
  "btn_text": "#1a0f00",
  "btn_border": "#f59e0b",
  "btn_style": "shadow",
  "btn_radius": 12,
  "btn_font_weight": 700,
  "avatar_ring_color": "#f59e0b",
  "avatar_ring_width": 3,
  "avatar_shadow": true,
  "social_icon_mode": "white",
  "social_bg": "rgba(245,158,11,0.12)",
  "social_bg_opacity": 100,
  "font_family": "Outfit",
  "divider_color": "rgba(245,158,11,0.1)"
}'),

('Rose', 'rose', true, '{
  "bg_type": "gradient",
  "bg_value": "160deg, #1f0a10, #2d1220, #160810",
  "page_text": "#ffe4e6",
  "page_bio": "rgba(255,228,230,0.6)",
  "page_muted": "rgba(255,228,230,0.35)",
  "btn_bg": "rgba(251,113,133,0.15)",
  "btn_text": "#fb7185",
  "btn_border": "#fb7185",
  "btn_style": "glass",
  "btn_radius": 16,
  "btn_font_weight": 600,
  "avatar_ring_color": "#fb7185",
  "avatar_ring_width": 3,
  "avatar_shadow": true,
  "social_icon_mode": "white",
  "social_bg": "rgba(251,113,133,0.12)",
  "social_bg_opacity": 100,
  "font_family": "Outfit",
  "divider_color": "rgba(251,113,133,0.1)"
}'),

('Ocean', 'ocean', true, '{
  "bg_type": "gradient",
  "bg_value": "180deg, #030d20, #041a38, #020c18",
  "page_text": "#e0f7fa",
  "page_bio": "rgba(224,247,250,0.6)",
  "page_muted": "rgba(224,247,250,0.35)",
  "btn_bg": "transparent",
  "btn_text": "#06b6d4",
  "btn_border": "#06b6d4",
  "btn_style": "outline",
  "btn_radius": 14,
  "btn_font_weight": 600,
  "avatar_ring_color": "#06b6d4",
  "avatar_ring_width": 3,
  "avatar_shadow": true,
  "social_icon_mode": "white",
  "social_bg": "rgba(6,182,212,0.1)",
  "social_bg_opacity": 100,
  "font_family": "Outfit",
  "divider_color": "rgba(6,182,212,0.12)"
}'),

('Neon City', 'neon', true, '{
  "bg_type": "solid",
  "bg_value": "#020203",
  "page_text": "#ffffff",
  "page_bio": "rgba(255,255,255,0.5)",
  "page_muted": "rgba(255,255,255,0.3)",
  "btn_bg": "transparent",
  "btn_text": "#39ff14",
  "btn_border": "#39ff14",
  "btn_style": "outline",
  "btn_radius": 4,
  "btn_font_weight": 700,
  "avatar_ring_color": "#39ff14",
  "avatar_ring_width": 2,
  "avatar_shadow": true,
  "social_icon_mode": "white",
  "social_bg": "rgba(57,255,20,0.08)",
  "social_bg_opacity": 100,
  "font_family": "Space Mono",
  "divider_color": "rgba(57,255,20,0.1)"
}'),

('Mono', 'mono', true, '{
  "bg_type": "solid",
  "bg_value": "#ffffff",
  "page_text": "#0a0a0a",
  "page_bio": "#6b7280",
  "page_muted": "#9ca3af",
  "btn_bg": "#0a0a0a",
  "btn_text": "#ffffff",
  "btn_border": "#0a0a0a",
  "btn_style": "filled",
  "btn_radius": 6,
  "btn_font_weight": 600,
  "avatar_ring_color": "#0a0a0a",
  "avatar_ring_width": 2,
  "avatar_shadow": false,
  "social_icon_mode": "black",
  "social_bg": "#f3f4f6",
  "social_bg_opacity": 100,
  "font_family": "Outfit",
  "divider_color": "#e5e7eb"
}');
```

---

# TASK 3 — LIBRERIE E CONFIGURAZIONI

## 3.1 Supabase client browser `src/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## 3.2 Supabase client server `src/lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

## 3.3 Middleware auth `src/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Proteggi /dashboard/*
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect se già loggato
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && user) {
    return NextResponse.redirect(new URL('/dashboard/links', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
```

## 3.4 Rilevamento piattaforma `src/lib/detect-platform.ts`

```typescript
import { createClient } from '@/lib/supabase/client'
import type { Platform } from '@/types'

const cache = new Map<string, Platform>()

export async function detectPlatform(url: string): Promise<Platform> {
  const fallback: Platform = {
    id: 0, slug: 'link', name: 'Link', brand_color: '#6C5CE7',
    category: 'other', domain_patterns: []
  }

  if (!url) return fallback

  // Pulisci URL
  const clean = url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .toLowerCase()

  if (cache.has(clean)) return cache.get(clean)!

  const supabase = createClient()
  const { data } = await supabase
    .from('platforms')
    .select('*')
    .overlaps('domain_patterns', [clean])
    .limit(1)
    .maybeSingle()

  const result = data ?? fallback
  cache.set(clean, result)
  return result
}

// URL icona Simple Icons via CDN (no npm necessario)
export function getIconUrl(slug: string, colorHex: string): string {
  if (slug === 'link') return ''
  const color = colorHex.replace('#', '')
  return `https://cdn.simpleicons.org/${slug}/${color}`
}
```

## 3.5 Risoluzione tema `src/lib/resolve-theme.ts`

```typescript
import type { Profile, Theme, ThemeConfig } from '@/types'

const DEFAULT_THEME_SLUG = 'cosmo-dark'

export function resolveTheme(profile: Profile, themes: Theme[]): ThemeConfig {
  // PRO con customizzazione custom: usa custom_theme
  if (profile.plan === 'pro' && profile.custom_theme) {
    return profile.custom_theme
  }
  // Usa tema preset scelto
  const preset = themes.find(t => t.slug === profile.theme_slug)
  if (preset) return preset.config as ThemeConfig
  // Fallback cosmo-dark
  const fallback = themes.find(t => t.slug === DEFAULT_THEME_SLUG)
  if (fallback) return fallback.config as ThemeConfig
  throw new Error('Nessun tema trovato. Eseguire seed temi.')
}

// Genera CSS inline da ThemeConfig
export function themeToCSS(t: ThemeConfig): React.CSSProperties {
  const bgStyle: React.CSSProperties = t.bg_type === 'gradient'
    ? { backgroundImage: `linear-gradient(${t.bg_value})` }
    : t.bg_type === 'image'
    ? { backgroundImage: `url(${t.bg_value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: t.bg_value }

  return {
    ...bgStyle,
    color: t.page_text,
    fontFamily: `'${t.font_family}', sans-serif`,
  }
}
```

## 3.6 Upload avatar `src/lib/avatar-upload.ts`

```typescript
import { createClient } from '@/lib/supabase/client'

const MAX_SIZE = 200  // px
const JPEG_QUALITY = 0.85

async function resizeAndCompress(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      const ratio = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height)
      const w = Math.round(img.width * ratio)
      const h = Math.round(img.height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        blob => {
          URL.revokeObjectURL(objectUrl)
          blob ? resolve(blob) : reject(new Error('Canvas toBlob fallito'))
        },
        'image/jpeg',
        JPEG_QUALITY
      )
    }

    img.onerror = () => reject(new Error('Impossibile caricare immagine'))
    img.src = objectUrl
  })
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error('File troppo grande (max 5MB)')

  const compressed = await resizeAndCompress(file)
  const path = `${userId}/avatar.jpg`

  const supabase = createClient()
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, compressed, {
      upsert: true,
      contentType: 'image/jpeg',
    })

  if (error) throw new Error(`Upload fallito: ${error.message}`)

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  // Aggiungi cache-bust per invalidare browser cache
  return `${data.publicUrl}?t=${Date.now()}`
}
```

## 3.7 Tracking analytics `src/lib/analytics.ts`

```typescript
// Fire-and-forget: non blocca MAI il redirect/navigazione

export function trackClick(linkId: string, userId: string): void {
  const device = getDevice()
  fetch('/api/track/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ link_id: linkId, user_id: userId, device }),
  }).catch(() => {}) // Ignora errori silenziosamente
}

export function trackView(userId: string): void {
  const device = getDevice()
  fetch('/api/track/view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, device }),
  }).catch(() => {})
}

function getDevice(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}
```

---

# TASK 4 — COMPONENTI UI BASE

## 4.1 Componente icona piattaforma `src/components/shared/PlatformIcon.tsx`

```typescript
'use client'
import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'
import { detectPlatform, getIconUrl } from '@/lib/detect-platform'
import type { Platform } from '@/types'

type ColorMode = 'brand' | 'white' | 'black'

interface Props {
  url: string
  size?: number
  colorMode?: ColorMode
  className?: string
}

export function PlatformIcon({ url, size = 20, colorMode = 'brand', className }: Props) {
  const [platform, setPlatform] = useState<Platform | null>(null)

  useEffect(() => {
    detectPlatform(url).then(setPlatform)
  }, [url])

  if (!platform || platform.slug === 'link') {
    return <Globe size={size} className={className} />
  }

  const color = colorMode === 'brand' ? platform.brand_color
    : colorMode === 'white' ? '#ffffff'
    : '#000000'

  const iconUrl = getIconUrl(platform.slug, color)
  if (!iconUrl) return <Globe size={size} className={className} />

  return (
    <img
      src={iconUrl}
      alt={platform.name}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'block' }}
      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}
```

## 4.2 Logo con mascotte `src/components/shared/Logo.tsx`

```typescript
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  dark?: boolean         // true = testo bianco (per sidebar scura)
  href?: string
}

export function Logo({ size = 'md', dark = false, href = '/' }: Props) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const fontSizes = { sm: '15px', md: '19px', lg: '26px' }
  const s = sizes[size]
  const fs = fontSizes[size]

  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Image
        src="/mascot-logo.png"
        alt="CosmoLink mascotte"
        width={s}
        height={s}
        style={{ objectFit: 'contain' }}
      />
      <span style={{
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        fontSize: fs,
        letterSpacing: '-0.02em',
        color: dark ? '#ffffff' : '#111118'
      }}>
        Cosmo
        <span style={{
          background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Link
        </span>
      </span>
    </div>
  )

  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link> : content
}
```

---

# TASK 5 — AUTH (Login / Register)

## 5.1 Pagina login `src/app/auth/login/page.tsx`

Implementa form con:
- Input email + password
- Pulsante "Accedi con Email"
- Pulsante "Accedi con Google" (OAuth Supabase)
- Link a /auth/register
- Gestione errori con messaggio inline
- Redirect a /dashboard/links dopo login

```typescript
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/shared/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard/links')
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f0f6', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Logo size="md" href="/" />
          <p style={{ color: '#6b6b80', marginTop: 12, fontSize: 14 }}>Accedi al tuo account</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e4e4ec', fontSize: 14, marginBottom: 10, outline: 'none', fontFamily: 'Outfit, sans-serif' }}/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e4e4ec', fontSize: 14, marginBottom: 16, outline: 'none', fontFamily: 'Outfit, sans-serif' }}/>
        <button onClick={handleEmailLogin} disabled={loading}
          style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg,#6c5ce7,#00cec9)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', marginBottom: 10, fontFamily: 'Outfit, sans-serif' }}>
          {loading ? 'Accesso...' : 'Accedi'}
        </button>
        <button onClick={handleGoogleLogin}
          style={{ width: '100%', padding: '11px', borderRadius: 10, background: '#fff', border: '1.5px solid #e4e4ec', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          Continua con Google
        </button>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b6b80' }}>
          Non hai un account? <a href="/auth/register" style={{ color: '#6c5ce7', fontWeight: 600 }}>Registrati</a>
        </p>
      </div>
    </div>
  )
}
```

## 5.2 OAuth callback `src/app/auth/callback/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(`${origin}/dashboard/links`)
}
```

## 5.3 Creazione profilo automatica dopo registrazione

Al primo accesso (OAuth o email), se `profiles` non ha la riga per quell'utente, crearla automaticamente. Implementa con Supabase Database Webhook o in-app check nel layout della dashboard:

```typescript
// In src/app/dashboard/layout.tsx — controlla e crea profilo se mancante
const { data: profile } = await supabase
  .from('profiles')
  .select('id, username')
  .eq('id', user.id)
  .maybeSingle()

if (!profile) {
  // Genera username univoco base dall'email
  const baseUsername = user.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  let username = baseUsername.substring(0, 20)
  // Controlla unicità e aggiungi numero se necessario
  let attempt = 0
  while (true) {
    const { data: existing } = await supabase.from('profiles').select('id').eq('username', username).maybeSingle()
    if (!existing) break
    attempt++
    username = `${baseUsername.substring(0, 17)}${attempt}`
  }
  await supabase.from('profiles').insert({ id: user.id, username, display_name: user.user_metadata?.full_name || username })
}
```

---

# TASK 6 — DASHBOARD LAYOUT E SIDEBAR

## 6.1 Layout dashboard `src/app/dashboard/layout.tsx`

- Sidebar sinistra fissa (228px) con sfondo `#16161e`
- Contenuto principale a destra su sfondo `#f0f0f6`
- Topbar con titolo sezione + badge piano + pulsante Upgrade PRO
- Sidebar collassabile su mobile (hamburger menu)

**Voci sidebar:**
```
🔗  Link              → /dashboard/links
🎨  Aspetto           → /dashboard/appearance  
📊  Analytics         → /dashboard/analytics
⬛  QR Code           → /dashboard/qrcode
⚙️  Impostazioni      → /dashboard/settings
```

**Stili sidebar:**
- Sfondo: `#16161e`
- Item attivo: `background: rgba(108,92,231,0.2)` con testo bianco
- Item hover: `background: rgba(255,255,255,0.06)`
- Font: Outfit 13.5px
- Icone: lucide-react, 16px
- Profile pill: avatar + username + `cosmolink.app/username`

---

# TASK 7 — EDITOR LINK

**File:** `src/app/dashboard/links/page.tsx`

## 7.1 Funzionalità richieste

- Mostra lista link ordinati per `position` ASC
- Ogni link card mostra: handle drag (`GripVertical`), icona piattaforma (`PlatformIcon`), titolo, URL (troncato), numero click, toggle attivo/inattivo, bottoni ✏️ e 🗑️
- Drag & drop per riordinare usando `@dnd-kit/sortable`
- Modal "Aggiungi link" con campi: titolo, URL, tipo (link/header/divider)
- Autodetect icona dall'URL tramite `detectPlatform(url)`
- Preview mobile live in colonna destra (aggiornata in tempo reale allo stato locale)
- Limite Free: max 5 link di tipo `link` (header e divider non contano)
- Contatore "N/5 link" visibile per utenti Free

## 7.2 Logica drag & drop con dnd-kit

```typescript
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

// Dopo il drop, aggiorna positions nel DB:
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event
  if (!over || active.id === over.id) return
  const oldIndex = links.findIndex(l => l.id === active.id)
  const newIndex = links.findIndex(l => l.id === over.id)
  const reordered = arrayMove(links, oldIndex, newIndex)
  setLinks(reordered)
  // Aggiorna DB con nuove position
  await Promise.all(reordered.map((link, idx) =>
    supabase.from('links').update({ position: idx }).eq('id', link.id)
  ))
}
```

---

# TASK 8 — ASPETTO E TEMI

**File:** `src/app/dashboard/appearance/page.tsx`

## 8.1 Sezione temi preset

- Griglia 4 colonne di temi
- Ogni card: preview sfondo + colore accent + nome + badge FREE/PRO
- Click su tema FREE: applica immediatamente (UPDATE profiles SET theme_slug)
- Click su tema PRO da utente Free: mostra modal "Upgrade a PRO"
- Tema selezionato: bordo `2px solid #6c5ce7` + glow

## 8.2 Sezione personalizzazione (solo PRO)

Mostra questi controlli con preview live telefono a destra:

**SFONDO**
- Radio: [Colore pieno] [Gradiente] [Immagine]
- Colore pieno → `<input type="color">`
- Gradiente → due color picker + slider angolo 0-360°
- Immagine → file upload (max 2MB, salva su Supabase Storage bucket `avatars`)

**BOTTONI**
- Radio stile: [Pieno] [Bordo] [Glass] [Shadow] [Gradient]
- Color picker sfondo bottone
- Color picker testo bottone  
- Color picker bordo bottone
- Slider radius 0–30px con valore numerico live

**TESTO PAGINA**
- Color picker nome utente
- Color picker bio/sottotitolo

**AVATAR**
- Color picker colore ring
- Radio spessore: [Nessuno 0px] [Sottile 2px] [Medio 3px] [Spesso 4px]
- Toggle ombra on/off

**ICONE SOCIAL**
- Radio colore: [Brand] [Bianco] [Nero] [Custom]
- Color picker sfondo circoletto
- Slider opacità 0–100%

**TIPOGRAFIA**
- Select font: Outfit / DM Sans / Syne / Playfair Display / Space Mono / Nunito

## 8.3 Salvataggio customizzazione

```typescript
const saveCustomTheme = async (config: ThemeConfig) => {
  await supabase
    .from('profiles')
    .update({ custom_theme: config })
    .eq('id', user.id)
}
```

## 8.4 Sezione social links

- Campo input per ogni social: Instagram, Twitter/X, YouTube, TikTok, LinkedIn, GitHub, Telegram, WhatsApp, Sito web
- Icona del social a sinistra di ogni input (da Simple Icons)
- Salvataggio su `profiles.social_links` JSONB

## 8.5 Upload avatar

- Pulsante "Cambia avatar" con file picker
- Usa `uploadAvatar()` da `src/lib/avatar-upload.ts`
- Mostra spinner durante upload
- Preview immediata dopo successo

---

# TASK 9 — ANALYTICS

**File:** `src/app/dashboard/analytics/page.tsx`

## 9.1 Metriche da mostrare

**4 card stat in cima:**
- Visite totali (COUNT profile_views nel periodo)
- Click totali (COUNT link_clicks nel periodo)
- CTR medio ((click/visite)*100)%
- Link attivi (COUNT links WHERE is_active=true)

**Filtro periodo:** Oggi / 7 giorni / 30 giorni / 90 giorni

**Grafico area (recharts AreaChart):**
- Asse X: giorni del periodo
- Due serie: Visite (viola #6c5ce7) e Click (ciano #00cec9)
- Area con gradiente sotto la curva

**Tabella click per link:**
- Colonne: icona, titolo link, N click, barra percentuale colorata

**Grafico dispositivi (recharts BarChart orizzontale):**
- Mobile / Desktop / Tablet con colori distinti

## 9.2 Query analytics esempio

```typescript
// Visite ultime N ore
const hoursAgo = (n: number) => new Date(Date.now() - n * 3600000).toISOString()

const { data: views } = await supabase
  .from('profile_views')
  .select('viewed_at, device')
  .eq('user_id', userId)
  .gte('viewed_at', hoursAgo(period === 'today' ? 24 : period === '7gg' ? 168 : period === '30gg' ? 720 : 2160))

const { data: clicks } = await supabase
  .from('link_clicks')
  .select('clicked_at, device, link_id')
  .eq('user_id', userId)
  .gte('clicked_at', hoursAgo(/* stesso valore */))
```

---

# TASK 10 — QR CODE

**File:** `src/app/dashboard/qrcode/page.tsx`

## 10.1 Implementazione

```typescript
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'

// URL da codificare
const profileUrl = `https://cosmolink.app/${profile.username}`

// QR base con logo mascotte al centro
<QRCodeSVG
  value={profileUrl}
  size={200}
  level="H"                    // High error correction per logo al centro
  imageSettings={{
    src: '/mascot-logo.png',   // Logo mascotte al centro
    x: undefined,
    y: undefined,
    height: 40,
    width: 40,
    excavate: true,            // Rimuove moduli sotto il logo
  }}
/>
```

## 10.2 Download PNG

```typescript
const downloadPNG = () => {
  const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = `cosmolink-${profile.username}-qr.png`
  a.click()
}
```

## 10.3 Copia URL

```typescript
const copyUrl = async () => {
  await navigator.clipboard.writeText(profileUrl)
  // Mostra toast "URL copiato!"
}
```

---

# TASK 11 — PAGINA PUBBLICA (SSR)

**File:** `src/app/[username]/page.tsx`

## 11.1 Requisiti tecnici

- **Server Component** con `revalidate = 60` (ISR ogni 60 secondi)
- `generateMetadata` per OG tags dinamici
- Redirect 404 se username non esiste

## 11.2 Struttura completa

```typescript
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { resolveTheme, themeToCSS } from '@/lib/resolve-theme'
import { notFound } from 'next/navigation'
import { PublicPageClient } from '@/components/public/PublicPageClient'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, bio, avatar_url')
    .eq('username', params.username)
    .single()

  if (!profile) return { title: 'Pagina non trovata' }

  return {
    title: `${profile.display_name || profile.username} | CosmoLink`,
    description: profile.bio || `La pagina link di ${profile.display_name || profile.username}`,
    openGraph: {
      title: `${profile.display_name || profile.username} | CosmoLink`,
      description: profile.bio || '',
      images: [{ url: `/api/og/${profile.username}` }],
    },
  }
}

export default async function UserPage({ params }: { params: { username: string } }) {
  const supabase = await createClient()

  const [{ data: profile }, { data: themes }] = await Promise.all([
    supabase.from('profiles').select('*').eq('username', params.username).single(),
    supabase.from('themes').select('*'),
  ])

  if (!profile) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .lte('starts_at', 'now()')  // solo link attivi per data
    .or('ends_at.is.null,ends_at.gt.now()')
    .order('position', { ascending: true })

  const theme = resolveTheme(profile, themes || [])

  return <PublicPageClient profile={profile} links={links || []} theme={theme} />
}
```

## 11.3 Componente client pagina pubblica

**File:** `src/components/public/PublicPageClient.tsx`

- `'use client'` (serve per tracking)
- `useEffect` al mount → chiama `trackView(profile.id)`
- Click su ogni link → chiama `trackClick(link.id, profile.id)` poi naviga all'URL
- Avatar: se `profile.avatar_url` mostra quella, altrimenti `mascot.png`
- Applicare tutti i valori `ThemeConfig` per sfondo, font, colori, stile bottoni
- Icone social da `profile.social_links` con `PlatformIcon` in modalità `social_icon_mode`
- Footer: "Powered by CosmoLink" con mascotte logo (nascosto per utenti PRO con `is_verified`)

**Struttura HTML pagina pubblica:**
```
<div style={bgStyle}>            ← sfondo da ThemeConfig
  <div centered maxWidth=460>
    <Avatar ring />               ← avatar con ring colorato
    <h1>display_name</h1>
    <p>bio</p>
    <SocialRow />                 ← icone social orizzontali
    {links.map(link => (
      link.link_type === 'header'  → <HeaderBlock />   (testo separatore)
      link.link_type === 'divider' → <DividerBlock />  (linea)
      link.link_type === 'embed'   → <EmbedBlock />    (iframe YouTube/Vimeo) [PRO]
      default                      → <LinkButton />    (bottone cliccabile)
    ))}
    <footer>Powered by CosmoLink</footer>
  </div>
</div>
```

---

# TASK 12 — API ROUTES

## 12.1 Track click `src/app/api/track/click/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { link_id, user_id, device } = await req.json()
    if (!link_id || !user_id) return NextResponse.json({ ok: false }, { status: 400 })

    const supabase = await createClient()
    const referrer = req.headers.get('referer') || null
    const country = req.headers.get('x-vercel-ip-country') || null

    await supabase.from('link_clicks').insert({
      link_id, user_id, device: device || 'desktop', referrer, country
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
```

## 12.2 Track view `src/app/api/track/view/route.ts`

Stessa struttura di track/click ma inserisce in `profile_views`.

## 12.3 OG Image `src/app/api/og/[username]/route.ts`

```typescript
import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(req: Request, { params }: { params: { username: string } }) {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, username, bio, avatar_url')
    .eq('username', params.username)
    .single()

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'linear-gradient(135deg,#0f0f18,#1a1025)', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
          {profile?.display_name || profile?.username || 'CosmoLink'}
        </div>
        {profile?.bio && <div style={{ fontSize: 24, opacity: 0.7, textAlign: 'center', maxWidth: 600 }}>{profile.bio}</div>}
        <div style={{ marginTop: 32, fontSize: 20, opacity: 0.5 }}>cosmolink.app/{params.username}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

---

# TASK 13 — DESIGN SYSTEM

## 13.1 Font da importare in `src/app/layout.tsx`

```typescript
import { Outfit, DM_Sans, Syne, Playfair_Display, Space_Mono, Nunito, DM_Mono } from 'next/font/google'
// Tutti precaricati ma usati solo quando il tema li richiede
```

## 13.2 Palette colori principale (Tailwind + CSS vars)

```css
/* src/app/globals.css */
:root {
  --bg:         #f0f0f6;   /* Sfondo app */
  --surface:    #ffffff;   /* Card, modal */
  --surface2:   #f4f4fa;   /* Nested bg */
  --border:     #e4e4ec;   /* Bordi */
  --sidebar-bg: #16161e;   /* Sidebar scura */
  --sidebar-bd: #2a2a38;   /* Bordo sidebar */
  --text:       #111118;   /* Testo primario */
  --muted:      #6b6b80;   /* Testo secondario */
  --faint:      #9898b0;   /* Testo terziario */
  --accent:     #6c5ce7;   /* Viola CosmoLink */
  --accent-l:   #f0eeff;   /* Viola chiaro BG */
  --accent-h:   #5a4bd1;   /* Viola hover */
  --cyan:       #00cec9;   /* Ciano secondario */
  --green:      #00b894;   /* Successo */
  --red:        #e17055;   /* Errore/Danger */
  --yellow:     #fdcb6e;   /* Warning */
  --grad:       linear-gradient(135deg, #6c5ce7, #00cec9);
  --shadow:     0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  --shadow-l:   0 4px 24px rgba(0,0,0,0.10);
  --radius:     14px;
}
```

## 13.3 Regole design da rispettare sempre

- Font globale: **Outfit** (400/500/600/700/800)
- Titoli dashboard: fontWeight 800, letterSpacing -0.02em
- Sidebar: **MAI** usare Tailwind dark mode, usare CSS vars `--sidebar-bg`
- Icone: **SOLO** lucide-react, dimensione 16px sidebar, 18px topbar, 20px cards
- Bottoni primari: sempre gradient `--grad` con box-shadow viola
- Border radius carte: 14px
- Border radius bottoni: 10px default
- Input: bordo 1.5px solid var(--border), focus con var(--accent)
- Transizioni: `all 0.18s ease` su hover
- NON usare emoji come icone UI — solo lucide-react
- Toast notifiche: in basso a destra, 3 secondi, auto-dismiss

---

# TASK 14 — PIANI FREE vs PRO

## 14.1 Tabella completa limitazioni

| Feature | FREE | PRO |
|---|---|---|
| Link di tipo "link" | Max 5 | Illimitati |
| Tipi blocco (header, divider) | ✅ | ✅ |
| Embed video (YouTube/Vimeo) | ❌ | ✅ |
| Link programmati (starts_at/ends_at) | ❌ | ✅ |
| Link featured | ❌ | ✅ |
| Temi preset | 4 (free only) | Tutti (10) |
| Customizzazione custom_theme | ❌ | ✅ |
| Colore sfondo custom | ❌ | ✅ |
| Sfondo immagine | ❌ | ✅ |
| Font custom | ❌ | ✅ |
| QR personalizzato (colori) | ❌ | ✅ |
| Rimozione "Powered by CosmoLink" | ❌ | ✅ |
| Analytics avanzate (country, devices) | ❌ | ✅ |
| Upload avatar | ✅ | ✅ |
| Social links | ✅ | ✅ |

## 14.2 Implementazione check piano

```typescript
// src/lib/utils.ts
export function isPro(plan: string): boolean {
  return plan === 'pro'
}

// Uso nei componenti:
// {isPro(profile.plan) ? <ProFeature /> : <UpgradePrompt />}
```

## 14.3 Componente UpgradePrompt

Mostrare quando utente Free tenta feature PRO:
- Modal con titolo "Funzione PRO"
- Descrizione feature
- Pulsante "Upgrade a PRO" (per ora placeholder, senza pagamento reale)
- Badge PRO animato con gradient

---

# TASK 15 — ORDINE BUILD E CHECKLIST

## Fase 1 — MVP (PRIORITÀ MASSIMA)

- [ ] 1. Setup Next.js + Supabase + Vercel config
- [ ] 2. Tutte le migrations DB in ordine (001→008)
- [ ] 3. Auth: login, register, Google OAuth, callback, logout
- [ ] 4. Auto-creazione profilo al primo accesso
- [ ] 5. Layout dashboard con sidebar funzionante
- [ ] 6. Editor link: CRUD + drag & drop + toggle attivo
- [ ] 7. Pagina pubblica SSR `/[username]` con tema Cosmo Dark
- [ ] 8. Tracking click + view base
- [ ] 9. Deploy Vercel funzionante con variabili d'ambiente

## Fase 2 — V1

- [ ] 10. Sezione Aspetto: selezione temi preset (4 free)
- [ ] 11. Upload avatar con resize client-side
- [ ] 12. Social links nel profilo e nella pagina pubblica
- [ ] 13. Preview mobile live nell'editor link
- [ ] 14. QR Code con mascotte + download PNG/SVG
- [ ] 15. PlatformIcon con Simple Icons CDN + auto-detect

## Fase 3 — V2

- [ ] 16. Analytics dashboard: grafici recharts + filtro periodo
- [ ] 17. Customizzazione completa (solo PRO): tutti i controlli aspetto
- [ ] 18. Tutti i 10 temi preset funzionanti
- [ ] 19. Blocchi header e divider nell'editor
- [ ] 20. Link programmati con starts_at/ends_at
- [ ] 21. OG Image dinamica via Vercel OG

## Fase 4 — Commercializzazione

- [ ] 22. Sistema pagamenti (Stripe o PayPal)
- [ ] 23. Gestione piano PRO automatica dopo pagamento
- [ ] 24. Dashboard admin (gestione utenti)
- [ ] 25. Domini custom (CNAME Vercel)

---

# NOTE FINALI

- **TypeScript strict mode** sempre. Zero `any` espliciti.
- **Server Components** di default. `'use client'` solo dove serve interazione.
- **ISR** su `/[username]`: `export const revalidate = 60`
- **Tracking** sempre fire-and-forget, mai bloccare navigazione.
- **Simple Icons** via CDN `https://cdn.simpleicons.org/{slug}/{hexcolor}` — non installare pacchetto npm, usare CDN.
- **Avatar** resize a 200×200 JPEG lato client prima di upload. Mai caricare l'originale.
- **Piano Free/PRO** controllato sempre lato server (`profiles.plan`), mai solo lato client.
- **Supabase RLS** attivo su tutte le tabelle. Non disabilitare mai.
- **Username** validato con regex `^[a-z0-9_-]{3,30}$` — solo minuscolo, numeri, trattini.
- **Mascotte** (`/public/mascot.png` e `/public/mascot-logo.png`): immagini fornite dal cliente. Non generarle, non sostituirle.

---

*CosmoLink Brief Tecnico v2.0 — Completo e unificato — DanyWolf / CosmoNet*
