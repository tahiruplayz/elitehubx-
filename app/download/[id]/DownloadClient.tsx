'use client';
import { useState, useEffect, useRef } from 'react';
import type { Game } from '@/lib/types';
import { isLowEnd } from '@/lib/types';
import Link from 'next/link';
import { Download, Clock, CheckCircle, AlertTriangle, ArrowLeft, Shield, Monitor } from 'lucide-react';
import Script from 'next/script';

export default function DownloadClient({ game }: { game: Game }) {
  const [countdown, setCountdown] = useState(10);
  const [ready, setReady] = useState(false);
  const downloadCounted = useRef(false);

  useEffect(() => {
    if (countdown <= 0) { setReady(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleDownload = async () => {
    if (!downloadCounted.current) {
      downloadCounted.current = true;
      fetch(`/api/games/${game.id}`, { method: 'POST' }).catch(() => {});
    }
    window.open(game.downloadLink, '_blank', 'noopener,noreferrer');
  };

  const progress = ((10 - countdown) / 10) * 100;
  const deg      = progress * 3.6;
  const lowEnd   = isLowEnd(game);

  return (
    <div style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.07) 0%, transparent 60%)' }}>

      {/* Monetag — download page only */}
      <Script src="https://quge5.com/88/tag.min.js" data-zone="228717" strategy="afterInteractive" data-cfasync="false" />

      <div className="card fade-in" style={{ width: '100%', maxWidth: '480px', padding: '40px 36px', textAlign: 'center', border: '1px solid rgba(124,58,237,0.15)', boxShadow: '0 0 60px rgba(124,58,237,0.08)' }}>

        {/* Game thumbnail — bigger */}
        <div style={{ width: '140px', height: '95px', margin: '0 auto 20px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(124,58,237,0.35)', boxShadow: '0 0 32px rgba(124,58,237,0.25)' }}>
          <img src={game.image} alt={game.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/140x95/16161e/7c3aed?text=?`; }}
          />
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span className="badge badge-purple">{game.category}</span>
          {lowEnd && <span className="badge badge-low" style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '3px' }}><Monitor size={9} /> Low-End</span>}
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
          {game.title}
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.82rem', marginBottom: '28px' }}>
          {game.size} · Free Download
        </p>

        {/* Countdown ring */}
        <div style={{ width: '108px', height: '108px', borderRadius: '50%', background: `conic-gradient(var(--purple) ${deg}deg, rgba(124,58,237,0.08) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', transition: 'background 0.9s ease', boxShadow: ready ? '0 0 32px rgba(34,197,94,0.3)' : '0 0 24px rgba(124,58,237,0.2)' }}>
          <div style={{ width: '82px', height: '82px', borderRadius: '50%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {ready ? (
              <CheckCircle size={32} color="#22c55e" />
            ) : (
              <>
                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--purple-l)', lineHeight: 1 }}>{countdown}</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text3)', marginTop: '2px', letterSpacing: '0.05em' }}>SEC</span>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'rgba(124,58,237,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #6d28d9, #a855f7)', borderRadius: '2px', transition: 'width 0.9s ease' }} />
        </div>

        <p style={{ color: ready ? '#4ade80' : 'var(--text3)', fontSize: '0.78rem', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: ready ? 600 : 400 }}>
          {ready ? <CheckCircle size={13} color="#22c55e" /> : <Clock size={13} />}
          {ready ? 'Your download is ready!' : 'Preparing your download…'}
        </p>

        {/* Download button — large and glowing */}
        <button
          onClick={handleDownload}
          disabled={!ready}
          className="btn-primary"
          style={{ width: '100%', fontSize: '1rem', padding: '15px', borderRadius: '12px', letterSpacing: '0.02em', animation: ready ? 'glowPulse 2s ease-in-out infinite' : 'none' }}
        >
          {ready
            ? <><Download size={18} /> Continue to Download</>
            : <><Clock size={16} /> Please wait…</>
          }
        </button>

        {/* Trust signals */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
          {[
            { icon: <Shield size={12} />, text: 'Official source' },
            { icon: <CheckCircle size={12} />, text: 'No files hosted' },
            { icon: <Download size={12} />, text: 'Free download' },
          ].map(t => (
            <span key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text3)', fontSize: '0.72rem' }}>
              {t.icon} {t.text}
            </span>
          ))}
        </div>

        {/* Warning */}
        <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px', fontSize: '0.76rem', color: '#d97706', lineHeight: 1.55, display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left' }}>
          <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '1px' }} />
          You will be redirected to an external website. Login/Signup may be required there.
        </div>

        <Link href={`/game/${game.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '16px', color: 'var(--text3)', fontSize: '0.76rem', textDecoration: 'none' }}>
          <ArrowLeft size={12} /> Back to game details
        </Link>
      </div>
    </div>
  );
}
