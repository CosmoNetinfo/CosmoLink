import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

interface LegalPageProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

/** Layout condiviso per Privacy e Termini. */
export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[hsl(240_25%_4%)] text-[hsl(240_10%_98%)] font-sans flex flex-col">
      <header className="w-full max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo size="md" />
        <Link
          href="/"
          className="text-sm font-semibold text-[hsl(240_5%_70%)] hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} />
          Torna alla Home
        </Link>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{title}</h1>
        <p className="text-xs text-[hsl(240_5%_48%)] mb-10">Ultimo aggiornamento: {updated}</p>
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[hsl(240_5%_78%)] [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-[hsl(263_90%_75%)] [&_a]:underline">
          {children}
        </div>
      </main>

      <footer className="w-full max-w-3xl mx-auto px-6 py-8 border-t border-[hsl(240_15%_18%)] text-xs text-[hsl(240_5%_48%)] flex items-center justify-between">
        <p>© 2026 CosmoLink</p>
        <p className="flex items-center gap-3">
          <Link href="/privacy" className="hover:text-white hover:underline">Privacy</Link>
          <Link href="/termini" className="hover:text-white hover:underline">Termini</Link>
        </p>
      </footer>
    </div>
  );
}
