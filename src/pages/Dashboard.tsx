import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { Users, Calendar, Clock, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { AppointmentsList } from "@/components/dashboard/AppointmentsList";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: todayAppointments } = useQuery({
    queryKey: ['today-appointments'],
    queryFn: async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          *,
          patient:patients(*)
        `)
        .eq('patients.user_id', user.id)
        .gte('visit_date', startOfDay.toISOString())
        .lte('visit_date', endOfDay.toISOString());

      if (error) throw error;
      return data;
    }
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: pinnedPatients } = useQuery({
    queryKey: ['pinned-patients'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .eq('pinned', true);

      if (error) throw error;
      return data;
    }
  });

  const dashboardItems = [
    {
      title: t('patient_list'),
      icon: Users,
      description: t('manage_patients'),
      onClick: () => navigate('/patients'),
      count: null
    },
    {
      title: t('calendar'),
      icon: Calendar,
      description: t('view_appointments'),
      onClick: () => navigate('/calendar'),
      count: null
    },
    {
      title: t('today_appointments'),
      icon: Clock,
      description: t('today_schedule'),
      count: todayAppointments?.length || 0
    },
    {
      title: t('settings'),
      icon: Settings,
      description: t('app_settings'),
      onClick: () => navigate('/settings'),
      count: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                DentaFile
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <WelcomeCard 
            userProfile={userProfile}
            appointmentCount={todayAppointments?.length || 0}
            pinnedPatientsCount={pinnedPatients?.length || 0}
          />
          
          <DashboardGrid items={dashboardItems} />
          
          <AppointmentsList appointments={todayAppointments} />
        </div>
      </main>
      <div className="fixed bottom-4 right-4">
        <BuyMeCoffeeButton />
      </div>
      <NavMenu />
    </div>
  );
};

export default Dashboard;
