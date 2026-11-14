'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import {
  Settings,
  ShieldAlert,
  Sparkles,
  Link,
  ChevronRight,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import type { Profile } from '@/types';
import { whatsappLink } from '@/lib/site';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const supabase = createClient();
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setUsername(profileData.username);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Username validation and save
  async function handleSaveUsername(e: React.FormEvent) {
    e.preventDefault();
    setUsernameError('');
    setUsernameSuccess('');

    if (!profile) return;

    if (username === profile.username) {
      setUsernameSuccess('Username invariato.');
      return;
    }

    // Regexp check
    if (!/^[a-z0-9_-]{3,30}$/.test(username)) {
      setUsernameError('L\'username deve contenere da 3 a 30 caratteri minuscoli, numeri, trattini (-) o underscore (_).');
      return;
    }

    setSavingUsername(true);

    // Check availability
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existing) {
      setUsernameError('Questo username è già stato preso! Scegline un altro.');
      setSavingUsername(false);
      return;
    }

    // Save
    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', profile.id);

    if (error) {
      setUsernameError(error.message);
    } else {
      setUsernameSuccess('Username aggiornato con successo!');
      await loadProfile();
    }
    setSavingUsername(false);
  }

  // Esci dall'account (chiude solo la sessione)
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    router.push('/auth/login');
  }

  // Cancellazione definitiva: account, pagina, link e statistiche
  async function handleDeleteAccount() {
    if (!profile) return;
    setDeleteError('');
    setDeleting(true);
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: deletePhrase }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setDeleteError(body.error || 'Non sono riuscito a cancellare l\'account. Riprova o scrivici.');
        setDeleting(false);
        return;
      }
      await supabase.auth.signOut();
      router.push('/');
    } catch {
      setDeleteError('Errore di connessione. Riprova tra poco.');
      setDeleting(false);
    }
  }

  if (loading) {
    return <Spinner size="lg" className="mt-20" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(240_10%_98%)]">Impostazioni Account</h1>
        <p className="text-sm text-[hsl(240_5%_70%)] mt-1">
          Gestisci le credenziali, l'abbonamento e le preferenze del tuo link-in-bio
        </p>
      </div>

      {/* Username setting */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
          <Settings size={18} className="text-[hsl(263_90%_75%)]" />
          <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">Personalizzazione URL</h2>
        </div>

        <form onSubmit={handleSaveUsername} className="space-y-4">
          <p className="text-xs text-[hsl(240_5%_70%)]">
            Cambiando il tuo username cambierai anche l'indirizzo pubblico della tua pagina.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[hsl(240_5%_48%)] shrink-0 bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-3 py-2.5 rounded-xl">
              cosmolink.app/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="il-tuo-nome"
              className="flex-1 rounded-xl bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-3 py-2.5 text-sm text-[hsl(240_10%_98%)] placeholder:text-[hsl(240_5%_48%)] focus:outline-none focus:ring-1 focus:ring-[hsl(263_90%_64%)] transition-all"
              required
            />
          </div>

          {usernameError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
              {usernameError}
            </div>
          )}

          {usernameSuccess && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400">
              {usernameSuccess}
            </div>
          )}

          <Button type="submit" isLoading={savingUsername}>
            Salva Nuovo Username
          </Button>
        </form>
      </Card>

      {/* Plan management */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-[hsl(240_15%_18%)] pb-3">
          <Sparkles size={18} className="text-amber-400" />
          <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">Piano CosmoLink</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Stato Piano Attuale:</span>
              <Badge variant={profile?.plan === 'pro' ? 'pro' : 'free'}>
                {profile?.plan === 'pro' ? '⭐ PRO' : 'FREE'}
              </Badge>
            </div>
            <p className="text-xs text-[hsl(240_5%_70%)] max-w-lg">
              {profile?.plan === 'pro'
                ? 'Hai accesso completo a link illimitati, temi personalizzati sbloccati, statistiche sui dispositivi, tag ed elementi di integrazione avanzati.'
                : 'Il piano Free ti consente di caricare fino a 5 link e utilizzare i 12 temi gratuiti. Passa a PRO per sbloccare tutti i temi, i colori e i font personalizzati.'}
            </p>
          </div>

          <a
            href={whatsappLink(profile?.plan === 'pro'
              ? `Ciao, vorrei informazioni sul mio abbonamento PRO di CosmoLink (@${profile?.username})`
              : `Ciao, vorrei attivare il piano PRO di CosmoLink (@${profile?.username})`)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold bg-[hsl(263_90%_64%)] text-white hover:opacity-90 transition-opacity"
          >
            {profile?.plan === 'pro' ? 'Gestisci abbonamento' : 'Attiva PRO su WhatsApp ⭐'}
            <ChevronRight size={16} />
          </a>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-2 mb-4 border-b border-red-500/10 pb-3">
          <ShieldAlert size={18} className="text-red-400" />
          <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-[hsl(240_5%_70%)]">
            Uscendo dall'account chiudi solo la sessione su questo dispositivo: la tua pagina pubblica resta online. Con la cancellazione elimini per sempre account, pagina, link e statistiche.
          </p>

          {!deleteConfirm ? (
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirm(true)}
              className="hover:bg-red-500/10 hover:text-red-400 border-red-500/20 text-red-400"
            >
              <LogOut size={16} />
              Esci dall'Account
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                Sei sicuro di voler uscire da CosmoLink? La tua sessione verrà chiusa.
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white">
                  Sì, Esci
                </Button>
                <Button variant="ghost" onClick={() => setDeleteConfirm(false)}>
                  Annulla
                </Button>
              </div>
            </div>
          )}

          <div className="border-t border-red-500/10 pt-4 space-y-3">
            {!deleteOpen ? (
              <Button
                variant="ghost"
                onClick={() => setDeleteOpen(true)}
                className="hover:bg-red-500/10 hover:text-red-400 border-red-500/20 text-red-400"
              >
                <AlertTriangle size={16} />
                Elimina account definitivamente
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  Questa azione è irreversibile: la tua pagina, i link e le statistiche vengono cancellati. Per confermare
                  scrivi il tuo username: <strong>{profile?.username}</strong>
                </div>
                <Input
                  value={deletePhrase}
                  onChange={(e) => setDeletePhrase(e.target.value)}
                  placeholder={profile?.username}
                  autoComplete="off"
                />
                {deleteError && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
                    {deleteError}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={handleDeleteAccount}
                    isLoading={deleting}
                    disabled={deletePhrase !== profile?.username}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Elimina per sempre
                  </Button>
                  <Button variant="ghost" onClick={() => { setDeleteOpen(false); setDeletePhrase(''); setDeleteError(''); }}>
                    Annulla
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
