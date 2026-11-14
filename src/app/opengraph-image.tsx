import { ImageResponse } from 'next/og';

export const alt = 'CosmoLink — Il tuo universo di link';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: 'linear-gradient(135deg, #0b0b14 0%, #2d1b69 60%, #0e7490 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, color: '#c4b5fd', display: 'flex' }}>CosmoLink</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24, display: 'flex' }}>
          Tutti i tuoi link in una sola pagina
        </div>
        <div style={{ fontSize: 34, marginTop: 32, color: '#e0e7ff', display: 'flex' }}>
          Gratis. Temi, statistiche e QR Code.
        </div>
      </div>
    ),
    size
  );
}
