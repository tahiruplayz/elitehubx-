'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Game } from '@/lib/games';
import { Gamepad2, Folder, Eye, ArrowDownToLine, LayoutDashboard, PlusCircle, Library, CheckCircle, XCircle, LogOut, Plus } from 'lucide-react';

const EMPTY = { title: '', description: '', image: '', category: '', size: '', downloadLink: '', tagsStr: '' };

type Tab = 'dashboard' | 'add' | 'games';

export default function AdminClient() {
  const [games,   setGames]   = useState<Game[]>([]);
  const [form,    setForm]    = useState({ ...EMPTY });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; ok: boolean } | null>(null);
  const [tab,     setTab]     = useState<Tab>('dashboard');
  const { logout } = useAuth();
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/games');
    setGames(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => { await logout(); router.push('/login'); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: form.tagsStr.split(',').map(t => t.trim()).filter(Boolean) };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (payload as any).tagsStr;
    const method = editing ? 'PUT' : 'POST';
    const body   = editing ? { ...payload, id: editing } : payload;
    const res    = await fetch('/api/games', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      flash(editing ? 'Game updated!' : 'Game added!');
      setForm({ ...EMPTY }); setEditing(null); setTab('games'); load();
    } else {
      const d = await res.json();
      flash(d.error || 'Failed to save', false);
    }
    setSaving(false);
  };

  const handleEdit = (g: Game) => {
    setEditing(g.id);
    setForm({ title: g.title, description: g.description, image: g.image, category: g.category, size: g.size, downloadLink: g.downloadLink, tagsStr: g.tags.join(', ') });
    setTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this game?')) return;
    const res = await fetch('/api/games', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) { flash('Game deleted.'); load(); }
    else flash('Failed to delete', false);
  };

  const categories = [...new Set(games.map(g => g.category))];
  const recent     = games.slice(0, 4);

  const TABS: [Tab, string, React.ReactNode][] = [
    ['dashboard', 'Dashboard',              <LayoutDashboard key="d" size={14} />],
    ['add',       editing ? 'Edit' : 'Add Game', editing ? <PlusCircle key="e" size={14} /> : <Plus key="a" size={14} />],
    ['games',     'Library',                <Library key="l" size={14} />],
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 64px' }} className="fade-in">

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '76px', right: '20px', zIndex: 200, padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem', backdropFilter: 'blur(12px)', background: toast.ok ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${toast.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: toast.ok ? '#4ade80' : '#f87171', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'fadeUp 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {toast.ok ? <CheckCircle size={15} /> : <XCircle size={15} />} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em' }}>Admin Panel</h1>
          <p style={{ color: 'var(--text3)', fontSize: '0.82rem', marginTop: '2px' }}>EliteHubX Game Management</p>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--card)', padding: '4px', borderRadius: '12px', width: 'fit-content', border: '1px solid var(--border)' }}>
        {TABS.map(([t, label, icon]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.83rem', borderRadius: '9px', transition: 'all 0.18s ease', background: tab === t ? 'linear-gradient(135deg, var(--purple), var(--purple2))' : 'transparent', color: tab === t ? '#fff' : 'var(--text3)' }}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ─────────────────────────────────────────── */}
      {tab === 'dashboard' && (
        <div className="fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Games',  value: games.length,                                      icon: <Gamepad2 size={22} />,        color: 'var(--purple-l)' },
              { label: 'Categories',   value: categories.length,                                 icon: <Folder size={22} />,          color: '#22d3ee' },
              { label: 'Total Views',  value: games.reduce((a, g) => a + (g.views ?? 0), 0),     icon: <Eye size={22} />,             color: 'var(--amber)' },
              { label: 'Downloads',    value: games.reduce((a, g) => a + (g.downloads ?? 0), 0), icon: <ArrowDownToLine size={22} />, color: 'var(--green)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: s.color }}>{s.icon}</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value.toLocaleString()}</div>
                <div style={{ color: 'var(--text3)', fontSize: '0.75rem', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent */}
          <div className="card" style={{ padding: '20px' }}>
            <p style={{ color: 'var(--purple-l)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>
              Recently Added
            </p>
            {recent.length === 0 ? (
              <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '20px' }}>No games yet.</p>
            ) : recent.map(g => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <img src={g.image} alt={g.title}
                  style={{ width: '44px', height: '32px', objectFit: 'cover', borderRadius: '6px', background: '#111', flexShrink: 0 }}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/44x32/1a1a1a/7c3aed?text=?'; }}
                />
                <span style={{ color: 'var(--text)', fontWeight: 600, flex: 1, fontSize: '0.88rem' }}>{g.title}</span>
                <span className="badge badge-purple" style={{ fontSize: '0.62rem' }}>{g.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ADD / EDIT ─────────────────────────────────────────── */}
      {tab === 'add' && (
        <div className="card fade-in" style={{ padding: '28px' }}>
          <p style={{ color: 'var(--purple-l)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '20px' }}>
            {editing ? 'Edit Game' : 'Add New Game'}
          </p>

          {/* Image preview */}
          {form.image && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: 'var(--text3)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Preview</p>
              <img src={form.image} alt="preview"
                style={{ height: '110px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-p)' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              {[
                { key: 'title',        label: 'Title *',              ph: 'Game title' },
                { key: 'category',     label: 'Category *',           ph: 'RPG, FPS, Action…' },
                { key: 'size',         label: 'Size *',               ph: '50 GB' },
                { key: 'image',        label: 'Image URL *',          ph: 'https://…' },
                { key: 'downloadLink', label: 'Download Link *',      ph: 'https://…' },
                { key: 'tagsStr',      label: 'Tags (comma-sep)',      ph: 'rpg, action, open-world' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', color: 'var(--text3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    {f.label}
                  </label>
                  <input
                    required={f.label.includes('*')}
                    className="input"
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                Description *
              </label>
              <textarea
                required rows={3}
                className="input"
                style={{ resize: 'vertical' }}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Game description…"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : editing ? 'Update Game' : 'Add Game'}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => { setEditing(null); setForm({ ...EMPTY }); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ── LIBRARY ───────────────────────────────────────────── */}
      {tab === 'games' && (
        <div className="card fade-in" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>
              Game Library <span style={{ color: 'var(--text3)', fontWeight: 500 }}>({games.length})</span>
            </p>
            <button onClick={() => setTab('add')} className="btn-primary" style={{ padding: '7px 16px', fontSize: '0.78rem' }}>
              + Add Game
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>Loading…</div>
          ) : games.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text3)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}><Gamepad2 size={40} strokeWidth={1.2} /></div>
              <p>No games yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['', 'Title', 'Category', 'Size', 'Views', 'DLs', ''].map((h, i) => (
                      <th key={i} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {games.map(g => (
                    <tr
                      key={g.id}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '8px 10px' }}>
                        <img src={g.image} alt={g.title}
                          style={{ width: '48px', height: '34px', objectFit: 'cover', borderRadius: '6px', background: '#111' }}
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x34/1a1a1a/7c3aed?text=?'; }}
                        />
                      </td>
                      <td style={{ padding: '8px 10px', color: 'var(--text)', fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {g.title}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.62rem' }}>{g.category}</span>
                      </td>
                      <td style={{ padding: '8px 10px', color: 'var(--text2)' }}>{g.size}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--text3)' }}>{(g.views ?? 0).toLocaleString()}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--text3)' }}>{(g.downloads ?? 0).toLocaleString()}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleEdit(g)}
                            style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(124,58,237,0.12)', color: 'var(--purple-l)', border: '1px solid rgba(124,58,237,0.25)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(g.id)}
                            style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
