'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Check, ArrowLeft, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [username, setUsername] = useState<string>('');
  const [checkingUser, setCheckingUser] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan, username')
            .eq('id', user.id)
            .single();
          if (profile) {
            setUserPlan(profile.plan);
            setUsername(profile.username);
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setCheckingUser(false);
      }
    }
    checkUser();
  }, [supabase]);

  function handleWhatsAppUpgrade() {
    if (!user) {
      router.push('/auth/register?redirect=/pricing');
      return;
    }

    const phone = '393517064080'; // +39 351 706 4080 without + and spaces
    const message = encodeURIComponent(
      `Ciao, voglio attivare CosmoLink PRO per l'account ${username}.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

  const freeFeatures = [
    'Fino a 5 link attivi contemporaneamente',
    'Tipi blocco Standard (link, intestazione, divisore)',
    '4 temi preimpostati (Cosmo Dark, Light, Purple, Cyber)',
    'Upload immagine avatar',
    'Riga contatti social configurabile',
    'Codice QR con mascotte standard (bianco e nero)',
  ];

  const proFeatures = [
    'Link illimitati attivi contemporaneamente',
    '10 temi preimpostati premium',
    'Customizzazione completa dell\'aspetto (colori, gradienti, sfondi)',
    'Upload sfondi personalizzati (immagini)',
    'Pulsanti con stili speciali (vetro, contorno, morbido)',
    'Font premium ( Outfit, Playfair, Nunito, Space Mono, ecc. )',
    'Anello avatar colorato e ombreggiato',
    'Link programmati (data di inizio/fine automatica)',
    'Media Embed (YouTube, Vimeo)',
    'Generatore di QR Code con colori personalizzati',
    'Rimozione del marchio "Powered by CosmoLink"',
    'Statistiche avanzate (Dispositivi, Paesi di provenienza e grafici storici)',
  ];

  return (
    <div className="min-h-screen bg-[hsl(240_25%_4%)] text-[hsl(240_10%_98%)] font-sans overflow-x-hidden relative flex flex-col justify-between">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(263_90%_64%)] opacity-[0.06] blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[hsl(190_95%_45%)] opacity-[0.04] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between z-10">
        <Logo size="md" />
        <Link href={user ? '/dashboard/links' : '/'}>
          <span className="text-sm font-semibold text-[hsl(240_5%_70%)] hover:text-white flex items-center gap-2 transition-colors cursor-pointer">
            <ArrowLeft size={16} />
            {user ? 'Torna alla Dashboard' : 'Torna alla Home'}
          </span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(263_90%_64%)/0.1] border border-[hsl(263_90%_64%)/0.2] text-xs font-semibold text-[hsl(263_90%_75%)]">
            <Sparkles size={12} className="animate-pulse" />
            Sblocca l'intero potenziale del tuo brand
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Piani adatti a ogni esigenza.
          </h1>
          <p className="text-base sm:text-lg text-[hsl(240_5%_70%)] max-w-lg mx-auto">
            Scegli il piano gratuito o passa a PRO per sbloccare temi personalizzati, link illimitati e statistiche avanzate.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16">
          {/* FREE PLAN */}
          <Card className="flex flex-col justify-between border-[hsl(240_15%_18%)] bg-[hsl(240_20%_8%)] relative overflow-hidden">
            <CardHeader className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Free</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(240_20%_16%)] text-[hsl(240_5%_70%)] font-semibold">Attuale</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">€0</span>
                <span className="text-sm text-[hsl(240_5%_48%)]">/ per sempre</span>
              </div>
              <p className="text-xs text-[hsl(240_5%_70%)]">Perfetto per iniziare a condividere i tuoi profili social online.</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-6 pt-6">
              <ul className="space-y-3 text-sm text-[hsl(240_5%_70%)]">
                {freeFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Link href={user ? '/dashboard/links' : '/auth/register'} className="w-full">
                  <Button variant="secondary" className="w-full">
                    {user ? 'Usa versione Free' : 'Registrati Gratis'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* PRO PLAN */}
          <Card className="flex flex-col justify-between border-[hsl(263_90%_64%)/0.3] bg-[hsl(240_20%_12%)] relative overflow-hidden shadow-2xl shadow-[hsl(263_90%_64%)/0.05]">
            {/* Top background accent glow for PRO */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[hsl(263_90%_64%)] opacity-[0.1] blur-2xl pointer-events-none" />
            
            <CardHeader className="space-y-3 relative z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[hsl(263_90%_75%)] flex items-center gap-1.5">
                  ⭐ CosmoLink PRO
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(263_90%_64%)/0.2] text-[hsl(263_90%_75%)] border border-[hsl(263_90%_64%)/0.2] font-semibold">
                  Consigliato
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">€29</span>
                <span className="text-sm text-[hsl(240_5%_48%)]">/ anno</span>
              </div>
              <p className="text-xs text-[hsl(240_5%_70%)]">Crea una landing page unica, professionale e personalizzata al 100%.</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-6 pt-6 relative z-10">
              <ul className="space-y-3 text-sm text-[hsl(240_5%_70%)]">
                {proFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[hsl(263_90%_64%)] mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                {checkingUser ? (
                  <Button className="w-full flex items-center justify-center gap-2" disabled>
                    <RefreshCw size={16} className="animate-spin" />
                    Verifica utente...
                  </Button>
                ) : userPlan === 'pro' ? (
                  <Button className="w-full" disabled variant="secondary">
                    Sei già PRO 🎉
                  </Button>
                ) : (
                  <Button 
                    className="w-full text-white bg-gradient-to-r from-[hsl(263_90%_64%)] to-[hsl(25_95%_53%)] border-0 hover:scale-[1.02] shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2" 
                    onClick={handleWhatsAppUpgrade} 
                  >
                    <MessageCircle size={18} />
                    Contattaci su WhatsApp
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info disclaimer */}
        <div className="flex items-center gap-6 text-xs text-[hsl(240_5%_48%)] border border-[hsl(240_15%_18%)] rounded-2xl px-6 py-4 bg-[hsl(240_22%_8%)] max-w-md w-full justify-center">
          <span className="flex items-center gap-1.5">
            <MessageCircle size={14} className="text-emerald-400" />
            Attivazione rapida via WhatsApp
          </span>
          <span className="w-px h-4 bg-[hsl(240_15%_18%)]" />
          <span>Supporto diretto e personale</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-[hsl(240_15%_18%)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[hsl(240_5%_48%)] bg-[hsl(240_25%_4%)]">
        <Logo size="sm" />
        <p>© 2026 CosmoLink. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}
