import { getAllGamesFromJSON } from '@/lib/games';
import { dbGetAllGames } from '@/lib/db';
import GameRow from '@/components/GameRow';
import GameCard from '@/components/GameCard';
import Link from 'next/link';
import {
  Download, Info, Gamepad2, Folder, TrendingUp, Clock,
  ArrowDownToLine, Monitor, Swords, Crosshair, Zap, Box,
  Trophy, Dice5, Leaf, Ghost, CircleDot, Car, Brain, Map,
} from 'lucide-react';

interface Props {
  searchParams: Promise<{ search?: string; category?: string }>;
}

const CAT_ICONS: Record<string, React.ReactNode> = {
  RPG:            <Swords size={22} />,
  FPS:            <Crosshair size={22} />,
  Action:         <Zap size={22} />,
  Sandbox:        <Box size={22} />,
  'Battle Royale':<Trophy size={22} />,
  Casual:         <Dice5 size={22} />,
  Simulation:     <Leaf size={22} />,
  Horror:         <Ghost size={22} />,
  Sports:         <CircleDot size={22} />,
  Racing:         <Car size={22} />,
  Strategy:       <Brain size={22} />,
  Adventure:      <Map size={22} />,
};

export const revalidate = 60;

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;

  let allGames = getAllGamesFromJSON();
  try {
    const dbGames = await dbGetAllGames();
    if (dbGames.length > 0) allGames = dbGames;
  } catch { /* JSON fallback */ }

  const search   = params.search?.toLowerCase() ?? '';
  const category = params.category ?? '';

  const filtered = allGames.filter(g => {
    const matchSearch = !search ||
      g.title.toLowerCase().includes(search) ||
      g.tags.some(t => t.toLowerCase().includes(search)) ||
      g.category.toLowerCase().includes(search);
    const matchCat = !category || g.category === category;
    return matchSearch && matchCat;
  });

  const trending   = filtered.slice(0, 10);
  const latest     = [...filtered].reverse().slice(0, 10);
  const topDL      = [...filtered].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 10);
  const lowEnd     = filtered.filter(g => {
    const u = g.size.toLowerCase();
    return u.includes('mb') || (u.includes('gb') && parseFloat(g.size) <= 5);
  });
  const categories  = [...new Set(allGames.map(g => g.category))];
  const featured    = allGames[0] ?? null;
  const isSearching = search || category;

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      {!isSearching && featured && (
        <div style={{ position: 'relative', height: 'clamp(360px, 52vw, 520px)', overflow: 'hidden', marginBottom: '48px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${featured.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(22px) brightness(0.28)', transform: 'scale(1.08)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,15,15,0.97) 0%, rgba(15,15,15,0.6) 55%, rgba(15,15,15,0.1) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #0f0f0f, transparent)' }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2rem,5vw,3.5rem) 1.5rem', height: '100%', display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <img src={featured.image} alt={featured.title}
              style={{ width: 'clamp(110px,14vw,160px)', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '14px', border: '2px solid rgba(124,58,237,0.45)', boxShadow: '0 0 48px rgba(124,58,237,0.35)', flexShrink: 0 }}
            />
            <div style={{ maxWidth: '520px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="badge badge-solid">Featured</span>
                <span className="badge badge-purple">{featured.category}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.08, marginBottom: '14px', letterSpacing: '-0.02em' }}>
                {featured.title}
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '24px', maxWidth: '440px' }}>
                {featured.description.slice(0, 130)}…
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href={`/download/${featured.id}`} className="btn-primary">
                  <Download size={15} /> Download Now
                </Link>
                <Link href={`/game/${featured.id}`} className="btn-ghost">
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

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 60px' }}>

        {/* Search results */}
        {isSearching && (
          <>
            {search && (
              <p style={{ color: 'var(--text2)', marginBottom: '20px', fontSize: '0.9rem' }}>
                Results for <span style={{ color: 'var(--purple-l)', fontWeight: 700 }}>&quot;{search}&quot;</span> — {filtered.length} found
              </p>
            )}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text3)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <Gamepad2 size={48} strokeWidth={1.2} />
                </div>
                <p>No games found. Try a different search.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '16px' }}>
                {filtered.map((g, i) => <GameCard key={g.id} game={g} showBadge={i === 0} />)}
              </div>
            )}
          </>
        )}

        {/* Home sections */}
        {!isSearching && allGames.length > 0 && (
          <>
            <GameRow title="Trending Now" icon={<TrendingUp size={18} />} games={trending} showBadge viewAllHref="/categories" />

            {/* Category grid */}
            <section style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  <Folder size={18} style={{ color: 'var(--purple-l)' }} /> Browse by Category
                </h2>
                <Link href="/categories" style={{ fontSize: '0.8rem', color: 'var(--purple-l)', fontWeight: 600, textDecoration: 'none', opacity: 0.85 }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {categories.slice(0, 8).map(cat => {
                  const count = allGames.filter(g => g.category === cat).length;
                  return (
                    <Link key={cat} href={`/?category=${cat}`} style={{ textDecoration: 'none' }}>
                      <div className="game-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: 'var(--purple-l)' }}>
                          {CAT_ICONS[cat] ?? <Gamepad2 size={22} />}
                        </div>
                        <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '3px' }}>{cat}</p>
                        <p style={{ color: 'var(--text3)', fontSize: '0.68rem' }}>{count} game{count !== 1 ? 's' : ''}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <GameRow title="Recently Added" icon={<Clock size={18} />} games={latest} viewAllHref="/categories" />

            {topDL.some(g => (g.downloads ?? 0) > 0) && (
              <GameRow title="Most Downloaded" icon={<ArrowDownToLine size={18} />} games={topDL} viewAllHref="/categories" />
            )}

            {lowEnd.length > 0 && (
              <GameRow title="Low-End PC" icon={<Monitor size={18} />} games={lowEnd} viewAllHref="/categories" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
