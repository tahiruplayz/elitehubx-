import { redirect } from 'next/navigation';
import { getSession, isAdmin } from '@/lib/auth';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const session = await getSession();
  if (!isAdmin(session)) redirect('/login');
  return <AdminClient />;
}
