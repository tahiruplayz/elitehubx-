import { getGameById, getAllGamesFromJSON } from '@/lib/games';
import { dbGetGameById } from '@/lib/db';
import { notFound } from 'next/navigation';
import DownloadClient from './DownloadClient';
import type { Game } from '@/lib/types';

interface Props { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  return [];
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
