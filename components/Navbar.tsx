'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Shield, User, LogOut, LogIn, UserPlus, X, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Game } from '@/lib/games';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState<Game[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch games for search suggestions
  useEffect(() => {
    fetch('/api/games').then(r => r.json()).then(setAllGames).catch(() => {});
  }, []);

  // Scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSug(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Live search suggestions
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); setShowSug(false); return; }
    const q = query.toLowerCase();
    const results = allGames.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6);
    setSuggestions(results);
    setShowSug(results.length > 0);
  }, [query, allGames]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
      setShowSug(false);
      setQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        prefetch={true}
        style={{
          color: active ? '#a855f7' : '#94a3b8',
          fontSize: '0.88rem',
          fontWeight: active ? 700 : 500,
          textDecoration: 'none',
          paddingBottom: '2px',
          borderBottom: active ? '2px solid #a855f7' : '2px solid transparent',
          transition: 'color 0.15s, border-color 0.15s',
        }}
        className="nav-link"
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: scrolled
            ? 'rgba(8, 8, 16, 0.98)'
            : 'rgba(8, 8, 16, 0.80)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(124,58,237,0.18)',
          transition: 'background 0.3s, box-shadow 0.3s',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem', height: '60px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

          {/* Logo — text only, stylish gradient */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 900,
              fontSize: '1.35rem',
              letterSpacing: '-0.04em',
              fontFamily: "'Inter', system-ui, sans-serif",
              textTransform: 'uppercase',
            }}>
              EliteHubX
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden md:flex">
            <NavLink href="/" label="Home" />
            <NavLink href="/categories" label="Browse" />
            {user?.role === 'admin' && <NavLink href="/admin" label="Admin" />}
          </div>

          {/* Search */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: '420px', marginLeft: 'auto', position: 'relative' }}>
            <form onSubmit={handleSearch}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type="text" value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSug(true)}
                  placeholder="Search games..."
                  style={{
                    width: '100%', padding: '0.5rem 2.25rem 0.5rem 2.25rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(124,58,237,0.25)',
                    borderRadius: '10px', color: '#e2e8f0', fontSize: '0.83rem', outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(''); setSuggestions([]); setShowSug(false); }}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                    <X size={13} />
                  </button>
                )}
              </div>
            </form>

            {/* Suggestions */}
            {showSug && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: 'rgba(10,10,20,0.98)', border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '12px', overflow: 'hidden', zIndex: 200,
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}>
                {suggestions.map((g, i) => (
                  <Link key={g.id} href={`/game/${g.id}`}
                    onClick={() => { setShowSug(false); setQuery(''); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0.9rem', textDecoration: 'none',
                      borderBottom: i < suggestions.length - 1 ? '1px solid rgba(124,58,237,0.08)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <img src={g.image} alt={g.title}
                      style={{ width: '38px', height: '28px', objectFit: 'cover', borderRadius: '5px', background: '#1a1a2e', flexShrink: 0 }}
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/38x28/1a1a2e/7c3aed?text=?'; }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#e2e8f0', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.title}</p>
                      <p style={{ color: '#64748b', fontSize: '0.7rem' }}>{g.category} · {g.size}</p>
                    </div>
                  </Link>
                ))}
                <button onClick={() => { router.push(`/?search=${encodeURIComponent(query)}`); setShowSug(false); setQuery(''); }}
                  style={{ width: '100%', padding: '0.55rem 0.9rem', background: 'rgba(124,58,237,0.07)', border: 'none', color: '#a855f7', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Search size={12} /> See all results for &quot;{query}&quot;
                </button>
              </div>
            )}
          </div>

          {/* Auth — desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }} className="hidden md:flex">
            {user ? (
              <>
                {/* Badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                  background: user.role === 'admin'
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))'
                    : 'rgba(100,116,139,0.15)',
                  color: user.role === 'admin' ? '#c084fc' : '#94a3b8',
                  border: `1px solid ${user.role === 'admin' ? 'rgba(168,85,247,0.4)' : 'rgba(100,116,139,0.25)'}`,
                }}>
                  {user.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </div>
                {/* Logout */}
                <button onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.85rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.85rem', borderRadius: '8px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a855f7', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
                >
                  <LogIn size={12} /> Sign In
                </Link>
                <Link href="/signup" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.85rem', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, boxShadow: '0 0 12px rgba(124,58,237,0.3)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 12px rgba(124,58,237,0.3)'; }}
                >
                  <UserPlus size={12} /> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(o => !o)} className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', marginLeft: 'auto' }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid rgba(124,58,237,0.15)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(8,8,16,0.98)' }}>
            <Link prefetch href="/" style={{ color: isActive('/') ? '#a855f7' : '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Home</Link>
            <Link prefetch href="/categories" style={{ color: isActive('/categories') ? '#a855f7' : '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Browse</Link>
            {user?.role === 'admin' && <Link prefetch href="/admin" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Admin Panel</Link>}
            <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              {user ? (
                <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a855f7', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>Sign In</Link>
                  <Link href="/signup" style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
