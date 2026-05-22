import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile_id } = body;

    if (!profile_id) {
      return NextResponse.json({ error: 'Missing profile_id' }, { status: 400 });
    }

    const ua = request.headers.get('user-agent') || '';
    const device = /mobile/i.test(ua) ? 'mobile' : /tablet/i.test(ua) ? 'tablet' : 'desktop';
    const referrer = request.headers.get('referer') || null;

    let browser = 'other';
    if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edg/i.test(ua)) browser = 'Edge';

    const supabase = await createAdminClient();
    await supabase.from('profile_views').insert({
      user_id: profile_id,
      device,
      browser,
      referrer,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
