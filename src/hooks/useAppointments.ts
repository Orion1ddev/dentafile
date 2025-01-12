import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  created_at: string;
  date_of_birth: string;
  email: string | null;
  gender: string;
  medical_history: string[] | null;
  phone: string | null;
  pinned: boolean | null;
  updated_at: string;
  user_id: string | null;
}

interface DentalRecord {
  id: string;
  visit_date: string;
  appointment_time: string | null;
  operation_type: string | null;
  patient: Patient;
}

export const useAppointments = (selectedDate: Date) => {
  const { data: appointments } = useQuery<DentalRecord[]>({
    queryKey: ['appointments', selectedDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          id,
          visit_date,
          appointment_time,
          operation_type,
          patient:patients(
            id,
            first_name,
            last_name,
            avatar_url,
            created_at,
            date_of_birth,
            email,
            gender,
            medical_history,
            phone,
            pinned,
            updated_at,
            user_id
          )
        `)
        .eq('patients.user_id', user.id)
        .gte('visit_date', startOfDay(selectedDate).toISOString())
        .lte('visit_date', endOfDay(selectedDate).toISOString())
        .single();

      if (error) throw error;
      return data ? [data] : [];
    },
    enabled: !!selectedDate
  });

  const { data: monthlyAppointments } = useQuery<DentalRecord[]>({
    queryKey: ['monthly-appointments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          id,
          visit_date,
          appointment_time,
          operation_type,
          patient:patients(
            id,
            first_name,
            last_name,
            avatar_url,
            created_at,
            date_of_birth,
            email,
            gender,
            medical_history,
            phone,
            pinned,
            updated_at,
            user_id
          )
        `)
        .eq('patients.user_id', user.id);

      if (error) throw error;
      return data || [];
    }
  });

  return { appointments, monthlyAppointments };
};