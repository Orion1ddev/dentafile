
import { useLanguage } from "@/stores/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "./StatsCard";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, Activity, Star } from "lucide-react";

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
        value={t('today')}
        description={t('at') + " 14:30"}
        icon={<Activity />}
      />
    </div>
  );
};
