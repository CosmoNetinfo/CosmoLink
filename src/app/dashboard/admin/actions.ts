'use server';

import { revalidatePath } from 'next/cache';
import { checkIsAdmin } from '@/app/dashboard/actions';
import { createServiceClient } from '@/lib/supabase/service';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Attiva o toglie il piano PRO a un utente. Solo per gli admin (ADMIN_EMAILS).
 * Usa la service role, l'unica che puo' modificare il piano (vedi migrazione 010).
 */
export async function setUserPlan(formData: FormData): Promise<void> {
  if (!(await checkIsAdmin())) return;

  const userId = String(formData.get('user_id') ?? '');
  const plan = String(formData.get('plan') ?? '');

  if (!UUID_RE.test(userId) || (plan !== 'pro' && plan !== 'free')) return;

  const service = createServiceClient();
  const { error } = await service.from('profiles').update({ plan }).eq('id', userId);
  if (error) console.error('setUserPlan failed', error);

  revalidatePath('/dashboard/admin');
}
