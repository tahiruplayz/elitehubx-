import GameCard from './GameCard';
import type { Game } from '@/lib/games';
import Link from 'next/link';

interface Props {
  title: string;
  icon?: React.ReactNode;
  games: Game[];
  showBadge?: boolean;
  viewAllHref?: string;
}

export default function GameRow({ title, icon, games, showBadge, viewAllHref }: Props) {
  if (games.length === 0) return null;
  return (
    <section style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          {icon && <span style={{ color: 'var(--purple-l)', display: 'flex' }}>{icon}</span>}
          {title}
        </h2>
        {viewAllHref && (
          <Link href={viewAllHref} style={{ fontSize: '0.8rem', color: 'var(--purple-l)', fontWeight: 600, textDecoration: 'none', opacity: 0.85 }}>
            View all →
          </Link>
        )}
      </div>
      <div className="scroll-row">
        {games.map((g, i) => (
          <GameCard key={g.id} game={g} showBadge={showBadge && i === 0} />
        ))}
      </div>
    </section>
  );
}
