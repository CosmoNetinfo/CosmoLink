'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { Spinner } from '@/components/ui/Spinner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  GripVertical,
  Trash2,
  ExternalLink,
  Link2,
  AlertCircle,
  Heading,
  Minus,
  Play,
  Calendar,
  Lock,
} from 'lucide-react';
import type { Link as LinkType, Profile } from '@/types';

const MAX_FREE_LINKS = 5;

function SortableLink({
  link,
  onToggle,
  onDelete,
  onToggleFeature,
  isPro,
}: {
  link: LinkType;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onToggleFeature: (id: string, featured: boolean) => void;
  isPro: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSpecial = link.link_type !== 'link';

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={`p-4 ${isDragging ? 'ring-2 ring-[hsl(263_90%_64%)]' : ''} ${
          link.link_type === 'header'
            ? 'border-dashed border-purple-500/30 bg-purple-500/2'
            : link.link_type === 'divider'
            ? 'border-dashed border-zinc-700 bg-transparent'
            : ''
        }`}
        hover
      >
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <button
            {...listeners}
            className="text-[hsl(240_5%_48%)] hover:text-[hsl(240_10%_98%)] cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={18} />
          </button>

          {/* Content representation */}
          {link.link_type === 'header' ? (
            <div className="flex-1 flex items-center gap-2">
              <Heading size={16} className="text-purple-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-300">
                Sezione: {link.title}
              </span>
            </div>
          ) : link.link_type === 'divider' ? (
            <div className="flex-1 flex items-center gap-2">
              <Minus size={16} className="text-zinc-500" />
              <div className="h-px bg-zinc-700 flex-1" />
              <span className="text-[10px] text-zinc-500 uppercase">Divisore</span>
            </div>
          ) : (
            <>
              {/* Platform icon */}
              <div className="shrink-0">
                <PlatformIcon slug={link.icon || ''} color={link.icon_color || undefined} size={24} fallbackUrl={link.url} />
              </div>

              {/* Title & URL */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[hsl(240_10%_98%)] truncate">
                    {link.title}
                  </p>
                  {link.link_type === 'embed' && (
                    <Badge variant="pro" className="scale-75">EMBED</Badge>
                  )}
                  {link.is_featured && (
                    <span className="text-xs text-amber-400">⭐ Evidenziato</span>
                  )}
                </div>
                <p className="text-xs text-[hsl(240_5%_48%)] truncate">
                  {link.url}
                </p>
                {(link.starts_at || link.ends_at) && (
                  <p className="text-[10px] text-amber-500/80 mt-0.5 flex items-center gap-1">
                    <Calendar size={10} /> Programmazione Attiva
                  </p>
                )}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {!isSpecial && (
              <>
                <button
                  onClick={() => onToggleFeature(link.id, !link.is_featured)}
                  className={`text-xs hover:text-amber-400 transition-colors cursor-pointer ${
                    link.is_featured ? 'text-amber-400 font-semibold' : 'text-zinc-500'
                  }`}
                  title="Evidenzia Link"
                >
                  ⭐
                </button>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(240_5%_48%)] hover:text-[hsl(190_95%_45%)] transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </>
            )}

            <Toggle
              checked={link.is_active}
              onChange={(checked) => onToggle(link.id, checked)}
            />

            <button
              onClick={() => onDelete(link.id)}
              className="text-[hsl(240_5%_48%)] hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form inputs
  const [linkType, setLinkType] = useState<'link' | 'header' | 'divider' | 'embed'>('link');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [addError, setAddError] = useState('');

  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: profileData }, { data: linksData }, { data: platformsData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('links').select('*').eq('user_id', user.id).order('position'),
      supabase.from('platforms').select('slug, name, brand_color, domain_patterns'),
    ]);

    setProfile(profileData);
    setLinks(linksData || []);
    setPlatforms(platformsData || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUrlChange = (url: string) => {
    setNewUrl(url);
    if (!url) return;

    try {
      const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
      let found = false;
      for (const p of platforms) {
        const patterns: string[] = p.domain_patterns || [];
        if (patterns.some((pat: string) => hostname.includes(pat.toLowerCase()))) {
          // Auto-fill title with the platform's formatted name (e.g. "LinkedIn")
          setNewTitle(p.name);
          found = true;
          break;
        }
      }
      if (!found) {
        // If no platform detected, keep title empty
        setNewTitle('');
      }
    } catch {
      // Ignore invalid URL structures while typing
    }
  };

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');

    if (!profile) return;

    const isPro = profile.plan === 'pro';

    // Free tier checks
    if (!isPro && links.length >= MAX_FREE_LINKS) {
      setAddError(`Il piano Free consente massimo ${MAX_FREE_LINKS} blocchi. Passa a PRO per aggiungerne di più!`);
      return;
    }

    if (!isPro && (linkType === 'header' || linkType === 'divider' || linkType === 'embed' || startsAt || endsAt || isFeatured)) {
      setAddError('Alcune opzioni selezionate (Intestazione, Divisore, Embed, Programmazione o Evidenziato) sono riservate agli utenti PRO! Upgrade nelle impostazioni.');
      return;
    }

    // URL validation if applicable
    if (linkType === 'link' || linkType === 'embed') {
      try {
        new URL(newUrl);
      } catch {
        setAddError('Inserisci un URL valido (es. https://example.com)');
        return;
      }
    }

    setSaving(true);

    // Platform detection for links
    let icon = null;
    let iconColor = null;
    let finalEmbedType: 'youtube' | 'vimeo' | null = null;

    if (linkType === 'embed') {
      if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
        finalEmbedType = 'youtube';
        icon = 'youtube';
        iconColor = '#FF0000';
      } else if (newUrl.includes('vimeo.com')) {
        finalEmbedType = 'vimeo';
        icon = 'vimeo';
        iconColor = '#1AB7EA';
      }
    } else if (linkType === 'link') {
      try {
        const hostname = new URL(newUrl).hostname.toLowerCase().replace(/^www\./, '');
        for (const p of platforms) {
          const patterns: string[] = p.domain_patterns || [];
          if (patterns.some((pat: string) => hostname.includes(pat.toLowerCase()))) {
            icon = p.slug;
            iconColor = p.brand_color;
            break;
          }
        }
      } catch { /* ignore */ }
    }

    const { error } = await supabase.from('links').insert({
      user_id: profile.id,
      title: linkType === 'divider' ? '—' : newTitle,
      url: linkType === 'divider' ? '#' : newUrl,
      icon,
      icon_color: iconColor,
      position: links.length,
      link_type: linkType,
      embed_type: finalEmbedType,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      is_featured: isFeatured,
    });

    if (error) {
      setAddError(error.message);
    } else {
      setNewTitle('');
      setNewUrl('');
      setStartsAt('');
      setEndsAt('');
      setIsFeatured(false);
      setShowAddForm(false);
      await loadData();
    }

    setSaving(false);
  }

  async function handleToggle(id: string, active: boolean) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: active } : l)));
    await supabase.from('links').update({ is_active: active }).eq('id', id);
  }

  async function handleToggleFeature(id: string, featured: boolean) {
    if (profile?.plan === 'free') {
      alert('La funzione "Evidenzia Link" è riservata agli utenti PRO!');
      return;
    }

    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_featured: featured } : l)));
    await supabase.from('links').update({ is_featured: featured }).eq('id', id);
  }

  async function handleDelete(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await supabase.from('links').delete().eq('id', id);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);

    const reordered = arrayMove(links, oldIndex, newIndex);
    setLinks(reordered);

    // Persist new positions
    const updates = reordered.map((link, index) => ({
      id: link.id,
      position: index,
    }));

    for (const u of updates) {
      await supabase.from('links').update({ position: u.position }).eq('id', u.id);
    }
  }

  if (loading) {
    return <Spinner size="lg" className="mt-20" />;
  }

  const isPro = profile?.plan === 'pro';
  const isFreeLimitReached = !isPro && links.length >= MAX_FREE_LINKS;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(240_10%_98%)]">I tuoi Link</h1>
          <p className="text-sm text-[hsl(240_5%_70%)] mt-1">
            {links.length} blocchi · Trascina per riordinare
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={isFreeLimitReached}
          size="md"
        >
          <Plus size={18} />
          Nuovo Elemento
        </Button>
      </div>

      {/* Free limit warning */}
      {isFreeLimitReached && (
        <Card className="p-4 mb-6 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-400">Limite Free raggiunto</p>
              <p className="text-xs text-[hsl(240_5%_70%)] mt-1">
                Hai raggiunto il massimo di {MAX_FREE_LINKS} blocchi per il piano Free.
                Passa a PRO per aggiungere blocchi illimitati, intestazioni, divisori ed embed!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Add form */}
      {showAddForm && (
        <Card className="p-6 mb-6">
          <form onSubmit={handleAddLink} className="space-y-4">
            {/* Element Type Selector */}
            <div>
              <label className="text-xs font-medium text-[hsl(240_5%_70%)] block mb-2">
                Tipo di Elemento
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['link', 'header', 'divider', 'embed'] as const).map((type) => {
                  const isLocked = !isPro && type !== 'link';
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => !isLocked && setLinkType(type)}
                      className={`
                        relative py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer capitalize flex items-center justify-center gap-1.5
                        ${
                          linkType === type
                            ? 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)]'
                            : 'bg-transparent text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)] hover:bg-[hsl(240_20%_12%)]'
                        }
                        ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                    >
                      {type === 'link' && <Link2 size={12} />}
                      {type === 'header' && <Heading size={12} />}
                      {type === 'divider' && <Minus size={12} />}
                      {type === 'embed' && <Play size={12} />}
                      {type}
                      {isLocked && <Lock size={10} className="text-amber-400 absolute top-1 right-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional form fields */}
            {linkType === 'link' && (
              <>
                <Input
                  label="Titolo"
                  placeholder="Es. Il mio sito"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <Input
                  label="URL"
                  type="url"
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  required
                />

                {/* PRO Extra settings */}
                <div className={`p-4 rounded-xl bg-[hsl(240_20%_10%)] border border-[hsl(240_15%_18%)] space-y-3 ${!isPro ? 'opacity-40' : ''}`}>
                  <p className="text-[10px] font-bold text-[hsl(263_90%_75%)] uppercase tracking-wider flex items-center gap-1">
                    {!isPro && <Lock size={10} className="text-amber-400" />} OPZIONI AVANZATE PRO
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Evidenzia link</p>
                      <p className="text-[10px] text-[hsl(240_5%_70%)]">Aggiunge una stellina e un'animazione pulsante</p>
                    </div>
                    <Toggle checked={isFeatured} onChange={(checked) => isPro && setIsFeatured(checked)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400 block mb-1">Data Inizio Mostra</label>
                      <input
                        type="datetime-local"
                        value={startsAt}
                        onChange={(e) => isPro && setStartsAt(e.target.value)}
                        className="w-full rounded-lg bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-2 py-1.5 text-xs text-white"
                        disabled={!isPro}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400 block mb-1">Data Fine Mostra</label>
                      <input
                        type="datetime-local"
                        value={endsAt}
                        onChange={(e) => isPro && setEndsAt(e.target.value)}
                        className="w-full rounded-lg bg-[hsl(240_20%_12%)] border border-[hsl(240_15%_18%)] px-2 py-1.5 text-xs text-white"
                        disabled={!isPro}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {linkType === 'header' && (
              <Input
                label="Testo Sezione"
                placeholder="Es. Social personali, Link di vendita"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            )}

            {linkType === 'divider' && (
              <p className="text-xs text-[hsl(240_5%_70%)] bg-zinc-800/20 p-4 rounded-xl border border-dashed border-zinc-700">
                Il divisore visualizza una linea orizzontale sottile per organizzare e separare i tuoi link. Non servono altri dettagli!
              </p>
            )}

            {linkType === 'embed' && (
              <>
                <Input
                  label="Titolo Video"
                  placeholder="Es. Il mio ultimo video"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <Input
                  label="URL del Video (YouTube o Vimeo)"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                />
              </>
            )}

            {addError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">
                {addError}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" isLoading={saving}>
                Salva Elemento
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setAddError('');
                }}
              >
                Annulla
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reorderable list */}
      {links.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(263_90%_64%)/0.1] flex items-center justify-center">
            <Link2 size={28} className="text-[hsl(263_90%_64%)]" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(240_10%_98%)] mb-2">Nessun elemento presente</h3>
          <p className="text-sm text-[hsl(240_5%_70%)] mb-6">
            Inizia a creare elementi per popolare la tua bio page.
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={18} />
            Crea il primo elemento
          </Button>
        </Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {links.map((link) => (
                <SortableLink
                  key={link.id}
                  link={link}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onToggleFeature={handleToggleFeature}
                  isPro={isPro}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
