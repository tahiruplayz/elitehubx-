import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL      ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Public client — safe for browser + server components
// Uses empty strings at build time; real values at runtime
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Service-role client — server-only, bypasses RLS
// Called lazily inside functions, never at module load time
export function getServiceClient() {
  const url        = process.env.NEXT_PUBLIC_SUPABASE_URL      ?? '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY     ?? '';
  // Return a no-op client if env vars missing (build time)
  if (!url || !serviceKey) return supabase;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
