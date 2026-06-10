'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/shared/Logo';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import type { Profile } from '@/types';
import { checkIsAdmin } from './actions';

const navItems = [
  { href: '/dashboard/links', label: 'Link', icon: Link2 },
  { href: '/dashboard/appearance', label: 'Aspetto', icon: Palette },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/qrcode', label: 'QR Code', icon: QrCode },
  { href: '/dashboard/settings', label: 'Impostazioni', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      let { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Auto-create profile if it doesn't exist
      if (!profileData) {
        const email = user.email || '';
        const baseName = user.user_metadata?.full_name
          ? user.user_metadata.full_name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
              .slice(0, 25)
          : email.split('@')[0].replace(/[^a-z0-9_-]/g, '').slice(0, 25);

        const username = `${baseName}-${Math.random().toString(36).slice(2, 6)}`;

        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username,
            display_name: user.user_metadata?.full_name || username,
            avatar_url: user.user_metadata?.avatar_url || null,
          })
          .select()
          .single();

        profileData = newProfile;
      }

      // Check admin status
      const adminStatus = await checkIsAdmin();
      setIsAdmin(adminStatus);

      setProfile(profileData);
      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col
          bg-bg-secondary border-r border-border
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <Logo size={collapsed ? 'sm' : 'md'} showText={!collapsed} />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-text-secondary hover:text-text-primary cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {(isAdmin
            ? [...navItems, { href: '/dashboard/admin', label: 'Admin', icon: ShieldAlert }]
            : navItems
          ).map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary border border-transparent'
                  }
                  ${collapsed ? 'justify-center px-2' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile / Plan footer */}
        <div className="px-3 pb-4 space-y-2">
          {!collapsed && profile && (
            <Link
              href={`/${profile.username}`}
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-secondary hover:bg-bg-primary transition-colors"
            >
              <ExternalLink size={14} />
              cosmolink.app/{profile.username}
            </Link>
          )}

          {!collapsed && profile && (
            <div className="flex flex-col gap-2 px-3 pt-1">
              <div className="flex items-center gap-2">
                <Badge variant={profile.plan === 'pro' ? 'pro' : 'free'}>
                  {profile.plan === 'pro' ? '⭐ PRO' : 'FREE'}
                </Badge>
              </div>
              {profile.plan === 'free' && (
                <a
                  href={`https://wa.me/393517064080?text=${encodeURIComponent(`Ciao, voglio attivare CosmoLink PRO per l'account ${profile.username}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-center py-1.5 px-3 rounded-lg text-white bg-gradient-to-r from-primary to-[hsl(25_95%_53%)] hover:scale-[1.02] transition-transform shadow-md shadow-purple-500/10 cursor-pointer block"
                >
                  💬 Upgrade PRO (€29)
                </a>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
              text-text-secondary hover:bg-red-500/10 hover:text-red-400
              transition-all duration-200 w-full cursor-pointer
              ${collapsed ? 'justify-center px-2' : ''}
            `}
            title={collapsed ? 'Esci' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>Esci</span>}
          </button>

          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full py-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-bg-primary/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-text-secondary hover:text-text-primary cursor-pointer"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {profile && (
              <div className="flex items-center gap-3">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || profile.username}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                    {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm text-text-primary">
                  {profile.display_name || profile.username}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
