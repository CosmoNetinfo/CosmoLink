import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This is required to refresh the session token if it is expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // Protected routes: dashboard
  if (url.pathname.startsWith('/dashboard') && !user) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Auth pages: redirect to dashboard if already logged in
  if (url.pathname.startsWith('/auth') && user) {
    // Avoid redirecting the OAuth callback route
    if (!url.pathname.startsWith('/auth/callback')) {
      url.pathname = '/dashboard/links';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
