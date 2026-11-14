'use client';

/**
 * Resize and compress an image file to a 200×200 JPEG before uploading.
 * Returns a Blob ready for Supabase Storage.
 */
export async function resizeAvatar(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;

      const ctx = canvas.getContext('2d')!;

      // Center-crop: take the largest square from the center
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;

      ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create avatar blob'));
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = reject;

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a resized avatar blob to Supabase Storage.
 */
export async function uploadAvatar(
  supabase: ReturnType<typeof import('@/lib/supabase/client').createClient>,
  userId: string,
  file: File
): Promise<string> {
  const blob = await resizeAvatar(file);
  const filePath = `${userId}/avatar.jpg`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, blob, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  // Add cache buster
  return `${data.publicUrl}?t=${Date.now()}`;
}

/**
 * Icona personalizzata di un link: quadrata 128x128 PNG, mantiene la trasparenza.
 * Se l'immagine non e' quadrata viene centrata senza deformarla.
 */
export async function resizeLinkIcon(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const scale = Math.min(128 / img.width, 128 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (128 - w) / 2, (128 - h) / 2, w, h);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Impossibile creare l\'icona'))),
        'image/png'
      );
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadLinkIcon(
  supabase: ReturnType<typeof import('@/lib/supabase/client').createClient>,
  userId: string,
  linkId: string,
  file: File
): Promise<string> {
  const blob = await resizeLinkIcon(file);
  const filePath = `${userId}/link-icons/${linkId}-${Date.now()}.png`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, blob, { contentType: 'image/png' });
  if (error) throw error;
  return supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl;
}
