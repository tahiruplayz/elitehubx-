import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { syncGameToJSON, removeGameFromJSON, getAllGamesFromJSON } from '@/lib/games';
import {
  dbGetAllGames, dbCreateGame, dbUpdateGame, dbDeleteGame,
} from '@/lib/db';
import type { Game } from '@/lib/games';

function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String).map(t => t.trim()).filter(Boolean);
  return String(raw ?? '').split(',').map(t => t.trim()).filter(Boolean);
}

export async function GET() {
  try {
    const games = await dbGetAllGames();
    // Keep JSON in sync as fallback
    games.forEach(g => syncGameToJSON(g));
    return NextResponse.json(games);
  } catch {
    // Supabase unavailable — fall back to JSON
    return NextResponse.json(getAllGamesFromJSON());
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as Omit<Game, 'id'>;
  const tags = parseTags(body.tags);

  try {
    // Check for duplicate title
    const existing = await dbGetAllGames();
    const duplicate = existing.find(
      g => g.title.toLowerCase().trim() === body.title.toLowerCase().trim()
    );
    if (duplicate) {
      return NextResponse.json({ error: `"${body.title}" is already added to the library.` }, { status: 409 });
    }

    const game = await dbCreateGame({ ...body, tags });
    syncGameToJSON(game);
    return NextResponse.json(game, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as Game;
  const tags = parseTags(body.tags);

  try {
    // Log what we're receiving for debugging
    console.log('[PUT /api/games] body keys:', Object.keys(body));
    console.log('[PUT /api/games] screenshots:', body.screenshots);
    console.log('[PUT /api/games] features:', body.features);
    console.log('[PUT /api/games] minReqs:', body.minReqs);
    console.log('[PUT /api/games] recReqs:', body.recReqs);

    const game = await dbUpdateGame(body.id, { ...body, tags });
    syncGameToJSON(game);
    return NextResponse.json(game);
  } catch (e) {
    console.error('[PUT /api/games] error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json() as { id: string };

  try {
    await dbDeleteGame(id);
    removeGameFromJSON(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
