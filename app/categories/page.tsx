import { getAllGamesFromJSON } from '@/lib/games';
import { dbGetAllGames } from '@/lib/db';
import CategoriesClient from './CategoriesClient';

export const revalidate = 60;

export default async function CategoriesPage() {
  let games = getAllGamesFromJSON();
  try {
    const dbGames = await dbGetAllGames();
    if (dbGames.length > 0) games = dbGames;
  } catch { /* fallback */ }
  return <CategoriesClient games={games} />;
}
