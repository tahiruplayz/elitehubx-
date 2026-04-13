import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

// GET /api/debug — returns table columns + sample row
// GET /api/debug?id=UUID — returns raw row for that game
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const sb = getServiceClient();

  if (id) {
    const { data, error } = await sb.from('games').select('*').eq('id', id).single();
    return NextResponse.json({ data, error });
  }

  const { data, error } = await sb.from('games').select('*').limit(1);
  const columns = data?.[0] ? Object.keys(data[0]) : [];
  return NextResponse.json({ columns, sample: data?.[0], error });
}

// POST /api/debug — directly write screenshots/features/reqs to a game (bypass admin)
// Body: { id, screenshots: [], features: [], minReqs: {}, recReqs: {} }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const sb = getServiceClient();

  const { data, error } = await sb
    .from('games')
    .update({
      screenshots: body.screenshots ?? [],
      features:    body.features    ?? [],
      min_reqs:    body.minReqs     ?? {},
      rec_reqs:    body.recReqs     ?? {},
    })
    .eq('id', body.id)
    .select()
    .single();

  return NextResponse.json({ data, error });
}
