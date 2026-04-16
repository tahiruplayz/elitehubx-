import { getAllGamesFromJSON } from '@/lib/games';
import { isLowEnd } from '@/lib/types';
import { dbGetAllGames } from '@/lib/db';
import GameRow from '@/components/GameRow';
import GameCard from '@/components/GameCard';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Download, Info, Gamepad2, Folder, TrendingUp, Clock,
  ArrowDownToLine, Monitor, Swords, Crosshair, Zap, Box,
  Trophy, Dice5, Leaf, Ghost, CircleDot, Car, Brain, Map, Search,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free PC Games Download | Low End PC Games | EliteHubX',
  description: 'Download free PC games for low-end and high-end PCs. Trending games, popular titles, and games for 2GB/4GB RAM. Free download, no hosting.',
};

interface Props {
  searchParams: Promise<{ search?: string; category?: string }>;
}

const CAT_ICONS: Record<string, React.ReactNode> = {
  RPG: <Swords size={24} />, FPS: <Crosshair size={24} />, Action: <Zap size={24} />,
  Sandbox: <Box size={24} />, 'Battle Royale': <Trophy size={24} />, Casual: <Dice5 size={24} />,
  Simulation: <Leaf size={24} />, Horror: <Ghost size={24} />, Sports: <CircleDot size={24} />,
  Racing: <Car size={24} />, Strategy: <Brain size={24} />, Adventure: <Map size={24} />,
  'Open World': <Map size={24} />, Multiplayer: <Trophy size={24} />,
};

export const revalidate = 60;

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;

  let allGames = getAllGamesFromJSON();
  try {
    const db = await dbGetAllGames();
    if (db.length > 0) allGames = db;
  } catch { /* JSON fallback */ }

  const search   = params.search?.toLowerCase() ?? '';
  const category = params.category ?? '';

  const filtered = allGames.filter(g => {
    const ms = !search || g.title.toLowerCase().includes(search) ||
      g.tags.some(t => t.toLowerCase().includes(search)) ||
      g.category.toLowerCase().includes(search);
    return ms && (!category || g.category === category);
  });

  const trending   = filtered.slice(0, 12);
  const latest     = [...filtered].reverse().slice(0, 12);
  const popular    = [...filtered].sort((a, b) => ((b.views ?? 0) + (b.downloads ?? 0) * 3) - ((a.views ?? 0) + (a.downloads ?? 0) * 3)).slice(0, 12);
  const lowEndGames = filtered.filter(g => isLowEnd(g)).slice(0, 12);
  const categories = [...new Set(allGames.map(g => g.category))];
  const featured   = allGames[0] ?? null;
  const isSearching = search || category;

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      {!isSearching && featured && (
        <div style={{ position: 'relative', height: 'clamp(380px, 55vw, 540px)', overflow: 'hidden', marginBottom: '56px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${featured.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(24px) brightness(0.25)', transform: 'scale(1.1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.75) 50%, rgba(124,58,237,0.08) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to top, #0f0f0f, transparent)' }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2.5rem,6vw,4rem) 1.5rem', height: '100%', display: 'flex', alignItems: 'center', gap: '3rem' }} className="hero-content">
            {/* Cover */}
            <div style={{ position: 'relative', flexShrink: 0 }} className="hero-cover-wrap">
              <img src={featured.image} alt={featured.title} className="hero-cover"
                style={{ width: 'clamp(120px,15vw,175px)', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '16px', border: '2px solid rgba(124,58,237,0.5)', boxShadow: '0 0 60px rgba(124,58,237,0.4), 0 20px 40px rgba(0,0,0,0.6)' }}
              />
              {isLowEnd(featured) && (
                <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                  LOW-END FRIENDLY
                </div>
              )}
            </div>

            {/* Text */}
            <div style={{ maxWidth: '560px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="badge badge-solid">Featured</span>
                <span className="badge badge-purple">{featured.category}</span>
                {(featured.downloads ?? 0) > 0 && (
                  <span className="badge badge-amber">{(featured.downloads ?? 0).toLocaleString()} downloads</span>
                )}
              </div>
              <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: '16px', letterSpacing: '-0.03em' }}>
                {featured.title}
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.97rem', lineHeight: 1.7, marginBottom: '28px', maxWidth: '460px' }}>
                {featured.description.slice(0, 140)}…
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href={`/download/${featured.id}`} className="btn-primary" style={{ fontSize: '1rem', padding: '12px 28px' }}>
                  <Download size={16} /> Download Now
                </Link>
                <Link href={`/game/${featured.id}`} className="btn-ghost" style={{ fontSize: '0.95rem' }}>
                  <Info size={15} /> More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ───────────────────────────────────────── */}
      {!isSearching && allGames.length === 0 && (
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--text3)' }}>
            <Gamepad2 size={56} strokeWidth={1.2} />
          </div>
          <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '8px' }}>No Games Yet</h2>
          <p style={{ color: 'var(--text3)', marginBottom: '24px' }}>Add your first game from the admin panel.</p>
          <Link href="/admin" className="btn-primary">Go to Admin Panel</Link>
        </div>
      )}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 80px' }}>

        {/* ── SEARCH RESULTS ────────────────────────────────── */}
        {isSearching && (
          <>
            {search && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <Search size={16} color="var(--purple-l)" />
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
                  Results for <span style={{ color: 'var(--purple-l)', fontWeight: 700 }}>&quot;{search}&quot;</span>
                  <span style={{ color: 'var(--text3)', marginLeft: '8px' }}>— {filtered.length} game{filtered.length !== 1 ? 's' : ''} found</span>
                </p>
              </div>
            )}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text3)' }}>
                <Gamepad2 size={48} strokeWidth={1.2} style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ marginBottom: '8px' }}>No games found for &quot;{search}&quot;</p>
                <p style={{ fontSize: '0.85rem' }}>Try searching for a genre, like &quot;action&quot; or &quot;fps&quot;</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' }} className="search-grid">
                {filtered.map((g, i) => <GameCard key={g.id} game={g} showBadge={i === 0} />)}
              </div>
            )}
          </>
        )}

        {/* ── HOME SECTIONS ─────────────────────────────────── */}
        {!isSearching && allGames.length > 0 && (
          <>
            {/* Trending */}
            <GameRow title="Trending Now" icon={<TrendingUp size={18} />} games={trending} showBadge viewAllHref="/categories" />

            {/* Low-End PC — prominent section */}
            {lowEndGames.length > 0 && (
              <section style={{ marginBottom: '48px' }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(34,197,94,0.05))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <Monitor size={20} color="#22c55e" />
                        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem', margin: 0 }}>Low-End PC Games</h2>
                        <span style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', border: '1px solid rgba(34,197,94,0.3)' }}>
                          Works on 2GB–4GB RAM
                        </span>
                      </div>
                      <p style={{ color: 'var(--text3)', fontSize: '0.83rem', margin: 0 }}>
                        Games that run smoothly on low-spec PCs and laptops
                      </p>
                    </div>
                    <Link href="/categories" style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}>
                      View all →
                    </Link>
                  </div>
                </div>
                <div className="scroll-row">
                  {lowEndGames.map(g => <GameCard key={g.id} game={g} />)}
                </div>
              </section>
            )}

            {/* Category grid */}
            <section style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  <Folder size={18} style={{ color: 'var(--purple-l)' }} /> Browse by Category
                </h2>
                <Link href="/categories" style={{ fontSize: '0.8rem', color: 'var(--purple-l)', fontWeight: 600, textDecoration: 'none', opacity: 0.85 }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }} className="cat-grid">
                {categories.slice(0, 8).map(cat => {
                  const count = allGames.filter(g => g.category === cat).length;
                  return (
                    <Link key={cat} href={`/?category=${cat}`} style={{ textDecoration: 'none' }}>
                      <div className="game-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'var(--purple-l)' }}>
                          {CAT_ICONS[cat] ?? <Gamepad2 size={24} />}
                        </div>
                        <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.83rem', marginBottom: '4px' }}>{cat}</p>
                        <p style={{ color: 'var(--text3)', fontSize: '0.68rem' }}>{count} game{count !== 1 ? 's' : ''}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Popular */}
            {popular.some(g => (g.views ?? 0) > 0 || (g.downloads ?? 0) > 0) && (
              <GameRow title="Most Popular" icon={<ArrowDownToLine size={18} />} games={popular} viewAllHref="/categories" />
            )}

            {/* Recently Added */}
            <GameRow title="Recently Added" icon={<Clock size={18} />} games={latest} viewAllHref="/categories" />
          </>
        )}
      </div>
    </div>
  );
}
