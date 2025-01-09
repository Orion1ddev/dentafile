import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";
import type { DentalRecord } from "@/types/supabase";

export const useAppointments = (selectedDate: Date) => {
  const { data: appointments } = useQuery<DentalRecord[]>({
    queryKey: ['appointments', selectedDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          *,
          patient:patients(*)
        `)
        .eq('patients.user_id', user.id)
        .gte('visit_date', startOfDay(selectedDate).toISOString())
        .lte('visit_date', endOfDay(selectedDate).toISOString());

      if (error) throw error;
      return data as DentalRecord[];
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
          *,
          patient:patients(*)
        `)
        .eq('patients.user_id', user.id);

      if (error) throw error;
      return data as DentalRecord[];
    }
  });

  return { appointments, monthlyAppointments };
};