'use client';
import { useState } from 'react';

export default function TestWritePage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setResult('Testing...');
    try {
      // Step 1: Get first game ID
      const gamesRes = await fetch('/api/games');
      const games = await gamesRes.json();
      if (!games.length) { setResult('No games found'); setLoading(false); return; }
      const game = games[0];

      // Step 2: Write test data directly via debug endpoint
      const writeRes = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: game.id,
          screenshots: ['https://via.placeholder.com/800x450/7c3aed/fff?text=Screenshot+1', 'https://via.placeholder.com/800x450/9333ea/fff?text=Screenshot+2'],
          features: ['Open World Gameplay', 'Multiplayer Support', 'High Quality Graphics'],
          minReqs: { os: 'Windows 10 64-bit', cpu: 'Intel Core i5', ram: '8 GB', gpu: 'GTX 1060', storage: '72 GB' },
          recReqs: { os: 'Windows 11 64-bit', cpu: 'Intel Core i7', ram: '16 GB', gpu: 'RTX 3070', storage: '72 GB SSD' },
        }),
      });
      const writeData = await writeRes.json();

      // Step 3: Read back to verify
      const readRes = await fetch(`/api/debug?id=${game.id}`);
      const readData = await readRes.json();

      setResult(JSON.stringify({
        gameId: game.id,
        gameTitle: game.title,
        writeResult: writeData,
        readBack: {
          screenshots: readData.data?.screenshots,
          features: readData.data?.features,
          min_reqs: readData.data?.min_reqs,
          rec_reqs: readData.data?.rec_reqs,
        }
      }, null, 2));
    } catch (e) {
      setResult('Error: ' + String(e));
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#a855f7', marginBottom: '20px' }}>Supabase Write Test</h1>
      <button onClick={runTest} disabled={loading}
        style={{ padding: '12px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}>
        {loading ? 'Testing...' : 'Run Test'}
      </button>
      {result && (
        <pre style={{ background: '#1a1a1a', color: '#e2e8f0', padding: '20px', borderRadius: '8px', overflow: 'auto', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
          {result}
        </pre>
      )}
    </div>
  );
}
