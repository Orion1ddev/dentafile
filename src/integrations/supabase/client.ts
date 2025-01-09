import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iekkfirlmfwajjgzvota.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla2tmaXJsbWZ3YWpqZ3p2b3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2OTE3MDIsImV4cCI6MjA0OTI2NzcwMn0.bSpA7_W6KR52hjotnwWyVQ9-3-G3NZ3kK39cPnai35I";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    storage: window?.localStorage,
    storageKey: 'supabase.auth.token',
    // Adding site URL for production
    site: 'https://dentafile.com'
  },
  global: {
    headers: {
      'X-Client-Info': 'dental-app'
    }
  }
});