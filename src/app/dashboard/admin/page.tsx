import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, Users, Star, Link as LinkIcon, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Load admin emails
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  if (!user || !user.email || !adminEmails.includes(user.email.toLowerCase())) {
    redirect('/dashboard/links');
  }

  const supabaseAdmin = await createAdminClient();

  // Load auth users list
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  const authUsers = authData?.users || [];

  // Load profiles
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // Load links count for users
  const { data: links } = await supabaseAdmin.from('links').select('user_id');

  if (profilesError || authError) {
    console.error('Error fetching admin data:', profilesError, authError);
  }

  // Calculate links per user
  const linkCounts: Record<string, number> = {};
  links?.forEach((link) => {
    linkCounts[link.user_id] = (linkCounts[link.user_id] || 0) + 1;
  });

  // Map user data
  const usersList = (profiles || []).map((profile) => {
    const authUser = authUsers.find((u) => u.id === profile.id);
    return {
      ...profile,
      email: authUser?.email || 'Nessuna email',
      linksCount: linkCounts[profile.id] || 0,
    };
  });

  // Filter list
  const filteredUsers = usersList.filter((u) => {
    if (!q) return true;
    const query = q.toLowerCase();
    return (
      u.username.toLowerCase().includes(query) ||
      u.display_name?.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  const proCount = usersList.filter((u) => u.plan === 'pro').length;
  const freeCount = usersList.length - proCount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <ShieldAlert className="text-[hsl(263_90%_64%)]" size={30} />
            Pannello Admin
          </h1>
          <p className="text-sm text-[hsl(240_5%_70%)] mt-1">
            Gestisci gli utenti registrati su CosmoLink, controlla i piani attivi e monitora l'utilizzo.
          </p>
        </div>
        <Link href="/dashboard/links">
          <span className="text-sm font-semibold text-[hsl(240_5%_70%)] hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
            <ArrowLeft size={16} />
            Torna alla Dashboard
          </span>
        </Link>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 border-[hsl(240_15%_18%)] bg-[hsl(240_20%_12%)]">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-[hsl(240_5%_48%)] uppercase tracking-wider font-semibold">Utenti Totali</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{usersList.length}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border-[hsl(240_15%_18%)] bg-[hsl(240_20%_12%)]">
          <div className="p-3 rounded-xl bg-[hsl(263_90%_64%)]/10 text-[hsl(263_90%_75%)]">
            <Star size={24} />
          </div>
          <div>
            <p className="text-xs text-[hsl(240_5%_48%)] uppercase tracking-wider font-semibold">Abbonati PRO</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{proCount}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 border-[hsl(240_15%_18%)] bg-[hsl(240_20%_12%)]">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <LinkIcon size={24} />
          </div>
          <div>
            <p className="text-xs text-[hsl(240_5%_48%)] uppercase tracking-wider font-semibold">Link Creati</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{links?.length || 0}</h3>
          </div>
        </Card>
      </div>

      {/* Users table list */}
      <Card className="border-[hsl(240_15%_18%)] bg-[hsl(240_20%_8%)] overflow-hidden">
        {/* Search header */}
        <div className="p-6 border-b border-[hsl(240_15%_18%)] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[hsl(240_20%_12%)]">
          <h3 className="text-lg font-bold text-white">Elenco Utenti</h3>
          <form className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 text-[hsl(240_5%_48%)]" size={16} />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cerca username, nome o email..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-[hsl(240_25%_4%)] border border-[hsl(240_15%_18%)] rounded-xl text-white placeholder-[hsl(240_5%_48%)] focus:outline-none focus:border-[hsl(263_90%_64%)] transition-colors"
            />
          </form>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[hsl(240_15%_18%)] bg-[hsl(240_20%_12%)/0.5] text-[hsl(240_5%_48%)]">
                <th className="py-4 px-6 font-semibold">Profilo / Utente</th>
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold">Stato Piano</th>
                <th className="py-4 px-6 font-semibold text-center">Link Totali</th>
                <th className="py-4 px-6 font-semibold">Data Registrazione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(240_15%_18%)]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[hsl(240_5%_48%)] bg-[hsl(240_20%_12%)/0.1]">
                    Nessun utente trovato con i criteri di ricerca.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[hsl(240_20%_12%)/0.3] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.avatar_url}
                            alt={u.username}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[hsl(263_90%_64%)]/10 flex items-center justify-center text-xs font-semibold text-[hsl(263_90%_75%)]">
                            {(u.display_name || u.username)?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white">{u.display_name || u.username}</p>
                          <p className="text-xs text-[hsl(240_5%_48%)]">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[hsl(240_5%_70%)] font-mono text-xs">{u.email}</td>
                    <td className="py-4 px-6">
                      <Badge variant={u.plan === 'pro' ? 'pro' : 'free'}>
                        {u.plan === 'pro' ? '⭐ PRO' : 'FREE'}
                      </Badge>
                      {u.is_verified && (
                        <span className="ml-2 inline-flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                          VERIFICATO
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center text-white font-semibold">{u.linksCount}</td>
                    <td className="py-4 px-6 text-[hsl(240_5%_48%)]">
                      {new Date(u.created_at).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
