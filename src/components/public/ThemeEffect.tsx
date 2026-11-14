import type { ThemeEffect as Effect } from '@/types';

interface ThemeEffectProps {
  effect?: Effect;
  colors?: string[];
  accent: string;
}

/**
 * Effetto animato di sfondo dei temi PRO. Solo CSS: nessun JavaScript e rispetta
 * "riduci movimento" del dispositivo (vedi globals.css).
 */
export function ThemeEffect({ effect, colors, accent }: ThemeEffectProps) {
  if (!effect || effect === 'none') return null;

  const palette = colors && colors.length > 0 ? colors : [accent];
  const c = (i: number) => palette[i % palette.length];
  const vars = { '--fx-c1': c(0), '--fx-c2': c(1) } as React.CSSProperties;

  return (
    <div className="fx-layer" style={vars} aria-hidden="true">
      {effect === 'aurora' && (
        <>
          <div className="fx-aurora-band" style={{ top: '4%', background: c(0) }} />
          <div className="fx-aurora-band" style={{ top: '30%', background: c(1), animationDelay: '-6s', animationDuration: '24s' }} />
          <div className="fx-aurora-band" style={{ top: '55%', background: c(2), animationDelay: '-12s', animationDuration: '21s' }} />
        </>
      )}

      {effect === 'stars' && (
        <>
          <div className="fx-stars" />
          <div className="fx-stars-2" />
        </>
      )}

      {effect === 'grid' && <div className="fx-grid" />}

      {effect === 'grain' && <div className="fx-grain" />}

      {effect === 'orbs' && (
        <>
          <div className="fx-orb" style={{ top: '8%', left: '-10%', width: 420, height: 420, background: c(0) }} />
          <div className="fx-orb" style={{ bottom: '6%', right: '-12%', width: 480, height: 480, background: c(1), animationDelay: '-8s', animationDuration: '27s' }} />
          <div className="fx-orb" style={{ top: '45%', left: '35%', width: 300, height: 300, background: c(2), animationDelay: '-14s', animationDuration: '19s' }} />
        </>
      )}
    </div>
  );
}
