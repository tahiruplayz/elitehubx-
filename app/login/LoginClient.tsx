'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginClient() {
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || 'Invalid credentials'); return; }

    // Refresh auth context — navbar updates immediately
    await refresh();
    showToast(data.role === 'admin' ? '⚡ Welcome back, Admin!' : '✅ Login successful!');

    setTimeout(() => {
      router.push(data.role === 'admin' ? '/admin' : '/');
    }, 700);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.82rem 1rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '10px', color: '#e2e8f0', fontSize: '0.92rem', outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  };

  return (
    <div style={{ minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>

      {/* Background orbs */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 300, padding: '0.85rem 1.25rem', borderRadius: '12px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', color: '#4ade80', fontWeight: 600, fontSize: '0.88rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', animation: 'slideInRight 0.3s ease' }}>
          {toast}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{ background: 'rgba(15,15,28,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)', boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}>
                <Gamepad2 size={18} color="white" />
              </div>
              <span style={{ background: 'linear-gradient(135deg, #e2e8f0, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '0.05em', fontFamily: "'Cinzel', Georgia, serif" }}>
                EliteHubX
              </span>
            </Link>
            <p style={{ color: '#475569', fontSize: '0.85rem' }}>Welcome back — sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.45rem' }}>
                Email Address
              </label>
              <input type="email" required style={inp} value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; e.target.style.background = 'rgba(124,58,237,0.05)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(124,58,237,0.25)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.45rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} required
                  style={{ ...inp, paddingRight: '2.75rem' }}
                  value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; e.target.style.background = 'rgba(124,58,237,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(124,58,237,0.25)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '0.7rem 1rem', borderRadius: '10px', fontSize: '0.83rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', fontSize: '0.92rem', padding: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {loading ? (
                <>
                  <span style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </>
              ) : (
                <><LogIn size={15} /> Sign In</>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#334155', fontSize: '0.83rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#a855f7', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
