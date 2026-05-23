'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Palette,
  Sparkles,
} from 'lucide-react';
import type { Profile } from '@/types';

export default function QrCodePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fgColor, setFgColor] = useState('#8884d8');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showMascot, setShowMascot] = useState(true);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const loadProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(profileData);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const profileUrl = profile ? `${window.location.origin}/${profile.username}` : '';

  function handleCopy() {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQrCode() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `cosmolink-qr-${profile?.username || 'user'}.png`;
    link.href = url;
    link.click();
  }

  if (loading) {
    return <Spinner size="lg" className="mt-20" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(240_10%_98%)]">Il tuo QR Code Cosmo</h1>
        <p className="text-sm text-[hsl(240_5%_70%)] mt-1">
          Condividi il tuo universo di link offline o sui social
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Settings - 6 cols */}
        <Card className="md:col-span-6 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-[hsl(240_15%_18%)] pb-3">
            <Palette size={18} className="text-[hsl(263_90%_75%)]" />
            <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">Personalizzazione</h2>
          </div>

          <div className="space-y-4">
            {/* Color controls */}
            <div>
              <label className="text-xs font-medium text-[hsl(240_5%_70%)] block mb-2">Colore Codice (QR)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-10 rounded-xl bg-transparent border border-[hsl(240_15%_18%)] cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-3 text-sm text-[hsl(240_10%_98%)]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[hsl(240_5%_70%)] block mb-2">Colore Sfondo (QR)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded-xl bg-transparent border border-[hsl(240_15%_18%)] cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-3 text-sm text-[hsl(240_10%_98%)]"
                />
              </div>
            </div>

            {/* Mascot toggle */}
            <div className="flex items-center justify-between py-2 border-b border-[hsl(240_15%_18%)]">
              <div>
                <p className="text-xs font-medium text-[hsl(240_10%_98%)]">Mostra logo CosmoNet al centro</p>
                <p className="text-[10px] text-[hsl(240_5%_70%)]">Aggiunge il logo CosmoNet al centro del codice</p>
              </div>
              <button
                onClick={() => setShowMascot(!showMascot)}
                className={`
                  relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                  ${showMascot ? 'bg-[hsl(263_90%_64%)]' : 'bg-[hsl(240_15%_18%)]'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${showMascot ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="text-[10px] font-medium uppercase tracking-widest text-[hsl(240_5%_48%)] block mb-2">
                Preset Cosmici Rapidi
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setFgColor('#6c5ce7'); setBgColor('#ffffff'); }}
                  className="px-3 py-2 text-[10px] font-semibold border border-[hsl(240_15%_18%)] bg-[hsl(240_20%_12%)] hover:bg-[hsl(240_20%_16%)] text-white rounded-xl transition-colors cursor-pointer"
                >
                  Deep Purple
                </button>
                <button
                  onClick={() => { setFgColor('#0ea5e9'); setBgColor('#ffffff'); }}
                  className="px-3 py-2 text-[10px] font-semibold border border-[hsl(240_15%_18%)] bg-[hsl(240_20%_12%)] hover:bg-[hsl(240_20%_16%)] text-white rounded-xl transition-colors cursor-pointer"
                >
                  Arctic Cyan
                </button>
                <button
                  onClick={() => { setFgColor('#10b981'); setBgColor('#000000'); }}
                  className="px-3 py-2 text-[10px] font-semibold border border-[hsl(240_15%_18%)] bg-[hsl(240_20%_12%)] hover:bg-[hsl(240_20%_16%)] text-white rounded-xl transition-colors cursor-pointer"
                >
                  Neon Green
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* QR Code view & Actions - 6 cols */}
        <Card className="md:col-span-6 p-6 flex flex-col items-center justify-center space-y-6">
          {/* Main SVG Preview for crisp look */}
          <div className="p-6 bg-white rounded-3xl shadow-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
            <QRCodeSVG
              value={profileUrl}
              size={200}
              bgColor={bgColor}
              fgColor={fgColor}
              level="H"
              imageSettings={
                showMascot
                  ? {
                      src: '/cosmonet-logo-qr.png',
                      x: undefined,
                      y: undefined,
                      height: 44,
                      width: 44,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>

          {/* Hidden Canvas QR Code used for high quality download */}
          <div ref={canvasRef} className="hidden">
            <QRCodeCanvas
              value={profileUrl}
              size={1024}
              bgColor={bgColor}
              fgColor={fgColor}
              level="H"
              imageSettings={
                showMascot
                  ? {
                      src: '/cosmonet-logo-qr.png',
                      x: undefined,
                      y: undefined,
                      height: 220,
                      width: 220,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>

          {/* Actions */}
          <div className="w-full space-y-3">
            <div className="rounded-xl border border-[hsl(240_15%_18%)] bg-[hsl(240_20%_12%)] p-3 text-center">
              <p className="text-[10px] font-medium text-[hsl(240_5%_70%)]">Il tuo link pubblico:</p>
              <p className="text-sm font-semibold text-white mt-0.5 truncate">{profileUrl}</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={downloadQrCode} className="flex-1">
                <Download size={16} />
                Scarica PNG
              </Button>

              <Button variant="ghost" onClick={handleCopy} className="flex-1">
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                {copied ? 'Copiato!' : 'Copia Link'}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[hsl(240_5%_48%)]">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            Risoluzione di download ultra elevata (1024x1024 px)
          </div>
        </Card>
      </div>
    </div>
  );
}
