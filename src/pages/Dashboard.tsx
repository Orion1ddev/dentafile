import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { FileText, Calendar, Settings, Sun, Moon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { useNavigate } from "react-router-dom";
import { Particles } from "@/components/ui/particles";
import { useTheme } from "@/components/theme-provider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();

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
      background: null,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: () => {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18 ? 
          <Sun className="h-12 w-12" /> : 
          <Moon className="h-12 w-12" />;
      },
      name: "",
      description: "",
      href: "#",
      cta: "",
      background: (
        <WelcomeCard 
          userProfile={userProfile}
          appointmentCount={todayAppointments?.length || 0}
          pinnedPatientsCount={pinnedPatients?.length || 0}
        />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: Settings,
      name: t('settings'),
      description: t('settings_desc'),
      href: '/settings',
      cta: t('change_settings'),
      background: null,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Calendar,
      name: t('calendar'),
      description: t('manage_calendar'),
      href: '/calendar',
      cta: t('view_calendar'),
      background: null,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: () => null,
      name: "Support DentaFile",
      description: "Help us improve DentaFile by supporting our development.",
      href: "https://buymeacoffee.com/dentafile",
      cta: "Support us ☕",
      background: null,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      <Particles
        className="absolute inset-0"
        quantity={50}
        ease={80}
        size={0.5}
        color={theme === "dark" ? "#ffffff" : "#000000"}
        refresh={false}
      />
      
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

      <main className="flex-1 flex items-center justify-center max-w-[2000px] mx-auto p-4">
        <div className="w-full space-y-8">
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name || 'welcome'} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </main>
      
      <NavMenu />
    </div>
  );
};

export default Dashboard;
