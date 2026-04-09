import fs from 'fs';
import path from 'path';

// Unified Game type used across the app
export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  size: string;
  downloadLink: string;
  tags: string[];
  views?: number;
  downloads?: number;
  createdAt?: string;
}

const dataPath = path.join(process.cwd(), 'data', 'games.json');

// ── JSON helpers ──────────────────────────────────────────────────────────────

export function getAllGamesFromJSON(): Game[] {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw) as Game[];
  } catch {
    return [];
  }
}

export function saveGamesToJSON(games: Game[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(games, null, 2), 'utf-8');
}

// Sync a single game into JSON (upsert by id)
export function syncGameToJSON(game: Game): void {
  const games = getAllGamesFromJSON();
  const idx = games.findIndex(g => g.id === game.id);
  if (idx >= 0) games[idx] = game;
  else games.unshift(game);
  saveGamesToJSON(games);
}

export function removeGameFromJSON(id: string): void {
  const games = getAllGamesFromJSON().filter(g => g.id !== id);
  saveGamesToJSON(games);
}

// ── Legacy aliases (used by old server components) ────────────────────────────

export function getAllGames(): Game[] {
  return getAllGamesFromJSON();
}

export function getGameById(id: string): Game | undefined {
  return getAllGamesFromJSON().find(g => g.id === id);
}

export function saveGames(games: Game[]): void {
  saveGamesToJSON(games);
}
