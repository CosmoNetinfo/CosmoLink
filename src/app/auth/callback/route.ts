import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard/links';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists, if not create one
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        // Generate username from email or Google metadata
        const email = data.user.email || '';
        const baseName = data.user.user_metadata?.full_name
          ? data.user.user_metadata.full_name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
              .slice(0, 25)
          : email.split('@')[0].replace(/[^a-z0-9_-]/g, '').slice(0, 25);

        // Add random suffix to avoid conflicts
        const username = `${baseName}-${Math.random().toString(36).slice(2, 6)}`;

        await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          display_name: data.user.user_metadata?.full_name || username,
          avatar_url: data.user.user_metadata?.avatar_url || null,
        });
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page if code exchange fails
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
