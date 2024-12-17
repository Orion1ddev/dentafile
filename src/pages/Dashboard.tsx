import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { Users, Calendar, Clock, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";

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
          <h2 className="text-2xl font-bold mb-6">{t('dashboard')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardItems.map((item) => (
              <Card 
                key={item.title}
                className={`hover:shadow-lg transition-shadow ${item.onClick ? 'cursor-pointer' : ''}`}
                onClick={item.onClick}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {item.count !== null ? item.count : ""}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {todayAppointments && todayAppointments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">{t('today_appointments')}</h3>
              <div className="space-y-4">
                {todayAppointments.map((record: any) => (
                  <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/patient/${record.patient.id}`)}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">
                          {record.patient.first_name} {record.patient.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(record.visit_date), 'HH:mm')}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {record.treatment || t('consultation')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
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