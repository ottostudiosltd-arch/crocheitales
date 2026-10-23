import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const defaultUrl = 'https://rclxmrnzqpcdnojxahem.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbHhtcm56cXBjZG5vanhhaGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NzgyODksImV4cCI6MjEwNzU1NDI4OX0.sDO0OPc6bEzjdnvt1m2QnoZt52V7Tl6DvzjylBk5mJc';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && !supabaseUrl.includes('placeholder')
);

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
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
