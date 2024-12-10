import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PatientCard } from "@/components/PatientCard";
import { PatientFilter } from "@/components/PatientFilter";
import { PatientFormDialog } from "@/components/PatientFormDialog";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/stores/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Patient = Database['public']['Tables']['patients']['Row'];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, fetchTranslations } = useLanguage();

  useEffect(() => {
    fetchTranslations();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, fetchTranslations]);

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients', searchQuery],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('patients')
        .select('*, dental_records(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Patient[];
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success(t("sign_out"));
  };

  if (error) {
    toast.error("Error loading patients");
  }

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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="mr-2"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Languages className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage('en')}>
                    English {language === 'en' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('tr')}>
                    Türkçe {language === 'tr' && '✓'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <PatientFormDialog mode="create" />
              <Button onClick={handleSignOut} variant="outline">
                {t('sign_out')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <PatientFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {isLoading ? (
            <div className="text-center py-12">{t('loading')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients?.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => navigate(`/patient/${patient.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;