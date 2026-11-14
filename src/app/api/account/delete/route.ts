import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export const runtime = 'nodejs';

/**
 * Cancella DEFINITIVAMENTE l'account di chi e' loggato: utente, profilo, link e
 * statistiche (le tabelle collegate hanno ON DELETE CASCADE) piu' le immagini caricate.
 * Richiede di riscrivere il proprio username come conferma.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Devi essere loggato.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const confirm = typeof body?.confirm === 'string' ? body.confirm : '';

  const service = createServiceClient();

  const { data: profile } = await service
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || confirm !== profile.username) {
    return NextResponse.json(
      { error: 'Per confermare scrivi esattamente il tuo username.' },
      { status: 400 }
    );
  }

  // Immagini caricate (avatar e sfondi): se qualcosa va storto non blocca la cancellazione
  try {
    const { data: files } = await service.storage.from('avatars').list(user.id, { limit: 1000 });
    if (files && files.length > 0) {
      await service.storage.from('avatars').remove(files.map((f) => `${user.id}/${f.name}`));
    }
  } catch (err) {
    console.error('Account delete: storage cleanup failed', err);
  }

  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) {
    console.error('Account delete failed', error);
    return NextResponse.json(
      { error: 'Non sono riuscito a cancellare l\'account. Scrivici e lo facciamo noi.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
