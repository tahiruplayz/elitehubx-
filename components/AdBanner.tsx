'use client';
import { useEffect, useRef } from 'react';

interface Props {
  // Paste your PropellerAds zone ID here
  zoneId: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * AdBanner — drops a PropellerAds banner into the page.
 *
 * Usage:
 *   <AdBanner zoneId="YOUR_ZONE_ID" width={728} height={90} />
 *
 * Get your zoneId from:
 *   PropellerAds Dashboard → Sites → Ad Units → Zone ID
 */
export default function AdBanner({ zoneId, width, height, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !zoneId || zoneId === 'YOUR_ZONE_ID') return;

    // Clear any previous ad
    ref.current.innerHTML = '';

    // Create the PropellerAds script
    const script = document.createElement('script');
    script.async = true;
    // PropellerAds banner script format
    script.src = `https://a.magsrv.com/ad-provider.js`;
    script.setAttribute('data-zone', zoneId);

    const ins = document.createElement('ins');
    ins.className = 'eas6a97888e2';
    ins.setAttribute('data-zoneid', zoneId);

    ref.current.appendChild(ins);
    ref.current.appendChild(script);

    return () => {
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [zoneId]);

  // Show placeholder if no zone ID configured yet
  if (!zoneId || zoneId === 'YOUR_ZONE_ID') {
    return (
      <div
        className={className}
        style={{
          width: `${width}px`,
          maxWidth: '100%',
          height: `${height}px`,
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#334155',
          fontSize: '0.7rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Advertisement
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: `${width}px`, maxWidth: '100%', height: `${height}px` }}
    />
  );
}
