import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CosmoLink',
    short_name: 'CosmoLink',
    description: 'CosmoLink è la piattaforma link-in-bio definitiva: personalizza la tua pagina, condividi i tuoi link in stile cosmico.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f18',
    theme_color: '#6c5ce7',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
