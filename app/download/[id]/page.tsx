import { getGameById, getAllGames } from '@/lib/games';
import { notFound } from 'next/navigation';
import DownloadClient from './DownloadClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllGames().map(g => ({ id: g.id }));
}

export default async function DownloadPage({ params }: Props) {
  const { id } = await params;
  const game = getGameById(id);
  if (!game) notFound();

  return <DownloadClient game={game} />;
}
