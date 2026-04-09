import { getAllGamesFromJSON } from '@/lib/games';
import GameRow from '@/components/GameRow';
import GameCard from '@/components/GameCard';
import Link from 'next/link';

interface Props {
  searchParams: Promise<{ search?: string; category?: string }>;
}

const CAT_ICONS: Record<string, string> = {
  RPG: '⚔️', FPS: '🔫', Action: '💥', Sandbox: '🧱',
  'Battle Royale': '🏆', Casual: '🎲', Simulation: '🌾', Horror: '👻',
  Sports: '⚽', Racing: '🏎️', Strategy: '♟️', Adventure: '🗺️',
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const allGames = getAllGamesFromJSON();

  const search = params.search?.toLowerCase() ?? '';
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
  const categories = [...new Set(allGames.map(g => g.category))];
  const featured   = allGames[0] ?? null;
  const isSearching = search || category;

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      {!isSearching && featured && (
        <div
          style={{
            position: 'relative',
            height: 'clamp(360px, 52vw, 520px)',
            overflow: 'hidden',
            marginBottom: '48px',
          }}
        >
          {/* Blurred BG */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${featured.image})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'blur(22px) brightness(0.28)',
              transform: 'scale(1.08)',
            }}
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,15,15,0.97) 0%, rgba(15,15,15,0.6) 55%, rgba(15,15,15,0.1) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #0f0f0f, transparent)' }} />

          {/* Content */}
          <div
            style={{
              position: 'relative', zIndex: 2,
              maxWidth: '1280px', margin: '0 auto',
              padding: 'clamp(2rem,5vw,3.5rem) 1.5rem',
              height: '100%',
              display: 'flex', alignItems: 'center', gap: '2.5rem',
            }}
          >
            {/* Cover art */}
            <img
              src={featured.image}
              alt={featured.title}
              style={{
                width: 'clamp(110px,14vw,160px)',
                aspectRatio: '3/4',
                objectFit: 'cover',
                borderRadius: '14px',
                border: '2px solid rgba(124,58,237,0.45)',
                boxShadow: '0 0 48px rgba(124,58,237,0.35)',
                flexShrink: 0,
              }}
            />

            {/* Text */}
            <div style={{ maxWidth: '520px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="badge badge-solid">⭐ Featured</span>
                <span className="badge badge-purple">{featured.category}</span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.08,
                  marginBottom: '14px',
                  letterSpacing: '-0.02em',
                }}
              >
                {featured.title}
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '24px', maxWidth: '440px' }}>
                {featured.description.slice(0, 130)}…
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href={`/download/${featured.id}`} className="btn-primary">
                  ⬇ Download Now
                </Link>
                <Link href={`/game/${featured.id}`} className="btn-ghost">
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ───────────────────────────────────────────── */}
      {!isSearching && allGames.length === 0 && (
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
          <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '8px' }}>No Games Yet</h2>
          <p style={{ color: 'var(--text3)', marginBottom: '24px' }}>Add your first game from the admin panel.</p>
          <Link href="/admin" className="btn-primary">Go to Admin Panel</Link>
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 60px' }}>

        {/* Ad banner */}
        {allGames.length > 0 && (
          /* INSERT PropellerAds banner (728×90) here */
          <div className="ad-placeholder" style={{ height: '80px', marginBottom: '40px' }}>
            Advertisement
          </div>
        )}

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
                <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</p>
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
            <GameRow title="🔥 Trending Now" games={trending} showBadge viewAllHref="/categories" />

            {/* Category grid */}
            <section style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>📂 Browse by Category</h2>
                <Link href="/categories" style={{ fontSize: '0.8rem', color: 'var(--purple-l)', fontWeight: 600, textDecoration: 'none', opacity: 0.85 }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {categories.slice(0, 8).map(cat => {
                  const count = allGames.filter(g => g.category === cat).length;
                  return (
                    <Link key={cat} href={`/?category=${cat}`} style={{ textDecoration: 'none' }}>
                      <div
                        className="game-card"
                        style={{
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '14px',
                          padding: '20px 12px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{CAT_ICONS[cat] ?? '🎮'}</div>
                        <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '3px' }}>{cat}</p>
                        <p style={{ color: 'var(--text3)', fontSize: '0.68rem' }}>{count} game{count !== 1 ? 's' : ''}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <GameRow title="🆕 Recently Added" games={latest} viewAllHref="/categories" />

            {topDL.some(g => (g.downloads ?? 0) > 0) && (
              <GameRow title="⬇ Most Downloaded" games={topDL} viewAllHref="/categories" />
            )}

            {lowEnd.length > 0 && (
              <GameRow title="💻 Low-End PC" games={lowEnd} viewAllHref="/categories" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
