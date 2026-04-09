import { getAllGamesFromJSON, getGameById } from '@/lib/games';
import { dbGetAllGames, dbGetGameById } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import GameCard from '@/components/GameCard';
import GameDetailClient from './GameDetailClient';
import type { Game } from '@/lib/games';

interface Props { params: Promise<{ id: string }> }

export const revalidate = 60;

async function getGame(id: string): Promise<Game | null> {
  try {
    const g = await dbGetGameById(id);
    if (g) return g;
  } catch { /* fallback */ }
  return getGameById(id) ?? null;
}

async function getAllGames(): Promise<Game[]> {
  try {
    const games = await dbGetAllGames();
    if (games.length > 0) return games;
  } catch { /* fallback */ }
  return getAllGamesFromJSON();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) return { title: 'Game Not Found' };
  return {
    title: `${game.title} – Download`,
    description: game.description.slice(0, 155),
    openGraph: { title: game.title, description: game.description.slice(0, 155), images: [game.image] },
  };
}

export async function generateStaticParams() {
  return getAllGamesFromJSON().map(g => ({ id: g.id }));
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();

  const allGamesData = await getAllGames();
  const related = allGamesData.filter(g => g.id !== id && g.category === game.category).slice(0, 8);

  const rating = (3.5 + (parseInt(game.id) % 15) * 0.1).toFixed(1);
  const stars  = Math.round(parseFloat(rating));
  const isNew  = game.createdAt
    ? Date.now() - new Date(game.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;
  const isPopular = (game.downloads ?? 0) > 50;

  return (
    <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 64px' }}>
      <GameDetailClient gameId={id} />

      {/* ── BANNER ──────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(240px, 38vw, 380px)',
          borderRadius: '18px',
          overflow: 'hidden',
          marginBottom: '32px',
          border: '1px solid var(--border)',
        }}
      >
        <img src={game.image} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0.4) 55%, transparent 100%)' }} />

        <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {isNew     && <span className="badge badge-green">New</span>}
            {isPopular && <span className="badge badge-amber">Popular</span>}
            <span className="badge badge-solid">⭐ Top Rated</span>
            <span className="badge badge-purple">{game.category}</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {game.title}
          </h1>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>📦 {game.size}</span>
            {(game.views ?? 0) > 0 && <span style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>👁 {game.views?.toLocaleString()} views</span>}
            {(game.downloads ?? 0) > 0 && <span style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>⬇ {game.downloads?.toLocaleString()} downloads</span>}
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px', alignItems: 'start' }}>

        {/* Left column */}
        <div>
          {/* Rating */}
          <div
            className="card"
            style={{ padding: '14px 18px', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: '1rem', color: s <= stars ? '#f59e0b' : '#2a2a2a' }}>★</span>
              ))}
            </div>
            <span style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1rem' }}>{rating}</span>
            <span style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>/ 5.0</span>
          </div>

          {/* About */}
          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <p style={{ color: 'var(--purple-l)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              About this game
            </p>
            <p style={{ color: 'var(--text2)', lineHeight: 1.75, fontSize: '0.92rem' }}>{game.description}</p>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {game.tags.map(tag => (
              <Link
                key={tag}
                href={`/?search=${tag}`}
                className="badge badge-purple"
                style={{ textDecoration: 'none', textTransform: 'lowercase', fontSize: '0.75rem', padding: '5px 12px' }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Right column — CTA */}
        <div className="card" style={{ padding: '22px', textAlign: 'center', position: 'sticky', top: '80px' }}>
          <img
            src={game.image}
            alt={game.title}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--border)' }}
          />
          <p style={{ color: 'var(--text3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>File Size</p>
          <p style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '18px' }}>{game.size}</p>
          <Link href={`/download/${game.id}`} className="btn-primary" style={{ width: '100%', marginBottom: '10px' }}>
            ⬇ Download Game
          </Link>
          <p style={{ color: 'var(--text3)', fontSize: '0.7rem', lineHeight: 1.5 }}>
            Redirects to official source
          </p>
        </div>
      </div>

      {/* ── RELATED ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2 className="section-title">More {game.category} Games</h2>
          <div className="scroll-row">
            {related.map(g => <GameCard key={g.id} game={g} />)}
          </div>
        </div>
      )}
    </div>
  );
}
