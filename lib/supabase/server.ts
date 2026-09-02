import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a scoped Supabase client for Server Components, Server Actions, and Route Handlers
 */
export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              // Scoped to parent domain in production for subdomain SSO
              domain: process.env.NODE_ENV === 'production' ? '.arcadehub.in' : undefined,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          );
        } catch {
          // Handled if called from Server Component
        }
      },
    },
  });
}