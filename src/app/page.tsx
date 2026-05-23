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

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-[hsl(240_15%_18%)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[hsl(240_5%_48%)] bg-[hsl(240_25%_4%)]">
        <Logo size="sm" />
        <p>© 2026 CosmoLink. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}
