import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const response = await updateSession(request);
  const elapsed = Date.now() - start;

  // Log slow middleware invocations for debugging
  if (elapsed > 2000) {
    console.warn(`[CosmoLink] ⚠️ Slow middleware: ${request.nextUrl.pathname} took ${elapsed}ms`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images in public directory
     * - api/health (diagnostic endpoint, skip auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/health|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
