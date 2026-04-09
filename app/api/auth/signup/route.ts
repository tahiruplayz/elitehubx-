import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbFindUserByEmail, dbCreateUser } from '@/lib/db';
import { signToken } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@elitehubx.com';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email: string; password: string };

  if (!email || !password)
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

  try {
    const exists = await dbFindUserByEmail(email);
    if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);
    const role   = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';
    const user   = await dbCreateUser(email, hashed, role);

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ success: true, role });
    res.cookies.set('ehx_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (e) {
    console.error('Signup error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
