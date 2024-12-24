import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface DentalRecord {
  id: string;
  visit_date: string;
  appointment_time: string;
  operation_type: string | null;
  patient: {
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
  };
}

export const useAppointments = (selectedDate: Date) => {
  const { data: appointments } = useQuery<DentalRecord[]>({
    queryKey: ['appointments', selectedDate],
    queryFn: async () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          id,
          visit_date,
          appointment_time,
          operation_type,
          patient:patients(*)
        `)
        .eq('patients.user_id', user.id)
        .gte('visit_date', startOfDay.toISOString())
        .lte('visit_date', endOfDay.toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!selectedDate
  });

  const { data: monthlyAppointments } = useQuery({
    queryKey: ['monthly-appointments', selectedDate],
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
          patient:patients(*)
        `)
        .eq('patients.user_id', user.id);

      if (error) throw error;
      
      return data?.map(record => ({
        id: record.id,
        title: `${format(new Date(`2000-01-01T${record.appointment_time}`), 'HH:mm')} - ${record.patient.first_name} ${record.patient.last_name}`,
        start: new Date(`${record.visit_date.split('T')[0]}T${record.appointment_time}`).toISOString(),
        extendedProps: {
          patientId: record.patient.id,
          operationType: record.operation_type
        }
      })) || [];
    }
  });

  return { appointments, monthlyAppointments };
};