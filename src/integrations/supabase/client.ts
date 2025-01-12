import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iekkfirlmfwajjgzvota.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla2tmaXJsbWZ3YWpqZ3p2b3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4MjI0MDAsImV4cCI6MjAyMDM5ODQwMH0.RLpZw4BQlLqXr_vy_MoNQdETXhBhz0ADhcX5JEX0D0k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});