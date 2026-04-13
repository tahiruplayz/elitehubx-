import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

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

// Direct write test — no auth needed, for debugging only
export async function POST(req: NextRequest) {
  const body = await req.json();
  const sb = getServiceClient();

  // First verify what we're about to write
  const writePayload = {
    screenshots: body.screenshots ?? [],
    features:    body.features    ?? [],
    min_reqs:    body.minReqs     ?? {},
    rec_reqs:    body.recReqs     ?? {},
  };

  console.log('[debug POST] id:', body.id);
  console.log('[debug POST] writing:', JSON.stringify(writePayload));

  const { data, error } = await sb
    .from('games')
    .update(writePayload)
    .eq('id', body.id)
    .select('id, title, screenshots, features, min_reqs, rec_reqs')
    .single();

  return NextResponse.json({ 
    sent: writePayload,
    received: data, 
    error: error?.message ?? null 
  });
}
