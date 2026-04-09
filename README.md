# EliteHubX 🎮

Premium gaming hub — Next.js 16 + Supabase + Vercel

---

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | Next.js 16 (App Router)     |
| Database | Supabase (PostgreSQL)       |
| Auth     | JWT + bcrypt (custom)       |
| Hosting  | Vercel                      |
| Fallback | Local JSON (`data/games.json`) |

---

## 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**
3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2 — Local Development

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/elitehubx.git
cd elitehubx
npm install

# Set up environment
cp .env.example .env.local
# Fill in your Supabase keys in .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 3 — Push to GitHub

```bash
cd elitehubx
git init
git add .
git commit -m "feat: initial EliteHubX release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/elitehubx.git
git push -u origin main
```

---

## 4 — Deploy to Vercel

### Option A — Vercel Dashboard (recommended)
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Add these **Environment Variables** in Vercel dashboard:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
| `JWT_SECRET` | a long random string |
| `ADMIN_EMAIL` | `tahiruplayz@gmail.com` |

4. Click **Deploy** — done!

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 5 — Admin Access

- Visit `/signup` and register with `tahiruplayz@gmail.com`
- That email auto-gets `role = admin`
- Access the admin panel at `/admin`

---

## Environment Variables Reference

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=your_random_secret
ADMIN_EMAIL=tahiruplayz@gmail.com
```

---

## Project Structure

```
elitehubx/
├── app/                  # Next.js App Router pages + API routes
│   ├── api/              # REST API (games, auth)
│   ├── admin/            # Admin panel
│   ├── game/[id]/        # Game detail
│   ├── download/[id]/    # Download page
│   ├── categories/       # Browse page
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/           # Reusable UI components
├── context/              # AuthContext (session persistence)
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── db.ts             # All database operations
│   ├── auth.ts           # JWT helpers
│   └── games.ts          # JSON fallback helpers
├── supabase/
│   └── schema.sql        # Run this in Supabase SQL editor
├── data/
│   └── games.json        # JSON fallback (auto-synced)
├── .env.example          # Copy to .env.local
└── vercel.json           # Vercel config
```
