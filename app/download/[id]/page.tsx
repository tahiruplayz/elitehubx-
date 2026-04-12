import { getGameById, getAllGamesFromJSON } from '@/lib/games';
import { dbGetGameById } from '@/lib/db';
import { notFound } from 'next/navigation';
import DownloadClient from './DownloadClient';
import type { Game } from '@/lib/types';

interface Props { params: Promise<{ id: string }> }

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllGamesFromJSON().map(g => ({ id: g.id }));
}

export default async function DownloadPage({ params }: Props) {
  const { id } = await params;

  let game: Game | null = null;
  try {
    game = await dbGetGameById(id);
  } catch { /* fallback */ }
  if (!game) game = getGameById(id) ?? null;
  if (!game) notFound();

  return <DownloadClient game={game} />;
}
