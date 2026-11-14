/**
 * Rende sicuro un URL scritto da un utente prima di metterlo in un href.
 * - Ammessi solo http, https, mailto e tel.
 * - Se manca lo schema (es. "instagram.com/nome") aggiunge https://
 * - Qualsiasi altra cosa (javascript:, data:, vbscript:, ...) restituisce '#'.
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

export function safeUrl(raw: string | null | undefined): string {
  if (!raw) return '#';
  const value = raw.trim();
  if (!value) return '#';

  // Ha uno schema esplicito? (lettere + ":" prima di qualsiasi "/" o "?")
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);

  if (hasScheme) {
    try {
      const parsed = new URL(value);
      return ALLOWED_PROTOCOLS.includes(parsed.protocol.toLowerCase()) ? value : '#';
    } catch {
      return '#';
    }
  }

  // Nessuno schema: link relativo a protocollo "//dominio" oppure dominio nudo
  const candidate = value.startsWith('//') ? `https:${value}` : `https://${value}`;
  try {
    const parsed = new URL(candidate);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol.toLowerCase()) ? candidate : '#';
  } catch {
    return '#';
  }
}
