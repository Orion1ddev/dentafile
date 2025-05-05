
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

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
  const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = useQuery<DentalRecord[]>({
    queryKey: ['appointments', selectedDate],
    queryFn: async () => {
      try {
        console.log('Fetching appointments for date:', selectedDate);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user found when fetching appointments');
          return [];
        }

        console.log('User authenticated, fetching appointments...');
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
          .gte('visit_date', startOfDay(selectedDate).toISOString())
          .lte('visit_date', endOfDay(selectedDate).toISOString());

        if (error) {
          console.error('Error fetching appointments:', error);
          throw error;
        }
        
        console.log(`Successfully fetched ${data?.length || 0} appointments`);
        return data || [];
      } catch (error) {
        console.error('Error in appointments query:', error);
        throw error;
      }
    },
    enabled: !!selectedDate,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
    staleTime: 30000,
    refetchOnMount: true
  });

  const { data: monthlyAppointments, isLoading: monthlyLoading, error: monthlyError } = useQuery<DentalRecord[]>({
    queryKey: ['monthly-appointments'],
    queryFn: async () => {
      try {
        console.log('Fetching monthly appointments');
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user found when fetching monthly appointments');
          return [];
        }

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

        if (error) {
          console.error('Error fetching monthly appointments:', error);
          throw error;
        }
        
        console.log(`Successfully fetched ${data?.length || 0} monthly appointments`);
        return data || [];
      } catch (error) {
        console.error('Error in monthly appointments query:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
    staleTime: 60000,
    refetchOnMount: true
  });

  // Log errors to help with debugging
  if (appointmentsError) {
    console.error('Appointments query error:', appointmentsError);
  }
  
  if (monthlyError) {
    console.error('Monthly appointments query error:', monthlyError);
  }

  return { 
    appointments, 
    monthlyAppointments,
    isLoading: appointmentsLoading || monthlyLoading,
    hasError: !!appointmentsError || !!monthlyError
  };
};
