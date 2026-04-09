-- ============================================================
-- EliteHubX — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Games table ──────────────────────────────────────────────
create table if not exists public.games (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null,
  image        text not null,
  category     text not null,
  size         text not null,
  download_link text not null,
  tags         text[] default '{}',
  views        integer default 0,
  downloads    integer default 0,
  created_at   timestamptz default now()
);

-- ── Users table ───────────────────────────────────────────────
-- Note: Supabase Auth handles passwords. This table stores roles.
create table if not exists public.users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  password   text not null,   -- bcrypt hash (we manage auth manually via JWT)
  role       text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────
alter table public.games enable row level security;
alter table public.users enable row level security;

-- Games: anyone can read
create policy "Public read games"
  on public.games for select
  using (true);

-- Games: only service role can write (our API uses service key)
create policy "Service write games"
  on public.games for all
  using (false)
  with check (false);

-- Users: service role only
create policy "Service manage users"
  on public.users for all
  using (false)
  with check (false);

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists games_category_idx on public.games (category);
create index if not exists games_created_idx  on public.games (created_at desc);
create index if not exists users_email_idx    on public.users (email);
