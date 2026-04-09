import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { getAllGamesFromJSON } from '@/lib/games';
import { getServiceClient } from '@/lib/supabase';

// POST /api/seed — admin only, seeds Supabase from local JSON
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const games = getAllGamesFromJSON();
  if (games.length === 0) return NextResponse.json({ message: 'No games in JSON to seed' });

  const sb = getServiceClient();
  const rows = games.map(g => ({
    title:         g.title,
    description:   g.description,
    image:         g.image,
    category:      g.category,
    size:          g.size,
    download_link: g.downloadLink,
    tags:          g.tags,
    views:         g.views ?? 0,
    downloads:     g.downloads ?? 0,
  }));

  const { data, error } = await sb
    .from('games')
    .upsert(rows, { onConflict: 'title' })
    .select();

  if (error) {
    console.error('[seed error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ seeded: data?.length ?? 0, message: 'Done!' });
}
