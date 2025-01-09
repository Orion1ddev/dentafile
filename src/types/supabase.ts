import { Database } from "@/integrations/supabase/types";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type DentalRecord = Tables<'dental_records'>;
export type Patient = Tables<'patients'>;
export type Profile = Tables<'profiles'>;
export type Translation = Tables<'translations'>;

// Helper type for handling Supabase query responses
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;