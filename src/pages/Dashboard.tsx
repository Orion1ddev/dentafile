import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { FileText, Search, Settings, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { useNavigate } from "react-router-dom";

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

  const features = [
    {
      Icon: FileText,
      name: t('patient_records'),
      description: t('manage_patients'),
      href: '/patients',
      cta: t('view_records'),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: Search,
      name: t('search_patients'),
      description: t('search_patients_desc'),
      href: '/patients',
      cta: t('search_now'),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: Settings,
      name: t('settings'),
      description: t('settings_desc'),
      href: '/settings',
      cta: t('change_settings'),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Calendar,
      name: t('calendar'),
      description: t('manage_calendar'),
      href: '/calendar',
      cta: t('view_calendar'),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: FileText,
      name: "Support DentaFile",
      description: "Help us improve DentaFile by supporting our development.",
      href: "https://buymeacoffee.com/dentafile",
      cta: "Support us ☕",
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                DentaFile
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[2000px] mx-auto p-4">
        <div className="space-y-8">
          <WelcomeCard 
            userProfile={userProfile}
            appointmentCount={todayAppointments?.length || 0}
            pinnedPatientsCount={pinnedPatients?.length || 0}
          />
          
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </main>
      <NavMenu />
    </div>
  );
};

export default Dashboard;