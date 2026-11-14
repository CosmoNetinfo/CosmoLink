import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    // Max 30 visualizzazioni al minuto per IP (best effort, per istanza)
    if (!rateLimit(`view:${clientIp(request)}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const profile_id = typeof body?.profile_id === 'string' ? body.profile_id : '';

    if (!UUID_RE.test(profile_id)) {
      return NextResponse.json({ error: 'Invalid profile_id' }, { status: 400 });
    }

    const ua = request.headers.get('user-agent') || '';
    const device = /mobile/i.test(ua) ? 'mobile' : /tablet/i.test(ua) ? 'tablet' : 'desktop';
    const referrer = (request.headers.get('referer') || '').slice(0, 500) || null;

    let browser = 'other';
    if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edg/i.test(ua)) browser = 'Edge';

    const supabase = createServiceClient();

    // Registriamo la visita solo se il profilo esiste davvero
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profile_id)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { error: insertError } = await supabase.from('profile_views').insert({
      user_id: profile.id,
      device,
      browser,
      referrer,
    });

    if (insertError) {
      console.error('track/view: insert failed', insertError.message);
      return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
