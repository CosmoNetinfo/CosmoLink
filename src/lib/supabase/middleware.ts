import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Diagnostic middleware for Supabase session refresh.
 * Includes timing, timeout protection, and detailed error reporting
 * to diagnose MIDDLEWARE_INVOCATION_TIMEOUT (504) errors.
 */

// Timeout wrapper: rejects after `ms` milliseconds
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`TIMEOUT: "${label}" exceeded ${ms}ms`));
    }, ms);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function updateSession(request: NextRequest) {
  const startTime = Date.now();
  const diagnostics: { step: string; elapsed: number; status: string; detail?: string }[] = [];

  function logStep(step: string, status: string, detail?: string) {
    diagnostics.push({
      step,
      elapsed: Date.now() - startTime,
      status,
      detail,
    });
  }

  try {
    // ── Step 1: Validate environment variables ──
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      logStep('env_check', 'FAIL', `URL=${!!supabaseUrl}, KEY=${!!supabaseAnonKey}`);
      console.error('[CosmoLink Middleware] ❌ Missing env vars', diagnostics);

      // Return a diagnostic JSON response instead of crashing
      return NextResponse.json(
        {
          error: 'Server configuration error',
          code: 'MISSING_ENV_VARS',
          diagnostics,
        },
        { status: 500 }
      );
    }
    logStep('env_check', 'OK', `URL=${supabaseUrl.substring(0, 30)}...`);

    // ── Step 2: Create Supabase client ──
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });
    logStep('create_client', 'OK');

    // ── Step 3: Refresh session (with 8s timeout) ──
    // This is the most common point of failure — it makes an HTTP call to Supabase
    let user = null;
    try {
      const { data, error: authError } = await withTimeout(
        supabase.auth.getUser(),
        8000,
        'supabase.auth.getUser()'
      );

      if (authError) {
        logStep('get_user', 'AUTH_ERROR', `${authError.message} (code: ${authError.status})`);
        // Auth error is not fatal — user is just not logged in
      } else {
        user = data?.user ?? null;
        logStep('get_user', 'OK', user ? `uid=${user.id.substring(0, 8)}...` : 'no_session');
      }
    } catch (timeoutErr: any) {
      logStep('get_user', 'TIMEOUT', timeoutErr.message);
      console.error('[CosmoLink Middleware] ⏱️ getUser() timed out', {
        url: request.nextUrl.pathname,
        diagnostics,
      });

      // On timeout: let the request through without auth
      // This prevents 504s — the page itself will handle auth state
      const url = request.nextUrl.clone();
      if (url.pathname.startsWith('/dashboard')) {
        // Can't verify auth — redirect to login with error
        url.pathname = '/auth/login';
        url.searchParams.set('error', 'session_timeout');
        return NextResponse.redirect(url);
      }
      // For non-protected routes, just pass through
      return supabaseResponse;
    }

    // ── Step 4: Route protection logic ──
    const url = request.nextUrl.clone();

    // Protected routes: dashboard
    if (url.pathname.startsWith('/dashboard') && !user) {
      logStep('route_guard', 'REDIRECT', 'dashboard → login (no user)');
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }

    // Auth pages: redirect to dashboard if already logged in
    if (url.pathname.startsWith('/auth') && user) {
      if (!url.pathname.startsWith('/auth/callback')) {
        logStep('route_guard', 'REDIRECT', 'auth → dashboard (has user)');
        url.pathname = '/dashboard/links';
        return NextResponse.redirect(url);
      }
    }

    logStep('route_guard', 'PASS', url.pathname);

    // ── Step 5: Add diagnostic headers (only in dev or when slow) ──
    const totalTime = Date.now() - startTime;
    supabaseResponse.headers.set('x-middleware-time', `${totalTime}ms`);

    if (totalTime > 3000) {
      console.warn('[CosmoLink Middleware] ⚠️ Slow middleware execution', {
        totalTime: `${totalTime}ms`,
        url: request.nextUrl.pathname,
        diagnostics,
      });
    }

    return supabaseResponse;
  } catch (unexpectedError: any) {
    // ── Catch-all: never let the middleware crash ──
    logStep('unexpected_error', 'FATAL', unexpectedError.message);
    console.error('[CosmoLink Middleware] 💥 Unexpected error', {
      error: unexpectedError.message,
      stack: unexpectedError.stack,
      url: request.nextUrl.pathname,
      diagnostics,
    });

    // Return a pass-through response instead of crashing
    return NextResponse.next({ request });
  }
}
