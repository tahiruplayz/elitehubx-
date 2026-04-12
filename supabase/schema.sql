-- ============================================================
-- EliteHubX — Supabase Schema v2 (with SEO fields)
-- Run this FULL script in: Supabase Dashboard → SQL Editor
-- ============================================================

drop table if exists public.users cascade;
drop table if exists public.games cascade;

create table public.games (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null,
  image         text not null,
  category      text not null,
  size          text not null,
  download_link text not null,
  tags          text[] default '{}',
  screenshots   text[] default '{}',
  features      text[] default '{}',
  min_reqs      jsonb default '{}',
  rec_reqs      jsonb default '{}',
  views         integer default 0,
  downloads     integer default 0,
  created_at    timestamptz default now()
);

create table public.users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  password   text not null,
  role       text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

alter table public.games disable row level security;
alter table public.users disable row level security;

create index if not exists games_category_idx on public.games (category);
create index if not exists games_created_idx  on public.games (created_at desc);
create index if not exists users_email_idx    on public.users (email);
