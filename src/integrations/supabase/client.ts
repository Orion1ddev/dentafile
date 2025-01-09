import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://iekkfirlmfwajjgzvota.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla2tmaXJsbWZ3YWpqZ3p2b3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4NDQ4MDAsImV4cCI6MjAyMDQyMDgwMH0.dqVVvvxqQqKNXX_Gu8P2gqZGaXwXZYXKjuKGQXXgAYo';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'dentafile'
      }
    }
  }
);