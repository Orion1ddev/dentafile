import { Database } from "@/integrations/supabase/types";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Patient = Tables<'patients'>;
export type DentalRecord = Tables<'dental_records'> & {
  patient: Patient;
};
export type Profile = Tables<'profiles'>;
export type Translation = Tables<'translations'>;

// Helper type for handling Supabase query responses
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;