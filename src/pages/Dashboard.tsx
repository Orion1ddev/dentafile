import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { FileText, Calendar, Settings, Sun, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  
  useEffect(() => {
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const {
    data: userProfile
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data;
    }
  });

  const {
    data: todayAppointments
  } = useQuery({
    queryKey: ['today-appointments'],
    queryFn: async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const {
        data,
        error
      } = await supabase.from('dental_records').select(`
          *,
          patient:patients(*)
        `).eq('patients.user_id', user.id).gte('visit_date', startOfDay.toISOString()).lte('visit_date', endOfDay.toISOString());
      if (error) throw error;
      return data;
    }
  });

  const {
    data: pinnedPatients
  } = useQuery({
    queryKey: ['pinned-patients'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const {
        data,
        error
      } = await supabase.from('patients').select('*').eq('user_id', user.id).eq('pinned', true);
      if (error) throw error;
      return data;
    }
  });

  const dashboardTiles = [
    {
      title: t('welcome'),
      description: t('welcome_desc'),
      icon: <Sun className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
      pattern: "radial-gradient(circle, rgba(255,255,255,0.2) 10%, transparent 10.5%) 0 0/20px 20px",
      href: "",
      stats: [{
        label: t('today_appointments'),
        value: todayAppointments?.length || 0
      }, {
        label: t('pinned_patients'),
        value: pinnedPatients?.length || 0
      }],
      colSpan: "col-span-2"
    },
    {
      title: t('patient_records'),
      description: t('manage_patients'),
      icon: <FileText className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-gray-400 to-gray-600",
      pattern: "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent) 0 0/40px 40px",
      href: "/patients"
    },
    {
      title: t('calendar'),
      description: t('manage_calendar'),
      icon: <Calendar className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      pattern: "radial-gradient(circle, rgba(255,255,255,0.2) 25%, transparent 25.5%) 0 0/40px 40px",
      href: "/calendar"
    },
    {
      title: t('settings'),
      description: t('settings_desc'),
      icon: <Settings className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-gray-300 to-gray-500",
      pattern: "repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px)",
      href: "/settings"
    },
    {
      title: "Support DentaFile",
      description: "Help us improve DentaFile by supporting our development.",
      icon: <Heart className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
      pattern: "radial-gradient(circle, rgba(255,255,255,0.2) 10%, transparent 10.5%) 0 0/30px 30px",
      href: "https://buymeacoffee.com/dentafile"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
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

      <main className="flex-1 container px-4 sm:px-6 md:px-[100px] lg:px-[190px] relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-0 px-0 py-[25px]">
          {dashboardTiles.map((tile, index) => (
            <div 
              key={index} 
              onClick={() => tile.href && navigate(tile.href)} 
              className={`
                rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300
                ${tile.href ? 'cursor-pointer transform hover:-translate-y-1' : ''}
                ${tile.colSpan || ''}
              `}
            >
              <div 
                className={`h-48 ${tile.bgColor} relative`} 
                style={{
                  backgroundImage: tile.pattern
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center py-0">
                  {tile.icon}
                </div>
              </div>
              <div className="p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">{tile.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tile.description}</p>
                
                {tile.stats && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {tile.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
