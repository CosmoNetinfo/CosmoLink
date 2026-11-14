import { createBrowserClient } from '@supabase/ssr';

// Durante la build delle anteprime Vercel le variabili Supabase possono mancare: i valori di
// riserva servono solo a far finire la build. In produzione le variabili ci sono sempre.
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-anon-key';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY
  );
}
