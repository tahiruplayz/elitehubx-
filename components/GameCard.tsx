import Link from 'next/link';
import type { Game } from '@/lib/types';
import { isLowEnd } from '@/lib/types';
import GameImage from './GameImage';
import { Monitor } from 'lucide-react';

interface Props {
  game: Game;
  showBadge?: boolean;
}

export default function GameCard({ game, showBadge }: Props) {
  const isNew     = game.createdAt
    ? Date.now() - new Date(game.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;
  const isPopular = (game.downloads ?? 0) > 50;
  const lowEnd    = isLowEnd(game);

  const badge = isNew
    ? { label: 'New', cls: 'badge-green' }
    : isPopular
    ? { label: 'Popular', cls: 'badge-amber' }
    : showBadge
    ? { label: 'Top', cls: 'badge-solid' }
    : null;

  return (
    <Link href={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="game-card"
        style={{
          width: '190px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {badge && (
          <span className={`badge ${badge.cls}`} style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
            {badge.label}
          </span>
        )}

        {/* Low-End badge */}
        {lowEnd && (
          <span style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, background: 'rgba(34,197,94,0.9)', color: 'white', fontSize: '0.58rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', letterSpacing: '0.03em' }}>
            <Monitor size={9} /> LOW-END
          </span>
        )}

        <div style={{ height: '135px', overflow: 'hidden', background: '#111' }}>
          <GameImage src={game.image} alt={game.title} />
        </div>

        <div style={{ padding: '10px 12px 13px' }}>
          <p style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text)', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {game.title}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.62rem' }}>{game.category}</span>
            <span style={{ color: 'var(--text3)', fontSize: '0.68rem', fontWeight: 500 }}>{game.size}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
