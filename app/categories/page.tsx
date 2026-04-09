import { getAllGamesFromJSON } from '@/lib/games';
import CategoriesClient from './CategoriesClient';

export default function CategoriesPage() {
  const games = getAllGamesFromJSON();
  return <CategoriesClient games={games} />;
}
