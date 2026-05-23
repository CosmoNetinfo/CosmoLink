# CosmoLink — Brief Aggiornamento v2.1
**Data:** Maggio 2026  
**Priorità:** Alta — da completare prima del deploy finale  

> Esegui i task nell'ordine. Per ogni task dimmi quando è completato con screenshot.

---

## TASK A — FIX LINKEDIN E RILEVAMENTO ICONE

Il problema è nel matching di `detect-platform.ts`. Il metodo `overlaps` di Supabase non funziona correttamente. Riscrivi così:

```typescript
export async function detectPlatform(url: string): Promise<Platform> {
  const fallback: Platform = {
    id: 0, slug: 'link', name: 'Link',
    brand_color: '#6C5CE7', category: 'other', domain_patterns: []
  }
  if (!url) return fallback

  let clean = url.toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0]
    .split('#')[0]
    .trim()

  if (cache.has(clean)) return cache.get(clean)!

  // Carica tutte le piattaforme e fai il match lato client
  const supabase = createClient()
  const { data: all } = await supabase
    .from('platforms')
    .select('*')
    .neq('slug', 'link')

  if (all) {
    for (const platform of all) {
      for (const pattern of platform.domain_patterns) {
        if (pattern && clean.includes(pattern)) {
          cache.set(clean, platform)
          return platform
        }
      }
    }
  }

  cache.set(clean, fallback)
  return fallback
}
```

Poi esegui questo SQL su Supabase per resettare tutti i pattern:

```sql
DELETE FROM platforms;

INSERT INTO platforms (slug, name, brand_color, category, domain_patterns) VALUES
('instagram','Instagram','#E4405F','social',ARRAY['instagram.com']),
('facebook','Facebook','#1877F2','social',ARRAY['facebook.com','fb.com','fb.me']),
('twitter','Twitter/X','#000000','social',ARRAY['twitter.com','x.com']),
('threads','Threads','#000000','social',ARRAY['threads.net']),
('snapchat','Snapchat','#FFFC00','social',ARRAY['snapchat.com']),
('pinterest','Pinterest','#E60023','social',ARRAY['pinterest.com','pin.it']),
('reddit','Reddit','#FF4500','social',ARRAY['reddit.com','redd.it']),
('tumblr','Tumblr','#35465C','social',ARRAY['tumblr.com']),
('mastodon','Mastodon','#6364FF','social',ARRAY['mastodon.social','mastodon.online']),
('bluesky','Bluesky','#0085FF','social',ARRAY['bsky.app','bsky.social']),
('youtube','YouTube','#FF0000','video',ARRAY['youtube.com','youtu.be']),
('tiktok','TikTok','#000000','video',ARRAY['tiktok.com','vm.tiktok.com']),
('twitch','Twitch','#9146FF','video',ARRAY['twitch.tv']),
('vimeo','Vimeo','#1AB7EA','video',ARRAY['vimeo.com']),
('kick','Kick','#53FC18','video',ARRAY['kick.com']),
('spotify','Spotify','#1DB954','music',ARRAY['spotify.com','open.spotify.com']),
('applemusic','Apple Music','#FC3C44','music',ARRAY['music.apple.com']),
('soundcloud','SoundCloud','#FF3300','music',ARRAY['soundcloud.com']),
('bandcamp','Bandcamp','#1DA0C3','music',ARRAY['bandcamp.com']),
('deezer','Deezer','#EF5466','music',ARRAY['deezer.com']),
('tidal','Tidal','#000000','music',ARRAY['tidal.com']),
('audiomack','Audiomack','#FFA200','music',ARRAY['audiomack.com']),
('github','GitHub','#181717','dev',ARRAY['github.com']),
('gitlab','GitLab','#FC6D26','dev',ARRAY['gitlab.com']),
('stackoverflow','Stack Overflow','#F58025','dev',ARRAY['stackoverflow.com']),
('devdotto','Dev.to','#0A0A0A','dev',ARRAY['dev.to']),
('hashnode','Hashnode','#2962FF','dev',ARRAY['hashnode.dev','hashnode.com']),
('codepen','CodePen','#000000','dev',ARRAY['codepen.io']),
('replit','Replit','#F26207','dev',ARRAY['replit.com']),
('producthunt','Product Hunt','#DA552F','dev',ARRAY['producthunt.com']),
('linkedin','LinkedIn','#0A66C2','professional',ARRAY['linkedin.com']),
('behance','Behance','#1769FF','professional',ARRAY['behance.net']),
('dribbble','Dribbble','#EA4C89','professional',ARRAY['dribbble.com']),
('fiverr','Fiverr','#1DBF73','professional',ARRAY['fiverr.com']),
('upwork','Upwork','#6FDA44','professional',ARRAY['upwork.com']),
('telegram','Telegram','#2CA5E0','messaging',ARRAY['t.me','telegram.me','telegram.org']),
('whatsapp','WhatsApp','#25D366','messaging',ARRAY['wa.me','whatsapp.com']),
('discord','Discord','#5865F2','messaging',ARRAY['discord.gg','discord.com']),
('slack','Slack','#4A154B','messaging',ARRAY['slack.com']),
('signal','Signal','#3A76F0','messaging',ARRAY['signal.me','signal.group']),
('line','LINE','#00B900','messaging',ARRAY['line.me']),
('patreon','Patreon','#FF424D','creator',ARRAY['patreon.com']),
('kofi','Ko-fi','#FF5E5B','creator',ARRAY['ko-fi.com']),
('buymeacoffee','Buy Me a Coffee','#FFDD00','creator',ARRAY['buymeacoffee.com']),
('gumroad','Gumroad','#FF90E8','creator',ARRAY['gumroad.com']),
('substack','Substack','#FF6719','creator',ARRAY['substack.com']),
('beehiiv','Beehiiv','#000000','creator',ARRAY['beehiiv.com']),
('shopify','Shopify','#96BF48','shop',ARRAY['myshopify.com']),
('etsy','Etsy','#F1641E','shop',ARRAY['etsy.com']),
('amazon','Amazon','#FF9900','shop',ARRAY['amazon.com','amazon.it','amzn.to']),
('depop','Depop','#FF2300','shop',ARRAY['depop.com']),
('vinted','Vinted','#007782','shop',ARRAY['vinted.it','vinted.com']),
('paypal','PayPal','#003087','other',ARRAY['paypal.com','paypal.me']),
('stripe','Stripe','#635BFF','other',ARRAY['stripe.com']),
('calendly','Calendly','#006BFF','other',ARRAY['calendly.com']),
('notion','Notion','#000000','other',ARRAY['notion.so','notion.site']),
('wordpress','WordPress','#21759B','other',ARRAY['wordpress.com','wordpress.org']),
('medium','Medium','#000000','other',ARRAY['medium.com']),
('steam','Steam','#000000','gaming',ARRAY['store.steampowered.com','steamcommunity.com']),
('itchdotio','Itch.io','#FA5C5C','gaming',ARRAY['itch.io']),
('link','Link generico','#6C5CE7','other',ARRAY['']);
```

Riavvia il server dopo. Testa questi URL e dimmi l'esito:
- `https://linkedin.com/in/test` → LinkedIn blu ✅
- `https://spotify.com/show/test` → Spotify verde ✅
- `https://soundcloud.com/test` → SoundCloud arancio ✅
- `https://t.me/cosmonet` → Telegram blu ✅
- `https://wa.me/393517064080` → WhatsApp verde ✅

---

## TASK B — SISTEMA ASPETTO COMPLETAMENTE RIDISEGNATO

La sezione Aspetto (`/dashboard/appearance`) va rifatta da zero. Il sistema attuale ha temi tutti uguali e poco modificabili. Il nuovo sistema ha 3 livelli indipendenti con preview live.

### B1 — LIVELLO 1: SFONDO (Free + PRO)

Tre modalità selezionabili con radio button:

**Colore pieno:**
- Color picker libero → aggiorna sfondo in tempo reale

**Gradiente (2 colori):**
- Color picker colore A + color picker colore B
- Slider angolo 0°–360° con valore numerico live
- Preview del gradiente inline

**Gradiente preset (12 opzioni cliccabili):**
Mostra 12 swatches di gradiente, 4 per riga:
```
1.  135deg, #6c5ce7, #00cec9   → "Cosmo"
2.  135deg, #0f0f18, #2d1b69   → "Deep Space"
3.  135deg, #000000, #434343   → "Midnight"
4.  180deg, #0d2818, #4ade80   → "Forest"
5.  135deg, #ff6b6b, #feca57   → "Sunset"
6.  135deg, #1a1a2e, #e94560   → "Rose Dark"
7.  135deg, #f8f9fa, #dee2e6   → "Cloud"
8.  135deg, #ffeaa7, #fdcb6e   → "Golden"
9.  180deg, #030d20, #06b6d4   → "Ocean"
10. 135deg, #2d1b69, #ff6eb4   → "Nebula"
11. 135deg, #1e3c72, #2a5298   → "Navy"
12. 135deg, #134e5e, #71b280   → "Emerald"
```
Click su uno swatch → applicato immediatamente alla preview

### B2 — LIVELLO 2: BOTTONI (Free + PRO)

**Forma bottone — 4 opzioni con preview visiva:**
```
[  Pill  ]   [ Rounded ]   [ Square ]   [Sharp]
 radius:50px  radius:14px   radius:4px   radius:0
```

**Stile riempimento — 5 opzioni:**
```
[■ Pieno]  [□ Outline]  [◈ Glass]  [◰ Shadow]  [▣ Gradient]
```

**Colori:**
- Color picker "Colore bottone" → sfondo (o bordo se outline)
- Color picker "Colore testo" → testo dentro il bottone

Ogni cambiamento si vede immediatamente nella preview telefono.

### B3 — LIVELLO 3: DETTAGLI AVANZATI (solo PRO)

Mostra questi controlli con lock icon e tooltip "Disponibile con PRO" per utenti Free:

- **Font:** select con 6 opzioni → Outfit / DM Sans / Syne / Playfair Display / Space Mono / Nunito
- **Colore nome utente:** color picker
- **Colore bio:** color picker  
- **Ring avatar:** color picker + radio spessore [0] [2px] [3px] [4px]
- **Icone social:** radio [Brand] [Bianco] [Nero]
- **Sfondo immagine:** file upload (max 2MB) → sostituisce colore/gradiente

### B4 — TEMI PRESET RIDISEGNATI (16 temi)

I temi preset ora sono solo punti di partenza — l'utente li seleziona e poi può modificare tutto. Aggiorna `008_seed_themes.sql` con questi 16 temi visivamente DIVERSI:

```sql
DELETE FROM themes;

INSERT INTO themes (name, slug, is_pro, config) VALUES

-- FREE (8 temi)
('Cosmo', 'cosmo', false, '{
  "bg_type":"gradient","bg_value":"135deg,#0f0f18,#1a1025",
  "btn_bg":"#6c5ce7","btn_text":"#ffffff","btn_style":"filled","btn_radius":14,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.55)",
  "ring":"#6c5ce7","font_family":"Outfit"
}'),

('Arctic', 'arctic', false, '{
  "bg_type":"solid","bg_value":"#f4f7fb",
  "btn_bg":"#0ea5e9","btn_text":"#ffffff","btn_style":"filled","btn_radius":12,
  "page_text":"#0f172a","page_bio":"#64748b",
  "ring":"#0ea5e9","font_family":"Outfit"
}'),

('Sunset', 'sunset', false, '{
  "bg_type":"gradient","bg_value":"135deg,#ff6b6b,#feca57",
  "btn_bg":"#ffffff","btn_text":"#ff6b6b","btn_style":"filled","btn_radius":50,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.8)",
  "ring":"#ffffff","font_family":"Outfit"
}'),

('Forest', 'forest', false, '{
  "bg_type":"gradient","bg_value":"160deg,#0d2818,#0a1f10",
  "btn_bg":"#4ade80","btn_text":"#052e16","btn_style":"filled","btn_radius":10,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.6)",
  "ring":"#4ade80","font_family":"Outfit"
}'),

('Sand', 'sand', false, '{
  "bg_type":"solid","bg_value":"#faf9f5",
  "btn_bg":"#c2855c","btn_text":"#ffffff","btn_style":"filled","btn_radius":8,
  "page_text":"#1c1917","page_bio":"#78716c",
  "ring":"#c2855c","font_family":"Playfair Display"
}'),

('Lavender', 'lavender', false, '{
  "bg_type":"gradient","bg_value":"135deg,#e8d5f5,#c4b5fd",
  "btn_bg":"#7c3aed","btn_text":"#ffffff","btn_style":"pill","btn_radius":50,
  "page_text":"#3b0764","page_bio":"#6d28d9",
  "ring":"#7c3aed","font_family":"DM Sans"
}'),

('Midnight', 'midnight', false, '{
  "bg_type":"solid","bg_value":"#000000",
  "btn_bg":"transparent","btn_text":"#ffffff","btn_style":"outline","btn_radius":4,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.5)",
  "ring":"#ffffff","font_family":"Outfit"
}'),

('Cloud', 'cloud', false, '{
  "bg_type":"gradient","bg_value":"160deg,#ffffff,#e0f2fe",
  "btn_bg":"#0284c7","btn_text":"#ffffff","btn_style":"filled","btn_radius":12,
  "page_text":"#0c4a6e","page_bio":"#0369a1",
  "ring":"#0284c7","font_family":"DM Sans"
}'),

-- PRO (8 temi)
('Nebula', 'nebula', true, '{
  "bg_type":"gradient","bg_value":"160deg,#1a0a2e,#2d1b69,#0f2027",
  "btn_bg":"linear-gradient(135deg,#ff6eb4,#a855f7)","btn_text":"#ffffff","btn_style":"gradient","btn_radius":20,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.6)",
  "ring":"#ff6eb4","font_family":"Syne"
}'),

('Solar', 'solar', true, '{
  "bg_type":"gradient","bg_value":"160deg,#150f00,#1f1500",
  "btn_bg":"#f59e0b","btn_text":"#1a0f00","btn_style":"shadow","btn_radius":12,
  "page_text":"#fef3c7","page_bio":"rgba(254,243,199,0.6)",
  "ring":"#f59e0b","font_family":"Outfit"
}'),

('Rose', 'rose', true, '{
  "bg_type":"gradient","bg_value":"160deg,#1f0a10,#2d1220",
  "btn_bg":"rgba(251,113,133,0.15)","btn_text":"#fb7185","btn_style":"glass","btn_radius":16,
  "page_text":"#ffe4e6","page_bio":"rgba(255,228,230,0.6)",
  "ring":"#fb7185","font_family":"Outfit"
}'),

('Ocean', 'ocean', true, '{
  "bg_type":"gradient","bg_value":"180deg,#030d20,#041a38",
  "btn_bg":"transparent","btn_text":"#06b6d4","btn_style":"outline","btn_radius":14,
  "page_text":"#e0f7fa","page_bio":"rgba(224,247,250,0.6)",
  "ring":"#06b6d4","font_family":"Outfit"
}'),

('Neon City', 'neon', true, '{
  "bg_type":"solid","bg_value":"#020203",
  "btn_bg":"transparent","btn_text":"#39ff14","btn_style":"outline","btn_radius":0,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.5)",
  "ring":"#39ff14","font_family":"Space Mono"
}'),

('Mono', 'mono', true, '{
  "bg_type":"solid","bg_value":"#ffffff",
  "btn_bg":"#0a0a0a","btn_text":"#ffffff","btn_style":"filled","btn_radius":6,
  "page_text":"#0a0a0a","page_bio":"#6b7280",
  "ring":"#0a0a0a","font_family":"Outfit"
}'),

('Sakura', 'sakura', true, '{
  "bg_type":"gradient","bg_value":"135deg,#fce4ec,#f8bbd9",
  "btn_bg":"#e91e8c","btn_text":"#ffffff","btn_style":"pill","btn_radius":50,
  "page_text":"#880e4f","page_bio":"#c2185b",
  "ring":"#e91e8c","font_family":"Nunito"
}'),

('Galaxy', 'galaxy', true, '{
  "bg_type":"gradient","bg_value":"135deg,#0d0221,#190741,#0d0221",
  "btn_bg":"linear-gradient(135deg,#6c5ce7,#00cec9)","btn_text":"#ffffff","btn_style":"gradient","btn_radius":14,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.55)",
  "ring":"#00cec9","font_family":"Syne"
}');
```

### B5 — LAYOUT PAGINA ASPETTO

```
┌─────────────────────────────────────┬──────────────┐
│  TEMI PRESET (griglia 4 col)        │              │
│  [Cosmo] [Arctic] [Sunset] [Forest] │   📱 PREVIEW │
│  [Sand] [Lavender] [Midnight]...    │   LIVE       │
│                                     │   (telefono  │
│  ── SFONDO ──────────────────────   │    mobile)   │
│  ○ Colore pieno  ○ Gradiente        │              │
│  ○ Gradiente preset                 │   Si aggiorna│
│  [12 swatches cliccabili]           │   ad ogni    │
│  [color picker A] [color picker B]  │   modifica   │
│  Angolo: ──●──────── 135°           │              │
│                                     │              │
│  ── BOTTONI ─────────────────────   │              │
│  Forma: [Pill][Rounded][Square][Sharp]             │
│  Stile: [Pieno][Outline][Glass][Shadow][Gradient]  │
│  Colore: [■] #6c5ce7  Testo: [■] #fff             │
│                                     │              │
│  ── DETTAGLI AVANZATI (PRO) ──────  │              │
│  Font: [Outfit ▼]   🔒              │              │
│  Colore nome: [■]   🔒              │              │
│  Ring avatar: [■] [0][2][3][4]px 🔒│              │
│  Icone social: [Brand][Bianco][Nero]🔒             │
│  Sfondo immagine: [Upload] 🔒       │              │
│                                     │              │
│  [Salva modifiche]                  │              │
└─────────────────────────────────────┴──────────────┘
```

---

## TASK C — PRICING PAGE

Aggiungi sezione pricing nella landing page `/` dopo la sezione features.

**Titolo:** "Scegli il tuo piano"  
**Sottotitolo:** "Inizia gratis, passa a PRO quando vuoi. Nessun contratto."

**3 card affiancate:**

**Card FREE:**
- Prezzo: €0 / per sempre
- ✅ 5 link
- ✅ 4 temi + personalizzazione sfondo e bottoni
- ✅ QR Code con mascotte
- ✅ Analytics base
- ✅ Upload avatar
- ✅ Link social
- Bottone: "Inizia gratis" → `/auth/register`

**Card PRO MENSILE:**
- Prezzo: €4,99 / al mese
- Tutto il Free +
- ⚡ Link illimitati
- ⚡ Tutti i 16 temi
- ⚡ Font custom, colori avanzati
- ⚡ Analytics avanzate (paesi, dispositivi)
- ⚡ Embed YouTube/Vimeo
- ⚡ Link programmati
- ⚡ QR personalizzato
- ⚡ Nessun branding CosmoLink
- Bottone: "Passa a PRO" → `https://wa.me/393517064080?text=Ciao,%20voglio%20CosmoLink%20PRO%20mensile`

**Card PRO ANNUALE** ← evidenziata, bordo gradient, badge CONSIGLIATO:
- Badge: "🔥 2 mesi gratis"
- Prezzo: €39,99 / all'anno
- Sotto prezzo: "= €3,33/mese"
- Stesse feature del PRO Mensile
- Bottone: "Passa a PRO Annuale" → `https://wa.me/393517064080?text=Ciao,%20voglio%20CosmoLink%20PRO%20annuale`

**Banner lancio sotto le card:**
> 🚀 Offerta lancio — Piano PRO Annuale a €29,99 per i primi 3 mesi. Scrivici su WhatsApp.
- Sfondo gradient viola→ciano, testo bianco, border-radius 14px

---

## TASK D — LOGO AGGIORNATO

Ho due nuovi file PNG da usare come logo:
- `cosmolink-logo.png` → logo orizzontale (mascotte + testo) per navbar
- `cosmolink-icon-512.png` → icona quadrata per favicon

Sostituisci il logo attuale:

**In `Logo.tsx`:**
```typescript
// Sostituisci tutto il contenuto del componente con:
import Image from 'next/image'

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <a href={href} style={{ textDecoration: 'none', display: 'inline-flex' }}>
      <Image
        src="/cosmolink-logo.png"
        alt="CosmoLink"
        height={36}
        width={0}
        style={{ width: 'auto', height: '36px' }}
        priority
      />
    </a>
  )
}
```

**In `layout.tsx`:**
```typescript
export const metadata = {
  // ...resto invariato...
  icons: {
    icon: '/cosmolink-icon-512.png',
    apple: '/cosmolink-icon-512.png',
    shortcut: '/cosmolink-icon-512.png',
  }
}
```

I file `cosmolink-logo.png` e `cosmolink-icon-512.png` sono allegati — copiali in `/public/`.

---

## CHECKLIST FINALE

Dopo aver completato tutti i task, dimmi screenshot di:
- [ ] Dashboard link con icone LinkedIn + Spotify + SoundCloud corrette
- [ ] Pagina Aspetto con nuovo sistema a 3 livelli
- [ ] Griglia 16 temi visivamente diversi
- [ ] Preview live che si aggiorna in tempo reale
- [ ] Sezione pricing nella landing page
- [ ] Logo nuovo in navbar e favicon aggiornata

---

*CosmoLink Brief Update v2.1 — DanyWolf / CosmoNet*
