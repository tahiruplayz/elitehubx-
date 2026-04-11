import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'elitehubx_secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@elitehubx.com';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('ehx_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function isAdmin(session: JWTPayload | null): boolean {
  if (!session || session.role !== 'admin') return false;
  const adminEmails = (process.env.ADMIN_EMAIL || 'admin@elitehubx.com')
    .split(',').map(e => e.trim().toLowerCase());
  return adminEmails.includes(session.email.toLowerCase());
}
