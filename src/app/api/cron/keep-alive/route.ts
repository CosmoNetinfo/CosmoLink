import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/cron/keep-alive
 *
 * Cron job that runs every 4 hours to keep the Supabase project alive.
 * On the Free tier, Supabase pauses projects after 7 days of inactivity.
 * This lightweight ping prevents that by making a simple DB query.
 *
 * Protected by CRON_SECRET to prevent unauthorized invocations.
 */
export async function GET(request: Request) {
  // ── Verify cron secret (prevents external abuse) ──
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const start = Date.now();
  const results: { check: string; ok: boolean; time_ms: number; detail?: string }[] = [];

  try {
    const supabase = await createClient();

    // ── Ping 1: Simple DB read (keeps the database alive) ──
    const dbStart = Date.now();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    results.push({
      check: 'db_ping',
      ok: !error,
      time_ms: Date.now() - dbStart,
      detail: error ? error.message : `${data?.length ?? 0} row(s)`,
    });

    // ── Ping 2: Auth check (keeps the Auth service alive) ──
    const authStart = Date.now();
    const { error: authError } = await supabase.auth.getUser();
    results.push({
      check: 'auth_ping',
      ok: true, // even "no session" is fine — it means auth service responded
      time_ms: Date.now() - authStart,
      detail: authError ? `No session (expected): ${authError.message}` : 'Session active',
    });

    // ── Ping 3: Storage check (keeps Storage alive) ──
    const storageStart = Date.now();
    const { error: storageError } = await supabase.storage
      .from('avatars')
      .list('', { limit: 1 });

    results.push({
      check: 'storage_ping',
      ok: !storageError,
      time_ms: Date.now() - storageStart,
      detail: storageError ? storageError.message : 'OK',
    });
  } catch (err: any) {
    results.push({
      check: 'fatal_error',
      ok: false,
      time_ms: Date.now() - start,
      detail: err.message,
    });
  }

  const total_ms = Date.now() - start;
  const allOk = results.every((r) => r.ok);

  console.log(
    `[CosmoLink Keep-Alive] ${allOk ? '✅' : '⚠️'} Ping completed in ${total_ms}ms`,
    JSON.stringify(results)
  );

  return NextResponse.json({
    status: allOk ? 'alive' : 'issues',
    timestamp: new Date().toISOString(),
    total_ms,
    next_run: 'in ~4 hours',
    results,
  });
}
