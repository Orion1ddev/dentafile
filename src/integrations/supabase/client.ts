import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Ensure environment variables are defined with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iekkfirlmfwajjgzvota.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not properly configured');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    storage: window?.localStorage,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'x-application-name': 'dentafile',
    },
  },
});