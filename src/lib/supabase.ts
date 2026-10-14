import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase URL or Anon Key is missing. Check your .env file or environment settings.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Utility to convert minor integer units (paise) to display rupees (INR)
 * e.g., 29900 -> 299
 */
export function minorToMajor(minor: number): number {
  return Math.round(minor / 100);
}

/**
 * Utility to convert rupees (INR) to minor integer units (paise)
 * e.g., 299 -> 29900
 */
export function majorToMinor(major: number): number {
  return Math.round(major * 100);
}
