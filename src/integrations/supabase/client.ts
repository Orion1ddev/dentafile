import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://iekkfirlmfwajjgzvota.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla2tmaXJsbWZ3YWpqZ3p2b3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4MjI5NDcsImV4cCI6MjAyMDM5ODk0N30.C7BgGYw_2T5ZbvQVBRJ_g6OQJ5XvWFZcIVb9H_YBHPU';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window?.localStorage,
      storageKey: 'supabase.auth.token',
    },
    global: {
      headers: {
        'x-application-name': 'dentafile'
      }
    }
  }
);