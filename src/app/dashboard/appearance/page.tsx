'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  User,
  Share2,
  Lock,
  Sparkles,
  Eye,
  Sliders,
  Sparkle,
  Trash2,
} from 'lucide-react';
import type { Profile, Theme, Platform, Link, ThemeConfig } from '@/types';

const gradientPresets = [
  { name: 'Cosmo', value: 'linear-gradient(135deg, #6c5ce7 0%, #00cec9 100%)', colorA: '#6c5ce7', colorB: '#00cec9', angle: 135 },
  { name: 'Deep Space', value: 'linear-gradient(135deg, #0f0f18 0%, #2d1b69 100%)', colorA: '#0f0f18', colorB: '#2d1b69', angle: 135 },
  { name: 'Midnight', value: 'linear-gradient(135deg, #000000 0%, #434343 100%)', colorA: '#000000', colorB: '#434343', angle: 135 },
  { name: 'Forest', value: 'linear-gradient(180deg, #0d2818 0%, #4ade80 100%)', colorA: '#0d2818', colorB: '#4ade80', angle: 180 },
  { name: 'Sunset', value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', colorA: '#ff6b6b', colorB: '#feca57', angle: 135 },
  { name: 'Rose Dark', value: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)', colorA: '#1a1a2e', colorB: '#e94560', angle: 135 },
  { name: 'Cloud', value: 'linear-gradient(135deg, #f8f9fa 0%, #dee2e6 100%)', colorA: '#f8f9fa', colorB: '#dee2e6', angle: 135 },
  { name: 'Golden', value: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)', colorA: '#ffeaa7', colorB: '#fdcb6e', angle: 135 },
  { name: 'Ocean', value: 'linear-gradient(180deg, #030d20 0%, #06b6d4 100%)', colorA: '#030d20', colorB: '#06b6d4', angle: 180 },
  { name: 'Nebula', value: 'linear-gradient(135deg, #2d1b69 0%, #ff6eb4 100%)', colorA: '#2d1b69', colorB: '#ff6eb4', angle: 135 },
  { name: 'Navy', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', colorA: '#1e3c72', colorB: '#2a5298', angle: 135 },
  { name: 'Emerald', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', colorA: '#134e5e', colorB: '#71b280', angle: 135 },
];

function parseGradient(gradientStr: string) {
  const clean = gradientStr.replace('linear-gradient(', '').replace(')', '').trim();
  const parts = clean.split(',').map((s) => s.trim());
  let angle = 135;
  let colorA = '#6c5ce7';
  let colorB = '#00cec9';

  if (parts.length >= 3) {
    const anglePart = parts[0].match(/(\d+)/);
    if (anglePart) angle = parseInt(anglePart[1], 10);
    colorA = parts[1].split(' ')[0];
    colorB = parts[2].split(' ')[0];
  } else if (parts.length === 2) {
    colorA = parts[0].split(' ')[0];
    colorB = parts[1].split(' ')[0];
  }

  return { angle, colorA, colorB };
}

export default function AppearancePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [themeSlug, setThemeSlug] = useState('cosmo');
  const [socials, setSocials] = useState<Record<string, string>>({});

  // Level 1: Background state
  const [bgType, setBgType] = useState<'solid' | 'gradient' | 'image'>('solid');
  const [bgColor, setBgColor] = useState('#0f0f18');
  const [bgGradA, setBgGradA] = useState('#6c5ce7');
  const [bgGradB, setBgGradB] = useState('#00cec9');
  const [bgGradAngle, setBgGradAngle] = useState(135);
  const [bgImage, setBgImage] = useState('');
  const [bgGradientMode, setBgGradientMode] = useState<'preset' | 'custom'>('preset');

  // Level 2: Buttons state
  const [btnShape, setBtnShape] = useState<'none' | 'sm' | 'md' | 'full'>('md');
  const [btnStyle, setBtnStyle] = useState<'solid' | 'outline' | 'glass' | 'shadow' | 'gradient'>('solid');
  const [btnBgColor, setBtnBgColor] = useState('#6c5ce7');
  const [btnTextColor, setBtnTextColor] = useState('#ffffff');

  // Level 3: Advanced details (PRO only)
  const [customFont, setCustomFont] = useState<'outfit' | 'dm-sans' | 'syne' | 'playfair' | 'space-mono' | 'nunito'>('outfit');
  const [usrNameColor, setUsrNameColor] = useState('#ffffff');
  const [usrBioColor, setUsrBioColor] = useState('rgba(255,255,255,0.6)');
  const [avatarRingColor, setAvatarRingColor] = useState('#6c5ce7');
  const [avatarRingThickness, setAvatarRingThickness] = useState<'0px' | '2px' | '3px' | '4px'>('0px');
  const [socialsStyle, setSocialsStyle] = useState<'brand' | 'white' | 'black'>('brand');
  const [addedSlugs, setAddedSlugs] = useState<string[]>([]);

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

      // Parse theme configs
      const activeConfig = profileData.custom_theme
        ? normalizeThemeConfig(profileData.custom_theme)
        : themesData
          ? normalizeThemeConfig(themesData.find((t: any) => t.slug === profileData.theme_slug)?.config)
          : null;

      if (activeConfig) {
        setBgType(activeConfig.background.type);
        if (activeConfig.background.type === 'solid') {
          setBgColor(activeConfig.background.value);
        } else if (activeConfig.background.type === 'gradient') {
          const parsed = parseGradient(activeConfig.background.value);
          setBgGradAngle(parsed.angle);
          setBgGradA(parsed.colorA);
          setBgGradB(parsed.colorB);
        } else if (activeConfig.background.type === 'image') {
          setBgImage(activeConfig.background.value);
        }

        setBtnShape(activeConfig.buttons.radius);
        setBtnStyle(activeConfig.buttons.style);
        setBtnBgColor(activeConfig.buttons.bg_color || '#6c5ce7');
        setBtnTextColor(activeConfig.buttons.text_color || '#ffffff');

        setCustomFont(activeConfig.typography.font_family);
        setUsrNameColor(activeConfig.typography.text_color);
        setUsrBioColor(activeConfig.typography.bio_color || 'rgba(255,255,255,0.6)');
        setAvatarRingColor(activeConfig.avatar_ring.color);
        setAvatarRingThickness(activeConfig.avatar_ring.thickness || (activeConfig.avatar_ring.enabled ? '2px' : '0px'));
        setSocialsStyle(activeConfig.socials_style || 'brand');
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

  // Filtra le piattaforme visibili (popolari di default o già valorizzate o aggiunte dall'utente)
  const visiblePlatforms = useMemo(() => {
    const defaultPopularSlugs = ['instagram', 'tiktok', 'youtube', 'spotify', 'amazonmusic', 'applemusic', 'facebook', 'twitter', 'linkedin'];
    return platforms.filter((plat) => {
      const isDefault = defaultPopularSlugs.includes(plat.slug);
      const hasValue = !!socials[plat.slug];
      const wasAdded = addedSlugs.includes(plat.slug);
      return isDefault || hasValue || wasAdded;
    });
  }, [platforms, socials, addedSlugs]);

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

  // Handle background image upload (PRO only)
  async function handleBgImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !profile) return;
    if (profile.plan === 'free') return;

    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert('Il file è troppo grande! Dimensione massima consentita: 2MB.');
      return;
    }

    try {
      setBgUploading(true);
      const filePath = `${profile.id}/background_${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setBgImage(data.publicUrl);
      setBgType('image');
    } catch (err: any) {
      alert(`Errore nel caricamento dello sfondo: ${err.message}`);
    } finally {
      setBgUploading(false);
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
  async function selectThemePreset(theme: Theme) {
    if (!profile) return;

    if (theme.is_pro && profile.plan === 'free') {
      alert('Questo tema Premium è riservato agli utenti PRO! Upgrade nelle impostazioni.');
      return;
    }

    setThemeSlug(theme.slug);
    const activeConfig = normalizeThemeConfig(theme.config);

    // Load presets configuration in local state
    setBgType(activeConfig.background.type);
    if (activeConfig.background.type === 'solid') {
      setBgColor(activeConfig.background.value);
    } else if (activeConfig.background.type === 'gradient') {
      const parsed = parseGradient(activeConfig.background.value);
      setBgGradAngle(parsed.angle);
      setBgGradA(parsed.colorA);
      setBgGradB(parsed.colorB);
    } else if (activeConfig.background.type === 'image') {
      setBgImage(activeConfig.background.value);
    }

    setBtnShape(activeConfig.buttons.radius);
    setBtnStyle(activeConfig.buttons.style);
    setBtnBgColor(activeConfig.buttons.bg_color || '#6c5ce7');
    setBtnTextColor(activeConfig.buttons.text_color || '#ffffff');

    setCustomFont(activeConfig.typography.font_family);
    setUsrNameColor(activeConfig.typography.text_color);
    setUsrBioColor(activeConfig.typography.bio_color || 'rgba(255,255,255,0.6)');
    setAvatarRingColor(activeConfig.avatar_ring.color);
    setAvatarRingThickness(activeConfig.avatar_ring.thickness || (activeConfig.avatar_ring.enabled ? '2px' : '0px'));
    setSocialsStyle(activeConfig.socials_style || 'brand');

    setSaving(true);
    // Reset custom_theme in the database since the user selected a preset
    const { error } = await supabase
      .from('profiles')
      .update({ theme_slug: theme.slug, custom_theme: null })
      .eq('id', profile.id);

    if (error) alert(error.message);
    else await loadData();
    setSaving(false);
  }

  // Save custom theme configs
  async function handleSaveCustomTheme() {
    if (!profile) return;

    setSaving(true);

    let newCustomTheme: ThemeConfig;

    if (profile.plan === 'pro') {
      newCustomTheme = {
        background: {
          type: bgType,
          value: bgType === 'solid'
            ? bgColor
            : bgType === 'image'
              ? bgImage
              : `linear-gradient(${bgGradAngle}deg, ${bgGradA} 0%, ${bgGradB} 100%)`,
        },
        buttons: {
          style: btnStyle,
          radius: btnShape,
          bg_color: btnBgColor,
          text_color: btnTextColor,
          border_color: btnStyle === 'outline' ? btnBgColor : undefined,
          shadow: btnStyle === 'shadow' ? 'md' : 'none',
        },
        typography: {
          font_family: customFont,
          text_color: usrNameColor,
          bio_color: usrBioColor,
          accent_color: btnBgColor,
        },
        avatar_ring: {
          enabled: avatarRingThickness !== '0px',
          color: avatarRingColor,
          thickness: avatarRingThickness,
        },
        socials_style: socialsStyle,
      };
    } else {
      // Free Tier limits
      const isLightBg = bgColor === '#ffffff' || bgGradA === '#ffffff' || bgGradA.includes('fff');
      newCustomTheme = {
        background: {
          type: bgType === 'image' ? 'solid' : bgType,
          value: bgType === 'solid'
            ? bgColor
            : `linear-gradient(${bgGradAngle}deg, ${bgGradA} 0%, ${bgGradB} 100%)`,
        },
        buttons: {
          style: btnStyle,
          radius: btnShape,
          bg_color: btnBgColor,
          text_color: btnTextColor,
          border_color: btnStyle === 'outline' ? btnBgColor : undefined,
          shadow: btnStyle === 'shadow' ? 'md' : 'none',
        },
        typography: {
          font_family: 'outfit',
          text_color: isLightBg ? '#0f172a' : '#ffffff',
          bio_color: isLightBg ? '#475569' : 'rgba(255,255,255,0.6)',
          accent_color: btnBgColor,
        },
        avatar_ring: {
          enabled: false,
          color: '#6c5ce7',
          thickness: '0px',
        },
        socials_style: 'brand',
      };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ custom_theme: newCustomTheme })
      .eq('id', profile.id);

    if (error) alert(error.message);
    else await loadData();
    setSaving(false);
  }

  // Live preview styles based on current component states
  const previewBgStyle = useMemo(() => {
    if (bgType === 'solid') {
      return { background: bgColor };
    } else if (bgType === 'gradient') {
      return { background: `linear-gradient(${bgGradAngle}deg, ${bgGradA} 0%, ${bgGradB} 100%)` };
    } else if (bgType === 'image') {
      return {
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { background: '#0f0f18' };
  }, [bgType, bgColor, bgGradA, bgGradB, bgGradAngle, bgImage]);

  const previewFontClass = useMemo(() => {
    const fonts: Record<string, string> = {
      outfit: 'font-sans',
      'dm-sans': 'font-sans',
      syne: 'font-sans',
      playfair: 'font-serif',
      'space-mono': 'font-mono',
      nunito: 'font-sans',
    };
    return fonts[customFont] || 'font-sans';
  }, [customFont]);

  function getPreviewButtonStyle(): React.CSSProperties {
    const style: React.CSSProperties = {
      borderRadius: btnShape === 'none' ? '0px' : btnShape === 'sm' ? '4px' : btnShape === 'md' ? '14px' : '50px',
    };

    if (btnStyle === 'solid') {
      style.background = btnBgColor;
      style.color = btnTextColor;
      style.border = '1px solid transparent';
    } else if (btnStyle === 'outline') {
      style.background = 'transparent';
      style.color = btnTextColor;
      style.border = `2px solid ${btnBgColor}`;
    } else if (btnStyle === 'glass') {
      style.background = 'rgba(255, 255, 255, 0.06)';
      style.backdropFilter = 'blur(12px)';
      style.WebkitBackdropFilter = 'blur(12px)';
      style.border = '1px solid rgba(255, 255, 255, 0.08)';
      style.color = btnTextColor;
    } else if (btnStyle === 'shadow') {
      style.background = btnBgColor;
      style.color = btnTextColor;
      style.border = '2px solid #000000';
      style.boxShadow = '3px 3px 0px 0px #000000';
    } else if (btnStyle === 'gradient') {
      style.background = btnBgColor.includes('gradient') ? btnBgColor : `linear-gradient(135deg, ${btnBgColor}, ${btnBgColor}cc)`;
      style.color = btnTextColor;
      style.border = 'none';
    }

    return style;
  }

  if (loading) {
    return <Spinner size="lg" className="mt-20" />;
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-16">
      {/* Settings inputs - 7 cols */}
      <div className="lg:col-span-7 space-y-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(240_10%_98%)]">Personalizza il tuo Cosmo</h1>
          <p className="text-sm text-[hsl(240_5%_70%)]">Definisci l'estetica del tuo universo di link.</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5 border-b border-[hsl(240_15%_18%)] pb-3">
            <User size={18} className="text-[hsl(263_90%_75%)]" />
            <h2 className="text-lg font-semibold text-[hsl(240_10%_98%)]">Profilo</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Avatar upload */}
            <div className="flex items-center gap-6 mb-4">
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

        {/* Preset Themes Grid (16 Swatches) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5 border-b border-[hsl(240_15%_18%)] pb-3">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-[hsl(263_90%_75%)]" />
              <h2 className="text-lg font-semibold text-[hsl(240_10%_98%)]">Temi Preset (16 Temi)</h2>
            </div>
            <p className="text-xs text-[hsl(240_5%_55%)]">Seleziona un punto di partenza</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themes.map((theme) => {
              const isSelected = themeSlug === theme.slug && !profile?.custom_theme;
              const isLocked = theme.is_pro && profile?.plan === 'free';
              const normConfig = normalizeThemeConfig(theme.config);

              let swatchBg = '';
              if (normConfig.background.type === 'solid') {
                swatchBg = normConfig.background.value;
              } else if (normConfig.background.type === 'gradient') {
                swatchBg = normConfig.background.value;
              } else if (normConfig.background.type === 'image') {
                swatchBg = '#1a1025'; // Fallback mockup
              }

              return (
                <button
                  key={theme.slug}
                  type="button"
                  onClick={() => selectThemePreset(theme)}
                  className={`
                    group relative flex flex-col p-2 rounded-xl border text-left cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-[hsl(263_90%_64%)] bg-[hsl(263_90%_64%)/0.08] ring-1 ring-[hsl(263_90%_64%)] scale-[1.02]'
                      : 'border-[hsl(240_15%_18%)] bg-[hsl(240_20%_8%)] hover:bg-[hsl(240_20%_12%)]'
                    }
                  `}
                >
                  <div
                    className="w-full h-16 rounded-lg mb-2 relative overflow-hidden flex items-center justify-center font-bold text-[10px] text-center px-1"
                    style={{
                      background: swatchBg,
                      color: normConfig.typography.text_color,
                    }}
                  >
                    {!isLocked && <span className="drop-shadow-sm">{theme.name}</span>}

                    {isLocked && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-amber-400 gap-0.5">
                        <Lock size={12} />
                        <span className="text-[9px] font-semibold text-white/90">PRO</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-medium text-[hsl(240_10%_90%)] truncate max-w-[70%]">
                      {theme.name}
                    </span>
                    {theme.is_pro && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                        PRO
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Customization levels */}
        <div className="space-y-6">
          {/* Level 1: Background */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[hsl(263_90%_75%)]" />
                <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">Livello 1: Sfondo</h2>
              </div>
            </div>

            <div className="space-y-5">
              {/* Type Switch */}
              <div>
                <label className="text-xs font-semibold text-[hsl(240_5%_70%)] block mb-2 uppercase tracking-wider">Tipo Sfondo</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['solid', 'gradient'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setBgType(type);
                        if (type === 'gradient') setBgGradientMode('preset');
                      }}
                      className={`py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                        bgType === type
                          ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]'
                          : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'
                      }`}
                    >
                      {type === 'solid' ? 'Tinta Unita' : 'Gradiente'}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      if (profile?.plan === 'pro') {
                        setBgType('image');
                      } else {
                        alert('Il caricamento dell\'immagine di sfondo è riservato agli utenti PRO!');
                      }
                    }}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      bgType === 'image'
                        ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]'
                        : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'
                    }`}
                  >
                    Immagine
                    {profile?.plan === 'free' && <Lock size={10} className="text-amber-400" />}
                  </button>
                </div>
              </div>

              {/* Solid Background settings */}
              {bgType === 'solid' && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[hsl(240_15%_18%)] relative shrink-0">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-[hsl(240_5%_70%)] block mb-1">Seleziona Colore Sfondo</label>
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-32 text-xs rounded-lg bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-2 py-1 text-[hsl(240_10%_98%)] uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Gradient Settings */}
              {bgType === 'gradient' && (
                <div className="space-y-4">
                  {/* Mode Tabs */}
                  <div className="flex gap-2 border-b border-[hsl(240_15%_18%)] pb-2">
                    <button
                      type="button"
                      onClick={() => setBgGradientMode('preset')}
                      className={`text-xs font-semibold pb-1 border-b-2 transition-all ${
                        bgGradientMode === 'preset'
                          ? 'border-[hsl(263_90%_64%)] text-white'
                          : 'border-transparent text-[hsl(240_5%_55%)]'
                      }`}
                    >
                      Presets (12 stili)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgGradientMode('custom')}
                      className={`text-xs font-semibold pb-1 border-b-2 transition-all ${
                        bgGradientMode === 'custom'
                          ? 'border-[hsl(263_90%_64%)] text-white'
                          : 'border-transparent text-[hsl(240_5%_55%)]'
                      }`}
                    >
                      Personalizzato A/B
                    </button>
                  </div>

                  {/* 12 Swatches presets */}
                  {bgGradientMode === 'preset' && (
                    <div className="grid grid-cols-4 gap-2">
                      {gradientPresets.map((gp, i) => {
                        const isPresetSelected =
                          bgGradA.toLowerCase() === gp.colorA.toLowerCase() &&
                          bgGradB.toLowerCase() === gp.colorB.toLowerCase() &&
                          bgGradAngle === gp.angle;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setBgGradA(gp.colorA);
                              setBgGradB(gp.colorB);
                              setBgGradAngle(gp.angle);
                            }}
                            className={`h-10 rounded-lg relative overflow-hidden transition-all border ${
                              isPresetSelected
                                ? 'border-white scale-[1.05] ring-1 ring-[hsl(263_90%_64%)]'
                                : 'border-[hsl(240_15%_18%)]'
                            }`}
                            style={{ background: gp.value }}
                            title={gp.name}
                          >
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white bg-black/20 text-center select-none truncate">
                              {gp.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Custom Gradient picker */}
                  {bgGradientMode === 'custom' && (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[hsl(240_15%_18%)] relative">
                            <input
                              type="color"
                              value={bgGradA}
                              onChange={(e) => setBgGradA(e.target.value)}
                              className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                            />
                          </div>
                          <span className="text-[11px] font-mono text-[hsl(240_5%_70%)] uppercase">{bgGradA}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[hsl(240_15%_18%)] relative">
                            <input
                              type="color"
                              value={bgGradB}
                              onChange={(e) => setBgGradB(e.target.value)}
                              className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                            />
                          </div>
                          <span className="text-[11px] font-mono text-[hsl(240_5%_70%)] uppercase">{bgGradB}</span>
                        </div>
                      </div>

                      {/* Angle Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-[hsl(240_5%_70%)]">
                          <span>Angolo Gradiente</span>
                          <span className="text-[hsl(263_90%_75%)] font-mono">{bgGradAngle}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={bgGradAngle}
                          onChange={(e) => setBgGradAngle(parseInt(e.target.value, 10))}
                          className="w-full h-1.5 rounded-lg appearance-none bg-[hsl(240_20%_16%)] accent-[hsl(263_90%_64%)] cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Background Image (PRO only) */}
              {bgType === 'image' && (
                <div className="space-y-4">
                  {bgImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bgImage}
                      alt="Sfondo caricato"
                      className="w-32 h-20 rounded-xl object-cover border border-[hsl(240_15%_18%)]"
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] text-xs font-semibold text-[hsl(240_5%_80%)] hover:text-white cursor-pointer hover:bg-[hsl(240_20%_16%)] transition-colors">
                      <Upload size={13} />
                      {bgUploading ? 'Caricamento...' : 'Carica Sfondo (PNG/JPG Max 2MB)'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBgImageChange}
                        disabled={bgUploading}
                        className="hidden"
                      />
                    </label>
                    {bgImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setBgImage('');
                          setBgType('solid');
                        }}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Rimuovi sfondo immagine"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Level 2: Buttons */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-[hsl(263_90%_75%)]" />
                <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">Livello 2: Bottoni</h2>
              </div>
            </div>

            <div className="space-y-5">
              {/* Shapes */}
              <div>
                <label className="text-xs font-semibold text-[hsl(240_5%_70%)] block mb-2 uppercase tracking-wider">Forma Bottone</label>
                <div className="grid grid-cols-4 gap-2">
                  {([
                    { key: 'full', label: 'Pill', desc: '50px' },
                    { key: 'md', label: 'Rounded', desc: '14px' },
                    { key: 'sm', label: 'Square', desc: '4px' },
                    { key: 'none', label: 'Sharp', desc: '0px' },
                  ] as const).map((shape) => (
                    <button
                      key={shape.key}
                      type="button"
                      onClick={() => setBtnShape(shape.key)}
                      className={`p-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                        btnShape === shape.key
                          ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)] scale-[1.02]'
                          : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'
                      }`}
                    >
                      <div className="truncate">{shape.label}</div>
                      <div className="text-[9px] opacity-60 font-mono mt-0.5">{shape.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Styles */}
              <div>
                <label className="text-xs font-semibold text-[hsl(240_5%_70%)] block mb-2 uppercase tracking-wider">Stile Riempimento</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {([
                    { key: 'solid', label: 'Pieno' },
                    { key: 'outline', label: 'Outline' },
                    { key: 'glass', label: 'Glass' },
                    { key: 'shadow', label: 'Shadow' },
                    { key: 'gradient', label: 'Gradient' },
                  ] as const).map((style) => (
                    <button
                      key={style.key}
                      type="button"
                      onClick={() => setBtnStyle(style.key)}
                      className={`py-2 px-1 text-[11px] font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        btnStyle === style.key
                          ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]'
                          : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button colors */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[hsl(240_15%_18%)] relative">
                    <input
                      type="color"
                      value={btnBgColor}
                      onChange={(e) => setBtnBgColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[hsl(240_5%_55%)] font-semibold uppercase">Colore Bottone</span>
                    <span className="text-xs font-mono text-[hsl(240_5%_70%)] uppercase">{btnBgColor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[hsl(240_15%_18%)] relative">
                    <input
                      type="color"
                      value={btnTextColor}
                      onChange={(e) => setBtnTextColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[hsl(240_5%_55%)] font-semibold uppercase">Colore Testo</span>
                    <span className="text-xs font-mono text-[hsl(240_5%_70%)] uppercase">{btnTextColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Level 3: Advanced details (PRO only) */}
          <Card className="p-6 relative overflow-hidden">
            {profile?.plan === 'free' && (
              <div className="absolute inset-0 z-10 bg-black/65 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 border border-amber-500/20">
                  <Lock size={18} />
                </div>
                <p className="text-sm font-semibold text-[hsl(240_10%_98%)]">Dettagli Avanzati (Solo PRO)</p>
                <p className="text-xs text-[hsl(240_5%_70%)] mt-1 max-w-xs">
                  Sblocca il controllo totale su font, colori di bio e username, ring dell'avatar, stili delle icone social e sfondi immagine.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
              <div className="flex items-center gap-2">
                <Sparkle size={18} className="text-amber-400" />
                <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">Livello 3: Dettagli Avanzati</h2>
              </div>
              <Badge variant="pro">PRO</Badge>
            </div>

            <div className="space-y-5">
              {/* Font Family */}
              <div>
                <label className="text-xs font-semibold text-[hsl(240_5%_70%)] block mb-1.5 uppercase tracking-wider">Tipografia / Font</label>
                <select
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value as any)}
                  className="w-full rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-3 py-2 text-sm text-[hsl(240_10%_98%)] focus:outline-none focus:ring-1 focus:ring-[hsl(263_90%_64%)]"
                >
                  <option value="outfit">Outfit (Sans-Serif)</option>
                  <option value="dm-sans">DM Sans (Sans-Serif)</option>
                  <option value="syne">Syne (Geometric/Modern)</option>
                  <option value="playfair">Playfair Display (Serif)</option>
                  <option value="space-mono">Space Mono (Monospace)</option>
                  <option value="nunito">Nunito (Rounded/Soft)</option>
                </select>
              </div>

              {/* Typography Colors */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[hsl(240_15%_18%)] relative">
                    <input
                      type="color"
                      value={usrNameColor}
                      onChange={(e) => setUsrNameColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[hsl(240_5%_55%)] font-semibold uppercase">Nome Utente</span>
                    <span className="text-xs font-mono text-[hsl(240_5%_70%)] uppercase">{usrNameColor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[hsl(240_15%_18%)] relative">
                    <input
                      type="color"
                      value={usrBioColor}
                      onChange={(e) => setUsrBioColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[hsl(240_5%_55%)] font-semibold uppercase">Biografia</span>
                    <span className="text-xs font-mono text-[hsl(240_5%_70%)] uppercase">{usrBioColor}</span>
                  </div>
                </div>
              </div>

              {/* Avatar Ring */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-[hsl(240_5%_70%)] block uppercase tracking-wider">Bordo Avatar (Ring)</label>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[hsl(240_15%_18%)] relative shrink-0">
                    <input
                      type="color"
                      value={avatarRingColor}
                      onChange={(e) => setAvatarRingColor(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    {(['0px', '2px', '3px', '4px'] as const).map((thick) => (
                      <button
                        key={thick}
                        type="button"
                        onClick={() => setAvatarRingThickness(thick)}
                        className={`py-1 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                          avatarRingThickness === thick
                            ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]'
                            : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'
                        }`}
                      >
                        {thick === '0px' ? 'Nessuno' : thick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Icons row layout style */}
              <div>
                <label className="text-xs font-semibold text-[hsl(240_5%_70%)] block mb-2 uppercase tracking-wider">Stile Icone Social</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: 'brand', label: 'Brand Colore' },
                    { key: 'white', label: 'Bianco' },
                    { key: 'black', label: 'Nero' },
                  ] as const).map((style) => (
                    <button
                      key={style.key}
                      type="button"
                      onClick={() => setSocialsStyle(style.key)}
                      className={`py-2 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                        socialsStyle === style.key
                          ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]'
                          : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Action Save Button */}
          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleSaveCustomTheme}
              isLoading={saving}
              className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-[hsl(263_90%_64%)] to-[hsl(190_95%_45%)] text-white hover:opacity-95 shadow-lg shadow-[hsl(263_90%_64%)]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Salva Modifiche Aspetto
            </Button>
          </div>
        </div>

        {/* Social Links Row Editor */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
            <Share2 size={18} className="text-[hsl(263_90%_75%)]" />
            <h2 className="text-lg font-semibold text-[hsl(240_10%_98%)]">Social Link Integrati</h2>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-[hsl(240_5%_70%)]">
              Inserisci i tuoi profili social. Appariranno come icone sotto la tua biografia per un accesso rapido.
            </p>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {visiblePlatforms.map((plat) => (
                <div key={plat.slug} className="flex items-center gap-3">
                  <PlatformIcon slug={plat.slug} size={20} color={plat.brand_color} className="shrink-0" />
                  <span className="text-xs font-medium text-[hsl(240_10%_98%)] w-24 shrink-0">{plat.name}</span>
                  <input
                    type="url"
                    placeholder={plat.slug === 'amazonmusic' || plat.slug === 'spotify' || plat.slug === 'applemusic' || plat.slug === 'youtube'
                      ? `Link al profilo o playlist ${plat.name}`
                      : `Username o link ${plat.name}`
                    }
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
            </div>

            {/* Dropdown to add other platforms */}
            <div className="flex items-center gap-3 pt-3 border-t border-[hsl(240_15%_18%)]">
              <span className="text-xs font-medium text-[hsl(240_5%_70%)] shrink-0">Mostra altre piattaforme:</span>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && !addedSlugs.includes(val)) {
                    setAddedSlugs([...addedSlugs, val]);
                  }
                  e.target.value = ''; // Reset select
                }}
                className="flex-1 rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-3 py-2 text-xs text-[hsl(240_10%_98%)] focus:outline-none focus:ring-1 focus:ring-[hsl(263_90%_64%)]"
              >
                <option value="">-- Seleziona e aggiungi --</option>
                {platforms
                  .filter((plat) => !visiblePlatforms.some((vp) => vp.slug === plat.slug) && plat.slug !== 'link')
                  .map((plat) => (
                    <option key={plat.slug} value={plat.slug}>
                      {plat.name} ({plat.category})
                    </option>
                  ))}
              </select>
            </div>

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
            className={`flex-1 flex flex-col items-center px-4 pt-10 pb-6 overflow-y-auto select-none no-scrollbar ${previewFontClass}`}
            style={{
              ...previewBgStyle,
              color: usrNameColor,
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
                  boxShadow: avatarRingThickness !== '0px'
                    ? `0 0 0 ${avatarRingThickness} ${avatarRingColor}`
                    : 'none',
                }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold mb-3"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  boxShadow: avatarRingThickness !== '0px'
                    ? `0 0 0 ${avatarRingThickness} ${avatarRingColor}`
                    : 'none',
                }}
              >
                {profile?.username[0].toUpperCase()}
              </div>
            )}

            {/* Name & Bio */}
            <h3
              className="font-bold text-center text-sm truncate max-w-full"
              style={{ color: usrNameColor }}
            >
              {displayName || profile?.username}
            </h3>
            <p className="text-[10px] opacity-60 mt-0.5 mb-1" style={{ color: usrNameColor }}>
              @{profile?.username}
            </p>
            {bio && (
              <p
                className="text-[10px] text-center max-w-[200px] mb-4 line-clamp-3"
                style={{ color: usrBioColor }}
              >
                {bio}
              </p>
            )}

            {/* Social Icons row */}
            {Object.keys(socials).length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                {Object.entries(socials).map(([slug, url]) => {
                  const platObj = platforms.find((p) => p.slug === slug);
                  let iconColor = platObj?.brand_color || '#ffffff';

                  if (socialsStyle === 'white') {
                    iconColor = '#ffffff';
                  } else if (socialsStyle === 'black') {
                    iconColor = '#000000';
                  }

                  return (
                    <PlatformIcon
                      key={slug}
                      slug={slug}
                      size={14}
                      color={iconColor}
                      variant="clean"
                      className="opacity-90 transform scale-75 hover:scale-80 transition-transform"
                      fallbackUrl={url}
                    />
                  );
                })}
              </div>
            )}

            {/* Links list */}
            <div className="w-full space-y-2">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="w-full py-2.5 px-4 flex items-center justify-between text-xs font-semibold select-none transform hover:scale-[1.01] transition-transform"
                  style={getPreviewButtonStyle()}
                >
                  <PlatformIcon
                    slug={link.icon || ''}
                    color={link.icon_color || btnTextColor}
                    size={14}
                    variant="clean"
                    className="shrink-0"
                    fallbackUrl={link.url}
                    title={link.title}
                  />
                  <span className="truncate flex-1 text-center px-2">{link.title}</span>
                  <span className="opacity-0 w-3.5"></span>
                </div>
              ))}
            </div>
          </div>

          {/* iPhone bottom pill */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[hsl(240_10%_98%)] rounded-full z-20" />
        </div>
      </div>
    </div>
  );
}
