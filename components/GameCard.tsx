import Link from 'next/link';
import type { Game } from '@/lib/types';
import { isLowEnd } from '@/lib/types';
import GameImage from './GameImage';
import { Monitor, Flame, Sparkles } from 'lucide-react';

interface Props {
  game: Game;
  showBadge?: boolean;
  wide?: boolean;
}

export default function GameCard({ game, showBadge, wide }: Props) {
  const isNew     = game.createdAt
    ? Date.now() - new Date(game.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;
  const isPopular = (game.downloads ?? 0) > 50 || (game.views ?? 0) > 200;
  const lowEnd    = isLowEnd(game);
  const w         = wide ? 220 : 195;

  const badge = isNew
    ? { label: 'New', cls: 'badge-green', icon: <Sparkles size={9} /> }
    : isPopular
    ? { label: 'Hot', cls: 'badge-amber', icon: <Flame size={9} /> }
    : showBadge
    ? { label: 'Top', cls: 'badge-solid', icon: null }
    : null;

  return (
    <Link href={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="game-card"
        style={{
          width: `${w}px`,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top-left badge */}
        {badge && (
          <span className={`badge ${badge.cls}`}
            style={{ position: 'absolute', top: '9px', left: '9px', zIndex: 10 }}>
            {badge.icon}{badge.label}
          </span>
        )}

        {/* Low-End badge top-right */}
        {lowEnd && (
          <span className="badge badge-low"
            style={{ position: 'absolute', top: '9px', right: '9px', zIndex: 10, fontSize: '0.58rem', padding: '2px 7px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Monitor size={9} /> LOW-END
          </span>
        )}

        {/* Cover image */}
        <div style={{ height: wide ? '150px' : '138px', overflow: 'hidden', background: '#0d0d14', position: 'relative' }}>
          <GameImage src={game.image} alt={game.title} />
          {/* Subtle gradient at bottom of image */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to top, rgba(22,22,30,0.7), transparent)', pointerEvents: 'none' }} />
        </div>

        {/* Info */}
        <div style={{ padding: '11px 13px 13px' }}>
          <p style={{
            fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)',
            marginBottom: '7px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}>
            {game.title}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.6rem' }}>{game.category}</span>
            <span style={{ color: 'var(--text3)', fontSize: '0.67rem', fontWeight: 500 }}>{game.size}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
