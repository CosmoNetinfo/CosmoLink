'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Link2,
  Sparkles,
  BarChart3,
  QrCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  Zap,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[hsl(240_25%_4%)] text-[hsl(240_10%_98%)] font-sans overflow-x-hidden relative flex flex-col justify-between">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(263_90%_64%)] opacity-[0.08] blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[hsl(190_95%_45%)] opacity-[0.05] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between z-10">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <span className="text-sm font-semibold text-[hsl(240_5%_70%)] hover:text-white transition-colors cursor-pointer">
              Accedi
            </span>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Registrati gratis</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left column info */}
        <div className="space-y-8 max-w-xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(263_90%_64%)/0.1] border border-[hsl(263_90%_64%)/0.2] text-xs font-semibold text-[hsl(263_90%_75%)]"
          >
            <Sparkles size={12} className="animate-pulse" />
            Il tuo intero universo in un unico link
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] bg-gradient-to-r from-white via-[hsl(240_10%_98%)] to-[hsl(263_90%_75%)] bg-clip-text text-transparent"
          >
            Connetti il tuo mondo con eleganza cosmica.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[hsl(240_5%_70%)] leading-relaxed"
          >
            Crea una splendida pagina bio personalizzabile in pochi secondi. Condividi link, analizza i clic, genera QR Code ed esplora temi dal design spaziale. Tutto gratis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          >
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Inizia gratis
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Accedi al tuo account
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center md:justify-start gap-6 pt-4 text-xs text-[hsl(240_5%_48%)]"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Nessuna carta richiesta
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              SSL protetto al 100%
            </span>
          </motion.div>
        </div>

        {/* Right column: Mascot showcase preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center relative w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot.png"
            alt="CosmoLink Mascot"
            className="w-full max-w-[280px] sm:max-w-[400px] h-auto object-contain drop-shadow-[0_0_50px_rgba(108,92,231,0.2)]"
          />
        </motion.div>
      </main>

      {/* Feature Section Cards */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 border-t border-[hsl(240_15%_18%)] bg-[hsl(240_25%_4%)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Link2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Link illimitati</h3>
            <p className="text-sm text-[hsl(240_5%_70%)]">
              Organizza, aggiungi ed attiva tutti i tuoi profili social in pochi istanti con autodetect intelligente dei brand.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Statistiche in tempo reale</h3>
            <p className="text-sm text-[hsl(240_5%_70%)]">
              Analizza le visualizzazioni complessive, il click-through-rate ed il comportamento degli utenti.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <QrCode size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Mascot QR Code</h3>
            <p className="text-sm text-[hsl(240_5%_70%)]">
              Genera codici QR vettoriali con l'iconica mascotte cosmica aliena al centro da stampare e scaricare.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-20 bg-[hsl(240_20%_6%)] border-t border-[hsl(240_15%_18%)] relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[hsl(240_10%_98%)] to-[hsl(263_90%_75%)] bg-clip-text text-transparent">
              Scegli il tuo piano
            </h2>
            <p className="text-sm md:text-base text-[hsl(240_5%_70%)]">
              Inizia gratis, passa a PRO quando vuoi. Nessun contratto, cancelli quando vuoi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
            {/* Card 1 - Free */}
            <Card className="p-8 flex flex-col justify-between bg-[hsl(240_25%_4%)] border-[hsl(240_15%_15%)] hover:border-[hsl(240_15%_25%)] transition-all rounded-2xl shadow-xl relative overflow-hidden">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">€0</span>
                    <span className="text-sm text-[hsl(240_5%_60%)]">per sempre</span>
                  </div>
                </div>
                
                <hr className="border-[hsl(240_15%_15%)]" />
                
                <ul className="space-y-3.5 text-sm text-[hsl(240_5%_80%)]">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>5 link</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>4 temi</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>QR Code con mascotte</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>Analytics base</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>Upload avatar</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>Link social</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span className="font-semibold text-emerald-400">Nessuna pubblicità, mai</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <Link href="/auth/register" className="w-full block">
                  <Button variant="secondary" className="w-full py-6 rounded-xl font-semibold border-[hsl(240_15%_20%)] hover:bg-white/5 transition-all text-white">
                    Inizia gratis
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Card 2 - PRO Mensile */}
            <Card className="p-8 flex flex-col justify-between bg-[hsl(240_25%_4%)] border-[hsl(240_15%_15%)] hover:border-[hsl(240_15%_25%)] transition-all rounded-2xl shadow-xl relative overflow-hidden">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">PRO</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">€4,99</span>
                    <span className="text-sm text-[hsl(240_5%_60%)]">al mese</span>
                  </div>
                </div>

                <hr className="border-[hsl(240_15%_15%)]" />

                <ul className="space-y-3.5 text-sm text-[hsl(240_5%_80%)]">
                  <li className="text-[hsl(263_90%_75%)] text-xs font-semibold uppercase tracking-wider mb-2">Tutto Free +</li>
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-purple-400 shrink-0" />
                    <span>Link illimitati</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-purple-400 shrink-0" />
                    <span>Tutti i 16 temi</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-purple-400 shrink-0" />
                    <span>Personalizzazione completa</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-purple-400 shrink-0" />
                    <span>Analytics avanzate</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-purple-400 shrink-0" />
                    <span>Embed video YouTube/Vimeo</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-purple-400 shrink-0" />
                    <span>Link programmati</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-purple-400 shrink-0" />
                    <span>QR personalizzato</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Zap size={16} className="text-purple-400 shrink-0" />
                    <span>Rimozione branding</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <a href="https://wa.me/393517064080?text=Ciao,%20voglio%20attivare%20CosmoLink%20PRO%20mensile" target="_blank" rel="noopener noreferrer" className="w-full block">
                  <Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-[hsl(263_90%_64%)] to-[hsl(263_90%_50%)] hover:from-[hsl(263_90%_70%)] hover:to-[hsl(263_90%_55%)] transition-all text-white border-0">
                    Passa a PRO
                  </Button>
                </a>
              </div>
            </Card>

            {/* Card 3 - PRO Annuale */}
            <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-between">
              <div className="h-full w-full bg-[hsl(240_25%_4%)] rounded-[14px] p-8 flex flex-col justify-between relative overflow-hidden">
                {/* Purple subtle glow back */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
                
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">PRO Annuale</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white">€39,99</span>
                        <span className="text-sm text-[hsl(240_5%_60%)]">all'anno</span>
                      </div>
                      <p className="text-xs text-[hsl(240_5%_55%)] mt-1">equivale a €3,33/mese</p>
                    </div>
                    <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-[10px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      CONSIGLIATO
                    </span>
                  </div>

                  <div className="bg-[rgba(168,85,247,0.08)] border border-purple-500/20 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    <span className="text-xs font-semibold text-purple-300">Risparmi €20 — 2 mesi gratis</span>
                  </div>

                  <hr className="border-[hsl(240_15%_15%)]" />

                  <ul className="space-y-3.5 text-sm text-[hsl(240_5%_80%)]">
                    <li className="text-[hsl(263_90%_75%)] text-xs font-semibold uppercase tracking-wider mb-2">Stesse features del PRO Mensile</li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-purple-400 shrink-0" />
                      <span>Link illimitati</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-purple-400 shrink-0" />
                      <span>Tutti i 16 temi</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-purple-400 shrink-0" />
                      <span>Personalizzazione completa</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-purple-400 shrink-0" />
                      <span>Analytics avanzate</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-purple-400 shrink-0" />
                      <span>Embed video YouTube/Vimeo</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-purple-400 shrink-0" />
                      <span>Link programmati</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-purple-400 shrink-0" />
                      <span>QR personalizzato</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-purple-400 shrink-0" />
                      <span>Rimozione branding</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <a href="https://wa.me/393517064080?text=Ciao,%20voglio%20attivare%20CosmoLink%20PRO%20annuale" target="_blank" rel="noopener noreferrer" className="w-full block">
                    <Button className="w-full py-6 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-all text-white border-0 shadow-lg shadow-purple-500/20">
                      Passa a PRO Annuale
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Launch Banner */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-[14px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
            <div className="relative z-10 space-y-1 text-center md:text-left">
              <h4 className="text-lg md:text-xl font-bold text-white">🚀 Offerta lancio</h4>
              <p className="text-sm text-white/90">
                Per i primi 3 mesi il piano PRO Annuale è a €29,99. Scrivici su WhatsApp per approfittarne.
              </p>
            </div>
            <a href="https://wa.me/393517064080?text=Ciao,%20voglio%20attivare%20l%27offerta%20lancio%20CosmoLink%20PRO%20annuale" target="_blank" rel="noopener noreferrer" className="relative z-10 w-full md:w-auto shrink-0">
              <button className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3.5 text-sm rounded-xl bg-white text-purple-700 hover:bg-white/90 font-bold transition-all duration-200 border-0 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[hsl(240_25%_4%)] focus:ring-white">
                Approfitta dell'offerta
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-[hsl(240_15%_18%)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[hsl(240_5%_48%)] bg-[hsl(240_25%_4%)]">
        <Logo size="sm" />
        <div className="flex flex-col sm:items-end items-center gap-1">
          <p>© 2026 CosmoLink. Tutti i diritti riservati.</p>
          <p className="text-xs opacity-80">
            Realizzato da{' '}
            <a
              href="https://www.cosmonet.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-bold text-indigo-400"
            >
              CosmoNet — Daniele Spalletti
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
