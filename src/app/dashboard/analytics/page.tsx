'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Smartphone,
  Globe,
  Calendar,
  Lock,
} from 'lucide-react';
import type { Profile } from '@/types';

// Palette tailwind HSL tailored
const ACCENT_COLOR = '#82ca9d';
const PRIMARY_COLOR = '#8884d8';
const DEPLOY_COLORS = ['#ff6eb4', '#ffc658', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');

  // Chart data state
  const [viewsCount, setViewsCount] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [overTimeData, setOverTimeData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [topLinksData, setTopLinksData] = useState<any[]>([]);

  const supabase = createClient();

  const loadAnalytics = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(profileData);

    if (profileData) {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - (period === '7d' ? 7 : 30));

      // Retrieve views & clicks in single query requests
      const [
        { data: views, error: ve },
        { data: clicks, error: ce },
        { data: rawLinks },
      ] = await Promise.all([
        supabase
          .from('profile_views')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('link_clicks')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('links')
          .select('id, title, url')
          .eq('user_id', user.id),
      ]);

      if (ve || ce) {
        console.error(ve || ce);
      }

      // Nel database la data si chiama viewed_at / clicked_at: filtriamo qui per essere
      // indipendenti dal nome della colonna.
      const eventDate = (r: Record<string, string | undefined>): string =>
        r.clicked_at ?? r.viewed_at ?? r.created_at ?? '';
      const inPeriod = (r: Record<string, string | undefined>): boolean => {
        const d = eventDate(r);
        return d !== '' && new Date(d) >= cutoff;
      };
      const viewsArr = (views || []).filter(inPeriod);
      const clicksArr = (clicks || []).filter(inPeriod);
      const linksArr = rawLinks || [];

      setViewsCount(viewsArr.length);
      setClicksCount(clicksArr.length);

      // 1. Process over-time data grouped by date
      const dateMap: Record<string, { date: string; Visualizzazioni: number; Clic: number }> = {};
      for (let i = (period === '7d' ? 6 : 29); i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayStr = d.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' });
        const key = d.toISOString().split('T')[0];
        dateMap[key] = { date: dayStr, Visualizzazioni: 0, Clic: 0 };
      }

      viewsArr.forEach((v) => {
        const key = eventDate(v).split('T')[0];
        if (dateMap[key]) dateMap[key].Visualizzazioni += 1;
      });

      clicksArr.forEach((c) => {
        const key = eventDate(c).split('T')[0];
        if (dateMap[key]) dateMap[key].Clic += 1;
      });

      setOverTimeData(Object.values(dateMap));

      // 2. Process device distribution data
      const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
      viewsArr.forEach((v) => {
        const dev = v.device || 'desktop';
        if (deviceCounts[dev] !== undefined) deviceCounts[dev] += 1;
      });
      const devFormatted = Object.entries(deviceCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
      setDeviceData(devFormatted);

      // 3. Process top links performance
      const linkClickCounts: Record<string, number> = {};
      clicksArr.forEach((c) => {
        linkClickCounts[c.link_id] = (linkClickCounts[c.link_id] || 0) + 1;
      });

      const topLinks = linksArr
        .map((l) => ({
          title: l.title,
          url: l.url,
          clicks: linkClickCounts[l.id] || 0,
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

      setTopLinksData(topLinks);
    }

    setLoading(false);
  }, [supabase, period]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return <Spinner size="lg" className="mt-20" />;
  }

  const ctr = viewsCount > 0 ? ((clicksCount / viewsCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header and selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(240_10%_98%)]">Analisi Statistiche</h1>
          <p className="text-sm text-[hsl(240_5%_70%)] mt-1">
            Controlla le visite e i clic dei tuoi visitatori
          </p>
        </div>

        {/* Time period toggle */}
        <div className="flex bg-[hsl(240_20%_12%)] rounded-xl border border-[hsl(240_15%_18%)] p-1 shrink-0">
          {(['7d', '30d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`
                px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all
                ${period === p
                  ? 'bg-[hsl(263_90%_64%)] text-white shadow-md shadow-purple-500/20'
                  : 'text-[hsl(240_5%_70%)] hover:text-white'
                }
              `}
            >
              {p === '7d' ? 'Ultimi 7 Giorni' : 'Ultimi 30 Giorni'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[hsl(240_5%_70%)]">Visualizzazioni Profilo</p>
            <p className="text-3xl font-extrabold text-[hsl(240_10%_98%)]">{viewsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Eye size={20} />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[hsl(240_5%_70%)]">Clic Totali sui Link</p>
            <p className="text-3xl font-extrabold text-[hsl(240_10%_98%)]">{clicksCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <MousePointerClick size={20} />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[hsl(240_5%_70%)]">Click-Through-Rate (CTR)</p>
            <p className="text-3xl font-extrabold text-[hsl(240_10%_98%)]">{ctr}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <TrendingUp size={20} />
          </div>
        </Card>
      </div>

      {/* Main chart - Over Time */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={18} className="text-[hsl(263_90%_75%)]" />
          <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">Andamento nel tempo</h2>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={overTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT_COLOR} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={ACCENT_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" vertical={false} />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(240 22% 8%)',
                  border: '1px solid hsl(240 15% 18%)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="Visualizzazioni"
                stroke={PRIMARY_COLOR}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
              <Area
                type="monotone"
                dataKey="Clic"
                stroke={ACCENT_COLOR}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorClicks)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Grid: Device stats & Top links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top links */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-[hsl(263_90%_75%)]" />
            <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">I Link più Cliccati</h2>
          </div>

          <div className="space-y-4">
            {topLinksData.length === 0 ? (
              <p className="text-sm text-[hsl(240_5%_48%)] text-center py-6">Nessun clic registrato.</p>
            ) : (
              topLinksData.map((l, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[hsl(240_15%_18%)] last:border-0 pb-3 last:pb-0">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-[hsl(240_10%_98%)] truncate">{l.title}</p>
                    <p className="text-xs text-[hsl(240_5%_48%)] truncate">{l.url}</p>
                  </div>
                  <Badge variant="pro">{l.clicks} clic</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Device Distribution (PRO only blur or restricted overlay) */}
        <Card className={`p-6 ${profile?.plan === 'free' ? 'relative overflow-hidden' : ''}`}>
          {profile?.plan === 'free' && (
            <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
                <Lock size={18} />
              </div>
              <p className="text-xs font-semibold text-[hsl(240_10%_98%)]">Ripartizione Dispositivi PRO</p>
              <p className="text-[10px] text-[hsl(240_5%_70%)] mt-1 max-w-[200px]">
                Upgrade a PRO per visualizzare la ripartizione dei tuoi visitatori per dispositivo!
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6">
            <Smartphone size={18} className="text-[hsl(263_90%_75%)]" />
            <h2 className="text-base font-semibold text-[hsl(240_10%_98%)]">Dispositivi dei Visitatori</h2>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid stroke="#2a2a3e" horizontal={false} vertical strokeDasharray="3 3" />
                <XAxis type="number" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(240 22% 8%)',
                    border: '1px solid hsl(240 15% 18%)',
                    color: 'white',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]}>
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEPLOY_COLORS[index % DEPLOY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
