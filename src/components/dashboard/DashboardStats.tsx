
import { useLanguage } from "@/stores/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "./StatsCard";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, Activity, Star } from "lucide-react";
import { format } from "date-fns";

export const DashboardStats = () => {
  const { t } = useLanguage();

  // Query to get appointment data for the last 7 days
  const { data: weeklyAppointments } = useQuery({
    queryKey: ['weekly-appointments'],
    queryFn: async () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('dental_records')
        .select('visit_date, appointment_time')
        .eq('appointment_time', 'not.is.null')
        .gte('visit_date', sevenDaysAgo.toISOString())
        .lte('visit_date', today.toISOString())
        .order('visit_date', { ascending: true });
      
      if (error) throw error;
      
      // Group appointments by date
      const appointmentsByDate = data.reduce((acc: Record<string, number>, appointment) => {
        const date = appointment.visit_date.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      
      // Create array for last 7 days
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        chartData.push({
          date: dateStr,
          value: appointmentsByDate[dateStr] || 0
        });
      }
      
      // Determine the trend based on the appointment count
      let trend: "up" | "down" | "neutral" = "neutral";
      if (data.length > 3) {
        trend = "up";
      } else if (data.length < 2) {
        trend = "down";
      }
      
      return {
        chartData,
        total: data.length,
        trend
      };
    },
    placeholderData: { chartData: Array(7).fill({ date: "", value: 0 }), total: 0, trend: "neutral" as const }
  });

  // Query to get total patients count
  const { data: patientsCount = 0 } = useQuery({
    queryKey: ['patients-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { count, error } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Query to get the next appointment
  const { data: nextAppointment } = useQuery({
    queryKey: ['next-appointment'],
    queryFn: async () => {
      const today = new Date();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          id,
          visit_date,
          appointment_time,
          patient:patients(first_name, last_name)
        `)
        .gte('visit_date', today.toISOString())
        .order('visit_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const appointment = data[0];
        // Format the date and time
        const visitDate = new Date(appointment.visit_date);
        const isToday = visitDate.toDateString() === today.toDateString();
        
        return {
          exists: true,
          isToday,
          time: appointment.appointment_time,
          date: visitDate
        };
      }
      
      return { exists: false };
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title={t('today_appointments')}
        value={weeklyAppointments?.total || 0}
        description={t('appointments_last_7_days')}
        icon={<Calendar />}
        chartData={weeklyAppointments?.chartData}
        trend={weeklyAppointments?.trend}
        className="col-span-2"
      />
      <StatsCard
        title={t('total_patients')}
        value={patientsCount}
        icon={<Users />}
      />
      <StatsCard
        title={t('next_appointment')}
        value={nextAppointment?.exists 
          ? (nextAppointment.isToday ? t('today') : format(nextAppointment.date, 'MMM dd'))
          : t('none')}
        description={nextAppointment?.exists 
          ? (t('at') + " " + nextAppointment.time) 
          : t('no_future_appointments')}
        icon={<Activity />}
      />
    </div>
  );
};
