'use client';
import { useState, useMemo } from 'react';
import type { Game } from '@/lib/games';
import GameCard from '@/components/GameCard';

export default function CategoriesClient({ games }: { games: Game[] }) {
  const [selectedCat,  setSelectedCat]  = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search,       setSearch]       = useState('');

  const categories = useMemo(() => [...new Set(games.map(g => g.category))].sort(), [games]);
  const allTags    = useMemo(() => [...new Set(games.flatMap(g => g.tags))].sort(), [games]);

  const filtered = useMemo(() => games.filter(g => {
    const matchCat    = !selectedCat  || g.category === selectedCat;
    const matchTags   = selectedTags.length === 0 || selectedTags.every(t => g.tags.includes(t));
    const matchSearch = !search || g.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchTags && matchSearch;
  }), [games, selectedCat, selectedTags, search]);

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const Pill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: '999px',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        border: active ? 'none' : '1px solid var(--border)',
        background: active ? 'linear-gradient(135deg, var(--purple), var(--purple2))' : 'transparent',
        color: active ? '#fff' : 'var(--text2)',
        transition: 'all 0.18s ease',
        textAlign: 'left' as const,
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px 64px' }} className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
          Browse Games
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>
          {filtered.length} game{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside
          className="card"
          style={{ padding: '20px', position: 'sticky', top: '76px' }}
        >
          {/* Search */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'var(--text3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Search
            </p>
            <input
              className="input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by name…"
            />
          </div>

          {/* Categories */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'var(--text3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
              Category
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Pill label="All" active={!selectedCat} onClick={() => setSelectedCat('')} />
              {categories.map(cat => (
                <Pill key={cat} label={cat} active={selectedCat === cat} onClick={() => setSelectedCat(cat === selectedCat ? '' : cat)} />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p style={{ color: 'var(--text3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
              Tags
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {allTags.map(tag => (
                <Pill key={tag} label={`#${tag}`} active={selectedTags.includes(tag)} onClick={() => toggleTag(tag)} />
              ))}
            </div>
          </div>

          {/* Clear */}
          {(selectedCat || selectedTags.length > 0 || search) && (
            <button
              onClick={() => { setSelectedCat(''); setSelectedTags([]); setSearch(''); }}
              style={{ marginTop: '16px', width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
            >
              Clear Filters
            </button>
          )}
        </aside>

        {/* ── Grid ────────────────────────────────────────────── */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text3)' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</p>
              <p>No games match your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '16px' }}>
              {filtered.map((g, i) => <GameCard key={g.id} game={g} showBadge={i < 3} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
