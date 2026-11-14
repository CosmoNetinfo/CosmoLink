import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    // Max 60 click al minuto per IP (best effort, per istanza)
    if (!rateLimit(`click:${clientIp(request)}`, 60, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const link_id = typeof body?.link_id === 'string' ? body.link_id : '';

    if (!UUID_RE.test(link_id)) {
      return NextResponse.json({ error: 'Invalid link_id' }, { status: 400 });
    }

    // Parse device from user-agent
    const ua = request.headers.get('user-agent') || '';
    const device = /mobile/i.test(ua) ? 'mobile' : /tablet/i.test(ua) ? 'tablet' : 'desktop';
    const referrer = (request.headers.get('referer') || '').slice(0, 500) || null;

    // Simplified browser detection
    let browser = 'other';
    if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edg/i.test(ua)) browser = 'Edge';

    const supabase = createServiceClient();

    // Il proprietario del link lo ricaviamo dal database: ignoriamo l'user_id inviato dal client
    const { data: link } = await supabase
      .from('links')
      .select('id, user_id, is_active')
      .eq('id', link_id)
      .maybeSingle();

    if (!link || !link.is_active) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    await supabase.from('link_clicks').insert({
      link_id: link.id,
      user_id: link.user_id,
      device,
      browser,
      referrer,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
