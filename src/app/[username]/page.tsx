import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PublicPageClient from '@/components/public/PublicPageClient';

export const revalidate = 60; // ISR: regenerate every 60 seconds

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, bio, avatar_url')
    .eq('username', username)
    .single();

  if (!profile) {
    return { title: 'Utente non trovato — CosmoLink' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ogImageUrl = `${siteUrl}/api/og/${username}`;

  return {
    title: `${profile.display_name || profile.username} — CosmoLink`,
    description: profile.bio || `Visita la pagina di ${profile.display_name || profile.username} su CosmoLink`,
    openGraph: {
      title: `${profile.display_name || profile.username}`,
      description: profile.bio || undefined,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${profile.display_name || profile.username} — CosmoLink`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.display_name || profile.username} — CosmoLink`,
      description: profile.bio || undefined,
      images: [ogImageUrl],
    },
  };
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Load profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) {
    notFound();
  }

  // Load active links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('position');

  // Load theme config
  const { data: themeData } = await supabase
    .from('themes')
    .select('*')
    .eq('slug', profile.theme_slug)
    .single();

  return (
    <PublicPageClient
      profile={profile}
      links={links || []}
      themeConfig={themeData?.config || null}
    />
  );
}
