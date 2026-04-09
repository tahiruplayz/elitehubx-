import { NextRequest, NextResponse } from 'next/server';
import { dbIncrementViews, dbIncrementDownloads } from '@/lib/db';
import { syncGameToJSON, getAllGamesFromJSON } from '@/lib/games';

interface Params { params: Promise<{ id: string }> }

// GET — increment views
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const game = await dbIncrementViews(id);
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    syncGameToJSON(game);
    return NextResponse.json(game);
  } catch {
    // Fallback: update JSON only
    const games = getAllGamesFromJSON();
    const g = games.find(x => x.id === id);
    if (!g) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    g.views = (g.views ?? 0) + 1;
    syncGameToJSON(g);
    return NextResponse.json(g);
  }
}

// POST — increment downloads
export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const downloads = await dbIncrementDownloads(id);
    return NextResponse.json({ downloads });
  } catch {
    const games = getAllGamesFromJSON();
    const g = games.find(x => x.id === id);
    if (!g) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    g.downloads = (g.downloads ?? 0) + 1;
    syncGameToJSON(g);
    return NextResponse.json({ downloads: g.downloads });
  }
}
