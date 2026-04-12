import fs from 'fs';
import path from 'path';

// Re-export types from the client-safe types file
export type { Game, SystemRequirements } from './types';
export { isLowEnd, slugify } from './types';

const dataPath = path.join(process.cwd(), 'data', 'games.json');

function isWritable(): boolean {
  try { fs.accessSync(path.join(process.cwd(), 'data'), fs.constants.W_OK); return true; }
  catch { return false; }
}

// Import Game type for use in this file
import type { Game } from './types';

export function getAllGamesFromJSON(): Game[] {
  try { return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as Game[]; }
  catch { return []; }
}

export function saveGamesToJSON(games: Game[]): void {
  if (!isWritable()) return;
  try { fs.writeFileSync(dataPath, JSON.stringify(games, null, 2), 'utf-8'); } catch { /* skip */ }
}

export function syncGameToJSON(game: Game): void {
  if (!isWritable()) return;
  try {
    const games = getAllGamesFromJSON();
    const idx = games.findIndex(g => g.id === game.id);
    if (idx >= 0) games[idx] = game; else games.unshift(game);
    saveGamesToJSON(games);
  } catch { /* skip */ }
}

export function removeGameFromJSON(id: string): void {
  if (!isWritable()) return;
  try { saveGamesToJSON(getAllGamesFromJSON().filter(g => g.id !== id)); } catch { /* skip */ }
}

export function getAllGames(): Game[] { return getAllGamesFromJSON(); }
export function getGameById(id: string): Game | undefined { return getAllGamesFromJSON().find(g => g.id === id); }
export function saveGames(games: Game[]): void { saveGamesToJSON(games); }
