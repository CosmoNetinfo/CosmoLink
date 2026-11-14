/**
 * Costanti del sito: un solo punto da cambiare (dominio, contatti, prezzi).
 *
 * SITE_URL: imposta NEXT_PUBLIC_SITE_URL su Vercel quando avrai un dominio tuo
 * (es. https://cosmolink.it). Finche' non c'e', si usa l'indirizzo Vercel attuale.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://cosmo-link.vercel.app'
).replace(/\/$/, '');

export const WHATSAPP_NUMBER = '393517064080';

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Metti false per nascondere il banner "Offerta lancio" nella home. */
export const LAUNCH_OFFER_ACTIVE = true;

/** Prezzi in un unico posto: home e /pricing leggono da qui. */
export const PRICING = {
  monthly: { price: '€4,99', period: 'al mese' },
  yearly: { price: '€39,99', period: "all'anno", perMonth: '€3,33', saving: '€20' },
  launch: { price: '€29,99' },
} as const;
