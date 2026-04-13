import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

// GET /api/debug?id=GAME_ID — returns raw Supabase row for a game
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const sb = getServiceClient();

  if (id) {
    // Return single game raw row
    const { data, error } = await sb.from('games').select('*').eq('id', id).single();
    return NextResponse.json({ data, error });
  }

  // Return table columns info
  const { data, error } = await sb.from('games').select('*').limit(1);
  const columns = data?.[0] ? Object.keys(data[0]) : [];
  return NextResponse.json({ columns, sample: data?.[0], error });
}
