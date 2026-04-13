import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { dbGetGameById } from '@/lib/db';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' });

  // Raw Supabase row
  const sb = getServiceClient();
  const { data: raw } = await sb.from('games').select('*').eq('id', id).single();

  // Processed through dbGetGameById
  const processed = await dbGetGameById(id);

  return NextResponse.json({
    raw_screenshots: raw?.screenshots,
    raw_features: raw?.features,
    raw_min_reqs: raw?.min_reqs,
    raw_rec_reqs: raw?.rec_reqs,
    processed_screenshots: processed?.screenshots,
    processed_features: processed?.features,
    processed_minReqs: processed?.minReqs,
    processed_recReqs: processed?.recReqs,
  });
}
