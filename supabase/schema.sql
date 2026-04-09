-- ============================================================
-- EliteHubX — Supabase Schema (FIXED)
-- Run this FULL script in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Drop existing tables (clean slate) ───────────────────────
drop table if exists public.users cascade;
drop table if exists public.games cascade;

-- ── Games table ──────────────────────────────────────────────
create table public.games (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null,
  image         text not null,
  category      text not null,
  size          text not null,
  download_link text not null,
  tags          text[] default '{}',
  views         integer default 0,
  downloads     integer default 0,
  created_at    timestamptz default now()
);

-- ── Users table ───────────────────────────────────────────────
create table public.users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  password   text not null,
  role       text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

-- ── Disable RLS entirely (service role handles security) ─────
-- Our API only uses the service role key which bypasses RLS anyway.
-- This is the simplest and most reliable approach.
alter table public.games disable row level security;
alter table public.users disable row level security;

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists games_category_idx on public.games (category);
create index if not exists games_created_idx  on public.games (created_at desc);
create index if not exists users_email_idx    on public.users (email);
