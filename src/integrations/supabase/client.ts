
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use the Supabase URL and anon key directly
const SUPABASE_URL = 'https://iekkfirlmfwajjgzvota.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla2tmaXJsbWZ3YWpqZ3p2b3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2OTE3MDIsImV4cCI6MjA0OTI2NzcwMn0.bSpA7_W6KR52hjotnwWyVQ9-3-G3NZ3kK39cPnai35I';

// Create and export the Supabase client with proper type definition
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Utility function to check if Supabase is configured correctly
export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};
