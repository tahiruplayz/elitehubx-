'use client';
import { useEffect, useState } from 'react';

export default function GameDetailClient({ gameId }: { gameId: string }) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    // Track view
    fetch(`/api/games/${gameId}`, { method: 'GET' }).catch(() => {});
    // Check localStorage favorites
    const favs: string[] = JSON.parse(localStorage.getItem('ehx_favorites') || '[]');
    setFavorited(favs.includes(gameId));
  }, [gameId]);

  const toggleFavorite = () => {
    const favs: string[] = JSON.parse(localStorage.getItem('ehx_favorites') || '[]');
    const next = favs.includes(gameId) ? favs.filter(f => f !== gameId) : [...favs, gameId];
    localStorage.setItem('ehx_favorites', JSON.stringify(next));
    setFavorited(next.includes(gameId));
  };

  return (
    <button onClick={toggleFavorite}
      style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50, width: '52px', height: '52px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
        background: favorited ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(26,26,46,0.9)',
        boxShadow: favorited ? '0 0 20px rgba(124,58,237,0.5)' : '0 4px 16px rgba(0,0,0,0.4)',
        outline: '1px solid rgba(124,58,237,0.3)',
      }}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorited ? '❤️' : '🤍'}
    </button>
  );
}
