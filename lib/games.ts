import fs from 'fs';
import path from 'path';

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

// Whether the filesystem is writable (false on Netlify/Vercel)
function isWritable(): boolean {
  try {
    fs.accessSync(path.join(process.cwd(), 'data'), fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export function getAllGamesFromJSON(): Game[] {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw) as Game[];
  } catch {
    return [];
  }
}

export function saveGamesToJSON(games: Game[]): void {
  if (!isWritable()) return; // skip on read-only filesystems (Netlify)
  try {
    fs.writeFileSync(dataPath, JSON.stringify(games, null, 2), 'utf-8');
  } catch { /* silently skip */ }
}

export function syncGameToJSON(game: Game): void {
  if (!isWritable()) return;
  try {
    const games = getAllGamesFromJSON();
    const idx = games.findIndex(g => g.id === game.id);
    if (idx >= 0) games[idx] = game;
    else games.unshift(game);
    saveGamesToJSON(games);
  } catch { /* silently skip */ }
}

export function removeGameFromJSON(id: string): void {
  if (!isWritable()) return;
  try {
    const games = getAllGamesFromJSON().filter(g => g.id !== id);
    saveGamesToJSON(games);
  } catch { /* silently skip */ }
}

// Legacy aliases
export function getAllGames(): Game[] { return getAllGamesFromJSON(); }
export function getGameById(id: string): Game | undefined { return getAllGamesFromJSON().find(g => g.id === id); }
export function saveGames(games: Game[]): void { saveGamesToJSON(games); }
