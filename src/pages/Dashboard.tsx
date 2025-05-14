
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { FileText, Calendar, Settings, Heart, User, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { Link } from "react-router-dom";

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
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
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
      const { data, error } = await supabase.from('dental_records').select(`
          *,
          patient:patients(*)
        `).eq('patients.user_id', user.id).gte('visit_date', startOfDay.toISOString()).lte('visit_date', endOfDay.toISOString());
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
        .eq('is_pinned', true);
      if (error) throw error;
      return data;
    },
    placeholderData: []
  });
  
  const featureCards = [
    {
      title: t('patient_records'),
      description: t('manage_patients'),
      icon: <Users />,
      path: "/patients"
    },
    {
      title: t('calendar'),
      description: t('manage_calendar'),
      icon: <Calendar />,
      path: "/calendar"
    },
    {
      title: t('settings'),
      description: t('settings_desc'),
      icon: <Settings />,
      path: "/settings"
    },
    {
      title: "Support DentaFile",
      description: "Help us improve DentaFile by supporting our development.",
      icon: <Heart />,
      path: "https://buymeacoffee.com/dentafile"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm">
      <BackgroundEffect />
      
      <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 px-[40px]">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                DentaFile
              </h1>
            </div>
            <div className="flex items-center">
              <NavMenu />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-2 sm:px-4 lg:px-6 relative z-0">
        <div className="max-w-5xl mx-auto">
          {/* Hero section */}
          <section className="mb-8">
            <WelcomeCard 
              userProfile={userProfile} 
              appointmentCount={todayAppointments?.length || 0}
              pinnedPatientsCount={pinnedPatients?.length || 0}
            />
            <DashboardStats />
          </section>
          
          {/* Feature cards */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground/90">
              {t('quick_access')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card, index) => (
                <FeatureCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  onClick={() => {
                    if (card.path.startsWith('http')) {
                      window.open(card.path, '_blank');
                    } else {
                      navigate(card.path);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
