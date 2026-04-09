import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbFindUserByEmail } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
      return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL' }, { status: 500 });
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
      return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });

    const user = await dbFindUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ success: true, role: user.role });
    res.cookies.set('ehx_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[login error]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
