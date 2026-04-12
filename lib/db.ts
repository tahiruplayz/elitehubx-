/**
 * db.ts — Supabase data layer
 * Replaces mongoose models. All server-side DB calls go through here.
 * Uses service-role key so RLS is bypassed for writes.
 */
import { getServiceClient } from './supabase';
import type { Game } from './games';

// ── Type mapping ──────────────────────────────────────────────────────────────
// Supabase uses snake_case; our app uses camelCase.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToGame(row: any): Game {
  return {
    id:           row.id,
    title:        row.title,
    description:  row.description,
    image:        row.image,
    category:     row.category,
    size:         row.size,
    downloadLink: row.download_link,
    tags:         row.tags ?? [],
    views:        row.views ?? 0,
    downloads:    row.downloads ?? 0,
    createdAt:    row.created_at,
    screenshots:  row.screenshots ?? [],
    features:     row.features ?? [],
    minReqs:      row.min_reqs && Object.keys(row.min_reqs).length > 0 ? row.min_reqs : undefined,
    recReqs:      row.rec_reqs && Object.keys(row.rec_reqs).length > 0 ? row.rec_reqs : undefined,
  };
}

// ── Games ─────────────────────────────────────────────────────────────────────

export async function dbGetAllGames(): Promise<Game[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToGame);
}

export async function dbGetGameById(id: string): Promise<Game | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('games')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return rowToGame(data);
}

export async function dbCreateGame(game: Omit<Game, 'id' | 'views' | 'downloads' | 'createdAt'>): Promise<Game> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('games')
    .insert({
      title:         game.title,
      description:   game.description,
      image:         game.image,
      category:      game.category,
      size:          game.size,
      download_link: game.downloadLink,
      tags:          game.tags,
      screenshots:   game.screenshots ?? [],
      features:      game.features ?? [],
      min_reqs:      game.minReqs ?? {},
      rec_reqs:      game.recReqs ?? {},
    })
    .select()
    .single();
  if (error) throw error;
  return rowToGame(data);
}

export async function dbUpdateGame(id: string, game: Partial<Omit<Game, 'id'>>): Promise<Game> {
  const sb = getServiceClient();
  const patch: Record<string, unknown> = {};
  if (game.title        !== undefined) patch.title         = game.title;
  if (game.description  !== undefined) patch.description   = game.description;
  if (game.image        !== undefined) patch.image         = game.image;
  if (game.category     !== undefined) patch.category      = game.category;
  if (game.size         !== undefined) patch.size          = game.size;
  if (game.downloadLink !== undefined) patch.download_link = game.downloadLink;
  if (game.tags         !== undefined) patch.tags          = game.tags;
  if (game.screenshots  !== undefined) patch.screenshots   = game.screenshots;
  if (game.features     !== undefined) patch.features      = game.features;
  if (game.minReqs      !== undefined) patch.min_reqs      = game.minReqs ?? {};
  if (game.recReqs      !== undefined) patch.rec_reqs      = game.recReqs ?? {};

  const { data, error } = await sb
    .from('games')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return rowToGame(data);
}

export async function dbDeleteGame(id: string): Promise<void> {
  const sb = getServiceClient();
  const { error } = await sb.from('games').delete().eq('id', id);
  if (error) throw error;
}

export async function dbIncrementViews(id: string): Promise<Game | null> {
  const sb = getServiceClient();
  // Supabase doesn't have atomic increment via JS client directly, use rpc or read-modify-write
  const { data: current } = await sb.from('games').select('views').eq('id', id).single();
  if (!current) return null;
  const { data, error } = await sb
    .from('games')
    .update({ views: (current.views ?? 0) + 1 })
    .eq('id', id)
    .select()
    .single();
  if (error) return null;
  return rowToGame(data);
}

export async function dbIncrementDownloads(id: string): Promise<number> {
  const sb = getServiceClient();
  const { data: current } = await sb.from('games').select('downloads').eq('id', id).single();
  const next = (current?.downloads ?? 0) + 1;
  await sb.from('games').update({ downloads: next }).eq('id', id);
  return next;
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface DBUser {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export async function dbFindUserByEmail(email: string): Promise<DBUser | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  if (error || !data) return null;
  return data as DBUser;
}

export async function dbCreateUser(email: string, hashedPassword: string, role: 'admin' | 'user'): Promise<DBUser> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('users')
    .insert({ email: email.toLowerCase(), password: hashedPassword, role })
    .select()
    .single();
  if (error) throw error;
  return data as DBUser;
}
