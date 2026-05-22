'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/shared/Logo';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  function validateUsername(val: string): string | null {
    if (val.length < 3) return 'Username deve avere almeno 3 caratteri.';
    if (val.length > 30) return 'Username non può superare 30 caratteri.';
    if (!/^[a-z0-9_-]+$/.test(val)) return 'Solo lettere minuscole, numeri, - e _.';
    return null;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri.');
      return;
    }

    setLoading(true);

    // Check username availability
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (existing) {
      setError('Questo username è già preso. Scegline un altro.');
      setLoading(false);
      return;
    }

    // Sign up
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Create profile row
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: username,
      });

      if (profileError && !profileError.message.includes('duplicate')) {
        setError('Errore nella creazione del profilo: ' + profileError.message);
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleSignUp() {
    setError('');
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Mail size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-[hsl(240_10%_98%)] mb-2">
            Controlla la tua email!
          </h2>
          <p className="text-[hsl(240_5%_70%)] text-sm">
            Abbiamo inviato un link di conferma a <strong className="text-[hsl(240_10%_98%)]">{email}</strong>.
            Clicca sul link per attivare il tuo account e iniziare a personalizzare la tua pagina CosmoLink!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Cosmic background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-[hsl(263_90%_64%)/0.08] blur-[100px] animate-pulse-glow-1" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-[hsl(190_95%_45%)/0.06] blur-[100px] animate-pulse-glow-2" />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-[hsl(240_10%_98%)] mb-2">
            Unisciti al cosmo
          </h1>
          <p className="text-[hsl(240_5%_70%)]">
            Crea il tuo account CosmoLink in pochi secondi
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[hsl(240_15%_18%)] bg-[hsl(240_22%_8%)] hover:bg-[hsl(240_20%_12%)] text-[hsl(240_10%_98%)] transition-all duration-200 mb-6 cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Registrati con Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(240_15%_18%)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[rgba(22,22,34,0.45)] px-3 text-[hsl(240_5%_48%)]">oppure</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="il-tuo-nome"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              icon={<User size={18} />}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="la-tua@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Almeno 6 caratteri"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
              minLength={6}
            />

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={loading}>
              Crea il tuo universo
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="text-center text-sm text-[hsl(240_5%_48%)] mt-6">
            Hai già un account?{' '}
            <Link href="/auth/login" className="text-[hsl(263_90%_64%)] hover:underline">
              Accedi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
