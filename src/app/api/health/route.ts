import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/health
 *
 * Diagnostic endpoint to check:
 * 1. Environment variable presence
 * 2. Supabase connection (auth + db)
 * 3. Response times for each operation
 *
 * Use this to diagnose MIDDLEWARE_INVOCATION_TIMEOUT errors.
 */
export async function GET() {
  const checks: {
    name: string;
    status: 'ok' | 'fail' | 'warn';
    time_ms: number;
    detail?: string;
  }[] = [];

  const overall_start = Date.now();

  // ── Check 1: Environment variables ──
  const envStart = Date.now();
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  const allEnvPresent = Object.values(envVars).every(Boolean);
  checks.push({
    name: 'env_variables',
    status: allEnvPresent ? 'ok' : 'fail',
    time_ms: Date.now() - envStart,
    detail: JSON.stringify(envVars),
  });

  // ── Check 2: Supabase URL reachability ──
  const urlCheckStart = Date.now();
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const urlTime = Date.now() - urlCheckStart;
    checks.push({
      name: 'supabase_reachable',
      status: res.ok || res.status === 400 ? (urlTime > 3000 ? 'warn' : 'ok') : 'fail',
      time_ms: urlTime,
      detail: `HTTP ${res.status} ${res.statusText}`,
    });
  } catch (err: any) {
    checks.push({
      name: 'supabase_reachable',
      status: 'fail',
      time_ms: Date.now() - urlCheckStart,
      detail: err.name === 'AbortError' ? 'TIMEOUT after 5s' : err.message,
    });
  }

  // ── Check 3: Auth - getUser() ──
  const authStart = Date.now();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    const authTime = Date.now() - authStart;
    if (error) {
      checks.push({
        name: 'auth_get_user',
        status: authTime > 3000 ? 'warn' : 'ok',
        time_ms: authTime,
        detail: `No session (expected for unauthenticated request): ${error.message}`,
      });
    } else {
      checks.push({
        name: 'auth_get_user',
        status: authTime > 3000 ? 'warn' : 'ok',
        time_ms: authTime,
        detail: data.user ? `Authenticated: ${data.user.id.substring(0, 8)}...` : 'No user in session',
      });
    }
  } catch (err: any) {
    checks.push({
      name: 'auth_get_user',
      status: 'fail',
      time_ms: Date.now() - authStart,
      detail: err.message,
    });
  }

  // ── Check 4: Database query (profiles table) ──
  const dbStart = Date.now();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    const dbTime = Date.now() - dbStart;
    if (error) {
      checks.push({
        name: 'db_query_profiles',
        status: 'fail',
        time_ms: dbTime,
        detail: `DB error: ${error.message} (code: ${error.code})`,
      });
    } else {
      checks.push({
        name: 'db_query_profiles',
        status: dbTime > 3000 ? 'warn' : 'ok',
        time_ms: dbTime,
        detail: `Found ${data?.length ?? 0} rows (limit 1)`,
      });
    }
  } catch (err: any) {
    checks.push({
      name: 'db_query_profiles',
      status: 'fail',
      time_ms: Date.now() - dbStart,
      detail: err.message,
    });
  }

  // ── Check 5: Database query (themes table — public) ──
  const themesStart = Date.now();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('themes')
      .select('slug')
      .limit(1);

    const themesTime = Date.now() - themesStart;
    if (error) {
      checks.push({
        name: 'db_query_themes',
        status: 'fail',
        time_ms: themesTime,
        detail: `DB error: ${error.message} (code: ${error.code})`,
      });
    } else {
      checks.push({
        name: 'db_query_themes',
        status: themesTime > 3000 ? 'warn' : 'ok',
        time_ms: themesTime,
        detail: `Found ${data?.length ?? 0} rows (limit 1)`,
      });
    }
  } catch (err: any) {
    checks.push({
      name: 'db_query_themes',
      status: 'fail',
      time_ms: Date.now() - themesStart,
      detail: err.message,
    });
  }

  // ── Summary ──
  const total_time_ms = Date.now() - overall_start;
  const hasFails = checks.some((c) => c.status === 'fail');
  const hasWarns = checks.some((c) => c.status === 'warn');

  return NextResponse.json(
    {
      status: hasFails ? 'unhealthy' : hasWarns ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      total_time_ms,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co',
      region: process.env.VERCEL_REGION || 'unknown',
      checks,
      recommendations: [
        ...(hasFails
          ? ['❌ One or more checks failed. See details above.']
          : []),
        ...(total_time_ms > 5000
          ? [
              '⚠️ Total health check took >5s. The Supabase project may be paused or in a cold start.',
              '💡 Go to Supabase Dashboard → Project Settings and verify the project is active.',
              '💡 Consider upgrading the Supabase project region to match Vercel deployment region.',
            ]
          : []),
        ...(checks.some((c) => c.name === 'supabase_reachable' && c.time_ms > 2000)
          ? [
              '⚠️ Supabase endpoint is slow (>2s). Possible causes:',
              '  1. Project is waking up from paused state (Free tier pauses after 1 week of inactivity)',
              '  2. Region mismatch between Vercel and Supabase',
              '  3. Supabase infrastructure issues — check status.supabase.com',
            ]
          : []),
      ],
    },
    { status: hasFails ? 503 : 200 }
  );
}
