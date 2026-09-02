import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a singleton Supabase client for browser Client Components ('use client')
 * Uses NEXT_PUBLIC_SUPABASE_ANON_KEY with Row Level Security (RLS)
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('placeholder')) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Supabase Client] Operating in local development mode with standalone client storage.');
    }
  }

  return createBrowserClient(
    url || 'https://placeholder-project.supabase.co',
    anonKey || 'placeholder-anon-key'
  );
}