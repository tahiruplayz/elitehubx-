'use client';
import { useState, useEffect, useRef } from 'react';
import type { Game } from '@/lib/games';
import Link from 'next/link';
import { Download, Clock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function DownloadClient({ game }: { game: Game }) {
  const [countdown, setCountdown] = useState(10);
  const [ready, setReady] = useState(false);
  const popunderFired   = useRef(false);
  const downloadCounted = useRef(false);

  useEffect(() => {
    if (countdown <= 0) { setReady(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleInteraction = () => {
    if (!popunderFired.current) {
      popunderFired.current = true;
      // INSERT PropellerAds popunder trigger here
    }
  };

  const handleDownload = async () => {
    handleInteraction();
    if (!downloadCounted.current) {
      downloadCounted.current = true;
      fetch(`/api/games/${game.id}`, { method: 'POST' }).catch(() => {});
    }
    window.open(game.downloadLink, '_blank', 'noopener,noreferrer');
  };

  const progress = ((10 - countdown) / 10) * 100;
  const deg      = progress * 3.6;

  return (
    <div
      style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}
      onClick={handleInteraction}
    >
      {/* Top ad */}
      {/* INSERT PropellerAds banner (728×90) here */}
      <div className="ad-placeholder" style={{ width: '100%', maxWidth: '728px', height: '80px', marginBottom: '32px' }}>
        Advertisement
      </div>

      <div className="card fade-in" style={{ width: '100%', maxWidth: '460px', padding: '36px 32px', textAlign: 'center' }}>
        {/* Thumbnail */}
        <div style={{ width: '100px', height: '70px', margin: '0 auto 20px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 0 24px rgba(124,58,237,0.2)' }}>
          <img src={game.image} alt={game.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/100x70/1a1a1a/7c3aed?text=?`; }}
          />
        </div>

        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
          {game.title}
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.83rem', marginBottom: '28px' }}>
          {game.category} · {game.size}
        </p>

        {/* Countdown ring */}
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `conic-gradient(var(--purple) ${deg}deg, rgba(124,58,237,0.1) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', transition: 'background 0.9s ease' }}>
          <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {ready ? (
              <CheckCircle size={28} color="#22c55e" />
            ) : (
              <>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--purple-l)', lineHeight: 1 }}>{countdown}</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text3)', marginTop: '2px' }}>sec</span>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'rgba(124,58,237,0.12)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--purple), var(--purple-l))', borderRadius: '2px', transition: 'width 0.9s ease' }} />
        </div>
        <p style={{ color: 'var(--text3)', fontSize: '0.75rem', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          {ready ? <CheckCircle size={13} color="#22c55e" /> : <Clock size={13} />}
          {ready ? 'Ready!' : 'Preparing your download…'}
        </p>

        {/* Center ad */}
        {/* INSERT PropellerAds rectangle (300×250) here */}
        <div className="ad-placeholder" style={{ height: '200px', marginBottom: '24px' }}>
          Advertisement
        </div>

        {/* Download button */}
        <button onClick={handleDownload} disabled={!ready} className="btn-primary" style={{ width: '100%', fontSize: '0.95rem', padding: '13px' }}>
          {ready
            ? <><Download size={16} /> Continue to Download</>
            : <><Clock size={16} /> Please wait…</>
          }
        </button>

        {/* Warning */}
        <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: '8px', fontSize: '0.78rem', color: '#fbbf24', lineHeight: 1.55, display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left' }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
          You will be redirected to an external website. Login may be required there.
        </div>

        <Link href={`/game/${game.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '16px', color: 'var(--text3)', fontSize: '0.78rem', textDecoration: 'none' }}>
          <ArrowLeft size={13} /> Back to game details
        </Link>
      </div>
    </div>
  );
}
