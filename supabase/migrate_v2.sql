-- Run this in Supabase SQL Editor if your games table was created before v2
-- It safely adds the new columns without dropping existing data

alter table public.games
  add column if not exists screenshots text[]  default '{}',
  add column if not exists features    text[]  default '{}',
  add column if not exists min_reqs    jsonb   default '{}',
  add column if not exists rec_reqs    jsonb   default '{}';
