import { createClient } from '@supabase/supabase-js';

/**
 * Client con service role SENZA cookie di sessione: le richieste girano sempre
 * come amministratore, anche se il visitatore e' loggato. Da usare solo lato server.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
