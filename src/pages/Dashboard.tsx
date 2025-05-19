
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { Calendar, Settings, Users, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { Link } from "react-router-dom";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    data: patientCount,
    error,
    refetch
  } = useQuery({
    queryKey: ['patient-count'],
    queryFn: async () => {
      const { count, error } = await supabase.from('patients').select('*', {
        count: 'exact',
        head: true
      });
      if (error) throw error;
      return count || 0;
    },
    retry: 1
  });
  
  const appFeatures = [{
    icon: <Users className="h-6 w-6 text-primary" />,
    title: t('patients'),
    description: t('patient_management_description'),
    action: () => navigate('/patients')
  }, {
    icon: <Calendar className="h-6 w-6 text-primary" />,
    title: t('calendar'),
    description: t('calendar_description'),
    action: () => navigate('/calendar')
  }, {
    icon: <Settings className="h-6 w-6 text-primary" />,
    title: t('settings'),
    description: t('settings_description'),
    action: () => navigate('/settings')
  }, {
    icon: <Heart className="h-6 w-6 text-primary" />,
    title: t('support_us'),
    description: t('support_description'),
    action: () => window.open('https://pinklastgirl.gumroad.com/l/dentafile', '_blank')
  }];
  
  useEffect(() => {
    document.title = "DentaFile - " + t('dashboard');
  }, [language, t]);

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return <ErrorDisplay onRetry={handleRetry} />;
  }

  return (
    <PageLayout>
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              DentaFile
            </h1>
            <NavMenu />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid gap-6">
          <WelcomeCard 
            userProfile={{
              first_name: "Doctor"
            }} 
            appointmentCount={0} 
            pinnedPatientsCount={0} 
          />
          
          <DashboardStats />
          
          <h2 className="text-2xl font-bold mt-4">{t('quick_access')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {appFeatures.map((feature, index) => (
              <FeatureCard 
                key={index} 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
                onClick={feature.action} 
              />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
