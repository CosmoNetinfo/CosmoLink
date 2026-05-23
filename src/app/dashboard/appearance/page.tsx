'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { uploadAvatar } from '@/lib/avatar-upload';
import { themeToCSS, normalizeThemeConfig } from '@/lib/resolve-theme';
import {
  Upload,
  Palette,
  Layout,
  User,
  Share2,
  Lock,
  Sparkles,
  Eye,
} from 'lucide-react';
import type { Profile, Theme, Platform, Link } from '@/types';

export default function AppearancePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [themeSlug, setThemeSlug] = useState('cosmo-dark');
  const [socials, setSocials] = useState<Record<string, string>>({});

  // PRO custom theme overrides (ThemeConfig structure)
  const [customBgType, setCustomBgType] = useState<'solid' | 'gradient'>('solid');
  const [customBgVal, setCustomBgVal] = useState('#0f0f18');
  const [customBtnStyle, setCustomBtnStyle] = useState<'solid' | 'outline' | 'glass'>('solid');
  const [customBtnRadius, setCustomBtnRadius] = useState<'none' | 'md' | 'full'>('md');
  const [customFont, setCustomFont] = useState<'outfit' | 'space-mono' | 'syne'>('outfit');

  const supabase = createClient();

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [
      { data: profileData },
      { data: themesData },
      { data: platformsData },
      { data: linksData },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('themes').select('*').order('is_pro', { ascending: true }),
      supabase.from('platforms').select('*').order('name'),
      supabase.from('links').select('*').eq('user_id', user.id).eq('is_active', true).order('position'),
    ]);

    if (profileData) {
      setProfile(profileData);
      setDisplayName(profileData.display_name || '');
      setBio(profileData.bio || '');
      setAvatarUrl(profileData.avatar_url || '');
      setThemeSlug(profileData.theme_slug);
      setSocials(profileData.social_links || {});

      // Custom theme parsing
      const ct = profileData.custom_theme;
      if (ct) {
        setCustomBgType(ct.background?.type === 'gradient' ? 'gradient' : 'solid');
        setCustomBgVal(ct.background?.value || '#0f0f18');
        setCustomBtnStyle(ct.buttons?.style || 'solid');
        setCustomBtnRadius(ct.buttons?.radius || 'md');
        setCustomFont(ct.typography?.font_family || 'outfit');
      }
    }

    setThemes(themesData || []);
    setPlatforms(platformsData || []);
    setLinks(linksData || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle avatar upload with 200x200 resize
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !profile) return;

    try {
      setUploading(true);
      const url = await uploadAvatar(supabase, profile.id, e.target.files[0]);
      setAvatarUrl(url);

      // Update in db
      await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', profile.id);
    } catch (err: any) {
      alert(`Errore nel caricamento dell'avatar: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  // Save profile info (displayName, bio, socials)
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio,
        social_links: socials,
      })
      .eq('id', profile.id);

    if (error) alert(error.message);
    else await loadData();
    setSaving(false);
  }

  // Quick preset select
  async function selectThemePreset(slug: string, isProTheme: boolean) {
    if (!profile) return;

    if (isProTheme && profile.plan === 'free') {
      alert('Questo tema Premium è riservato agli utenti PRO! Upgrade nelle impostazioni.');
      return;
    }

    setThemeSlug(slug);
    const { error } = await supabase
      .from('profiles')
      .update({ theme_slug: slug, custom_theme: null })
      .eq('id', profile.id);

    if (error) alert(error.message);
    else await loadData();
  }

  // Save custom theme configs for PRO
  async function handleSaveCustomTheme() {
    if (!profile) return;
    if (profile.plan === 'free') return;

    setSaving(true);
    const newCustomTheme = {
      background: {
        type: customBgType,
        value: customBgVal,
      },
      buttons: {
        style: customBtnStyle,
        radius: customBtnRadius,
        bg_color: customBtnStyle === 'outline' ? 'transparent' : customBgVal === '#ffffff' ? '#000000' : '#ffffff',
        text_color: customBgVal === '#ffffff' ? '#ffffff' : '#000000',
      },
      typography: {
        font_family: customFont,
        text_color: customBgVal === '#ffffff' ? '#111111' : '#ffffff',
        accent_color: 'hsl(263 90% 64%)',
      },
      avatar_ring: {
        enabled: true,
        color: 'hsl(263 90% 64%)',
      },
    };

    const { error } = await supabase
      .from('profiles')
      .update({ custom_theme: newCustomTheme })
      .eq('id', profile.id);

    if (error) alert(error.message);
    else await loadData();
    setSaving(false);
  }

  // Real-time Preview computation
  const activeThemeConfig = (() => {
    if (!profile) return null;
    if (profile.plan === 'pro' && profile.custom_theme) {
      return normalizeThemeConfig(profile.custom_theme);
    }
    const currentTheme = themes.find((t) => t.slug === themeSlug);
    return currentTheme ? normalizeThemeConfig(currentTheme.config) : null;
  })();

  const previewCSS = activeThemeConfig ? themeToCSS(activeThemeConfig) : {};
  const previewBg = activeThemeConfig
    ? activeThemeConfig.background.type === 'solid'
      ? { backgroundColor: activeThemeConfig.background.value }
      : { backgroundImage: activeThemeConfig.background.value }
    : { background: 'linear-gradient(135deg, hsl(263 90% 12%) 0%, hsl(240 25% 4%) 50%, hsl(190 90% 8%) 100%)' };

  if (loading) {
    return <Spinner size="lg" className="mt-20" />;
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Settings inputs - 7 cols */}
      <div className="lg:col-span-7 space-y-6">
        <h1 className="text-2xl font-bold text-[hsl(240_10%_98%)]">Personalizza il tuo Cosmo</h1>

        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
            <User size={18} className="text-[hsl(263_90%_75%)]" />
            <h2 className="text-lg font-semibold text-[hsl(240_10%_98%)]">Profilo</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Avatar upload */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-[hsl(263_90%_64%)]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[hsl(263_90%_64%)/0.2] flex items-center justify-center text-xl font-bold text-[hsl(263_90%_75%)]">
                    {profile?.username[0].toUpperCase()}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-[hsl(240_10%_98%)]">Foto Profilo</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] text-xs font-semibold text-[hsl(240_5%_80%)] hover:text-white cursor-pointer hover:bg-[hsl(240_20%_16%)] transition-colors">
                  <Upload size={14} />
                  Carica Foto (JPEG 200x200 automatico)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Input
              label="Nome Visualizzato"
              placeholder="Inserisci il tuo nome"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[hsl(240_5%_70%)]">Biografia</label>
              <textarea
                placeholder="Parlaci di te..."
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
                className="w-full rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-3 py-2 text-sm text-[hsl(240_10%_98%)] placeholder:text-[hsl(240_5%_48%)] focus:outline-none focus:ring-1 focus:ring-[hsl(263_90%_64%)] transition-all resize-none"
              />
            </div>

            <Button type="submit" isLoading={saving}>
              Salva Dati Profilo
            </Button>
          </form>
        </Card>

        {/* Preset Themes Grid */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
            <Palette size={18} className="text-[hsl(263_90%_75%)]" />
            <h2 className="text-lg font-semibold text-[hsl(240_10%_98%)]">Temi di Sfondo</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themes.map((theme) => {
              const isSelected = themeSlug === theme.slug && (!profile?.custom_theme);
              const isPro = theme.is_pro;
              const isLocked = isPro && profile?.plan === 'free';
              const normConfig = normalizeThemeConfig(theme.config);

              return (
                <button
                  key={theme.slug}
                  onClick={() => selectThemePreset(theme.slug, isPro)}
                  className={`
                    group relative flex flex-col p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-[hsl(263_90%_64%)] bg-[hsl(263_90%_64%)/0.05] ring-1 ring-[hsl(263_90%_64%)]'
                      : 'border-[hsl(240_15%_18%)] bg-[hsl(240_20%_10%)] hover:bg-[hsl(240_20%_14%)]'
                    }
                  `}
                >
                  {/* Theme Preview Background Dot */}
                  <div
                    className="w-full h-20 rounded-lg mb-2 relative overflow-hidden flex items-center justify-center font-bold text-xs"
                    style={{
                      backgroundColor: normConfig.background.type === 'solid' ? normConfig.background.value : undefined,
                      backgroundImage: normConfig.background.type === 'gradient' ? normConfig.background.value : undefined,
                      color: normConfig.typography.text_color,
                    }}
                  >
                    {theme.name}

                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-amber-400">
                        <Lock size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[hsl(240_10%_98%)]">
                      {theme.name}
                    </span>
                    {isPro && (
                      <Badge variant="pro" className="scale-75 origin-right">
                        PRO
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Custom Theme (PRO Only) */}
        <Card className={`p-6 ${profile?.plan === 'free' ? 'opacity-50 pointer-events-none relative' : ''}`}>
          {profile?.plan === 'free' && (
            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
                <Lock size={18} />
              </div>
              <p className="text-sm font-semibold text-[hsl(240_10%_98%)]">Tema Personalizzato Riservato PRO</p>
              <p className="text-xs text-[hsl(240_5%_70%)] mt-1 max-w-xs">
                Sblocca il controllo totale su gradienti, stili dei pulsanti, font e personalizzazione estrema con il piano PRO!
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400 animate-pulse" />
              <h2 className="text-lg font-semibold text-[hsl(240_10%_98%)]">Tema Custom PRO</h2>
            </div>
            <Badge variant="pro">PRO</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[hsl(240_5%_70%)] block mb-2">Tipo di Sfondo</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCustomBgType('solid')}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${customBgType === 'solid' ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]' : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'}`}
                >
                  Tinta Unita
                </button>
                <button
                  onClick={() => setCustomBgType('gradient')}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${customBgType === 'gradient' ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]' : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'}`}
                >
                  Gradiente
                </button>
              </div>
            </div>

            <Input
              label={customBgType === 'solid' ? 'Colore Sfondo' : 'Gradiente CSS (es. linear-gradient(to right, #ff7e5f, #feb47b))'}
              value={customBgVal}
              onChange={(e) => setCustomBgVal(e.target.value)}
              placeholder={customBgType === 'solid' ? '#0f0f18' : 'linear-gradient(135deg, #120c1f, #050508)'}
            />

            <div>
              <label className="text-xs font-medium text-[hsl(240_5%_70%)] block mb-2">Stile Pulsanti</label>
              <div className="grid grid-cols-3 gap-2">
                {(['solid', 'outline', 'glass'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setCustomBtnStyle(style)}
                    className={`py-2 text-xs font-medium rounded-xl border capitalize transition-all cursor-pointer ${customBtnStyle === style ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]' : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[hsl(240_5%_70%)] block mb-2">Arrotondamento</label>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'md', 'full'] as const).map((radius) => (
                  <button
                    key={radius}
                    onClick={() => setCustomBtnRadius(radius)}
                    className={`py-2 text-xs font-medium rounded-xl border capitalize transition-all cursor-pointer ${customBtnRadius === radius ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]' : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'}`}
                  >
                    {radius === 'none' ? 'Squadrato' : radius === 'md' ? 'Medio' : 'Arrotondato'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[hsl(240_5%_70%)] block mb-2">Tipografia</label>
              <div className="grid grid-cols-3 gap-2">
                {(['outfit', 'space-mono', 'syne'] as const).map((font) => (
                  <button
                    key={font}
                    onClick={() => setCustomFont(font)}
                    className={`py-2 text-xs font-medium rounded-xl border uppercase transition-all cursor-pointer ${customFont === font ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]' : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'}`}
                  >
                    {font.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleSaveCustomTheme} isLoading={saving}>
              Applica Modifiche Custom
            </Button>
          </div>
        </Card>

        {/* Social Links Row Editor */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
            <Share2 size={18} className="text-[hsl(263_90%_75%)]" />
            <h2 className="text-lg font-semibold text-[hsl(240_10%_98%)]">Social Link Integrati</h2>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-[hsl(240_5%_70%)]">
              Questi link appariranno come icone sotto la tua biografia per un accesso rapido.
            </p>
            {platforms.slice(0, 5).map((plat) => (
              <div key={plat.slug} className="flex items-center gap-3">
                <PlatformIcon slug={plat.slug} size={20} color={plat.brand_color} className="shrink-0" />
                <span className="text-xs font-medium text-[hsl(240_10%_98%)] w-24 shrink-0">{plat.name}</span>
                <input
                  type="url"
                  placeholder={`Username o link ${plat.name}`}
                  value={socials[plat.slug] || ''}
                  onChange={(e) => {
                    const newSocials = { ...socials };
                    if (e.target.value) {
                      newSocials[plat.slug] = e.target.value;
                    } else {
                      delete newSocials[plat.slug];
                    }
                    setSocials(newSocials);
                  }}
                  className="flex-1 rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-3 py-2 text-xs text-[hsl(240_10%_98%)] placeholder:text-[hsl(240_5%_48%)] focus:outline-none focus:ring-1 focus:ring-[hsl(263_90%_64%)] transition-all"
                />
              </div>
            ))}
            <Button onClick={handleSaveProfile} isLoading={saving}>
              Aggiorna Icone Social
            </Button>
          </div>
        </Card>
      </div>

      {/* Live iPhone preview sticky - 5 cols */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 hidden md:flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3 self-start pl-6 text-sm text-[hsl(240_5%_70%)]">
          <Eye size={16} />
          Anteprima in tempo reale
        </div>

        {/* Device frame mock */}
        <div className="relative w-[300px] h-[610px] rounded-[48px] border-[12px] border-[hsl(240_15%_18%)] bg-[hsl(240_25%_4%)] shadow-2xl flex flex-col overflow-hidden">
          {/* Speaker notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[hsl(240_15%_18%)] rounded-b-2xl z-20 flex items-center justify-center">
            <div className="w-12 h-1 bg-black rounded-full mb-1" />
          </div>

          {/* User page emulation screen */}
          <div
            className="flex-1 flex flex-col items-center px-4 pt-10 pb-6 overflow-y-auto select-none no-scrollbar"
            style={{
              ...previewBg,
              ...previewCSS,
              fontFamily: activeThemeConfig ? `var(--font-${activeThemeConfig.typography.font_family})` : undefined,
              color: activeThemeConfig?.typography.text_color || '#ffffff',
            }}
          >
            {/* Mascot background pulse */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-[hsl(263_90%_64%)] blur-[50px]" />
            </div>

            {/* Simulated Avatar */}
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover mb-3"
                style={{
                  boxShadow: activeThemeConfig?.avatar_ring.enabled
                    ? `0 0 0 2.5px ${activeThemeConfig.avatar_ring.color}`
                    : 'none',
                }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold mb-3"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  boxShadow: activeThemeConfig?.avatar_ring.enabled
                    ? `0 0 0 2.5px ${activeThemeConfig.avatar_ring.color}`
                    : 'none',
                }}
              >
                {profile?.username[0].toUpperCase()}
              </div>
            )}

            {/* Name & Bio */}
            <h3 className="font-bold text-center text-sm truncate max-w-full">
              {displayName || profile?.username}
            </h3>
            <p className="text-[10px] opacity-60 mt-0.5 mb-1">
              @{profile?.username}
            </p>
            {bio && (
              <p className="text-[10px] text-center opacity-70 max-w-[200px] mb-4 truncate">
                {bio}
              </p>
            )}

            {/* Social Icons row */}
            {Object.keys(socials).length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                {Object.entries(socials).map(([slug, url]) => (
                  <PlatformIcon key={slug} slug={slug} size={15} className="opacity-75" />
                ))}
              </div>
            )}

            {/* Links list */}
            <div className="w-full space-y-2">
              {links.map((link) => {
                let radius = '10px';
                if (activeThemeConfig?.buttons.radius === 'none') radius = '0px';
                if (activeThemeConfig?.buttons.radius === 'full') radius = '9999px';

                let btnStyleClass = 'bg-white/10 hover:bg-white/15 border border-white/10';
                if (activeThemeConfig?.buttons.style === 'outline') {
                  btnStyleClass = 'bg-transparent border border-white/30';
                } else if (activeThemeConfig?.buttons.style === 'glass') {
                  btnStyleClass = 'bg-white/[0.06] backdrop-blur-md border border-white/[0.08]';
                } else if (activeThemeConfig?.buttons.style === 'soft') {
                  btnStyleClass = 'bg-white/[0.12]';
                }

                return (
                  <div
                    key={link.id}
                    className={`w-full py-2.5 px-4 flex items-center justify-between text-xs font-semibold ${btnStyleClass}`}
                    style={{ borderRadius: radius }}
                  >
                    <PlatformIcon slug={link.icon || ''} size={14} className="shrink-0" fallbackUrl={link.url} title={link.title} />
                    <span className="truncate flex-1 text-center px-2">{link.title}</span>
                    <span className="opacity-0 w-3.5"></span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* iPhone bottom pill */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[hsl(240_10%_98%)] rounded-full z-20" />
        </div>
      </div>
    </div>
  );
}
