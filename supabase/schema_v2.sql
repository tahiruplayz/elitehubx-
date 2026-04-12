-- Run this in Supabase SQL Editor to add new fields to existing games table

alter table public.games
  add column if not exists screenshots  text[]   default '{}',
  add column if not exists features     text[]   default '{}',
  add column if not exists min_os       text,
  add column if not exists min_cpu      text,
  add column if not exists min_ram      text,
  add column if not exists min_gpu      text,
  add column if not exists min_storage  text,
  add column if not exists rec_os       text,
  add column if not exists rec_cpu      text,
  add column if not exists rec_ram      text,
  add column if not exists rec_gpu      text,
  add column if not exists rec_storage  text;
