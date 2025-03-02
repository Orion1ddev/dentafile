
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PatientCard } from "@/components/PatientCard";
import { PatientFilter } from "@/components/PatientFilter";
import { PatientFormDialog } from "@/components/PatientFormDialog";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { CalendarView } from "@/components/CalendarView";
import { ChevronLeft } from "lucide-react";
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";
import { Loading } from "@/components/ui/loading";

type Patient = Database['public']['Tables']['patients']['Row'];

interface IndexProps {
  view?: "list" | "calendar";
}

const Index = ({
  view = "list"
}: IndexProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
  const [pageReady, setPageReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Set page as ready after a small delay to prevent flash of loading state
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 300);

    // Cleanup auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change in Index page:', event);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Verify auth state on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found in Index page, redirecting to auth');
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Track when user is actively searching
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const {
    data: patients,
    isLoading,
    error,
    isInitialLoading,
    refetch
  } = useQuery({
    queryKey: ['patients', searchQuery],
    queryFn: async () => {
      try {
        console.log('Fetching patients data, search query:', searchQuery);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user found when fetching patients');
          throw new Error("Not authenticated");
        }
        
        console.log('User authenticated, user ID:', user.id);
        let query = supabase.from('patients')
          .select('*, dental_records(*)')
          .eq('user_id', user.id)
          .order('pinned', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (searchQuery) {
          query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        
        console.log(`Successfully fetched ${data?.length || 0} patients`);
        return data as Patient[];
      } catch (error) {
        console.error('Error in patients query:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 60000 // 1 minute
  });

  // Handle error with retry button
  useEffect(() => {
    if (error) {
      console.error('Error loading patients:', error);
      toast.error("Error loading patients. Please try again.");
    }
  }, [error]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  // If we're at the root path, redirect to /patients
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/patients');
    }
  }, [location.pathname, navigate]);

  // Show loading state only when page is first loading, not during search
  if (!pageReady || (isInitialLoading && !isSearching)) {
    return <Loading text={view === "list" ? "Loading patients..." : "Loading calendar..."} />;
  }

  // If there's an error, show an error message with a retry button
  if (error && !isSearching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        <BackgroundEffect />
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">Unable to load data</h2>
          <p className="mb-6 text-muted-foreground">There was a problem connecting to the database. Please check your connection and try again.</p>
          <Button onClick={handleRetry}>
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm">
      <BackgroundEffect />
      <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col py-4">
            <div className="flex items-center justify-between w-full px-[40px]">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/')} className="hidden md:flex items-center">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 onClick={() => navigate('/')} className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                  DentaFile
                </h1>
              </div>
              
              {/* Desktop buttons */}
              <div className="hidden md:flex items-center gap-4">
                {view === "list" && <PatientFormDialog mode="create" />}
                <NavMenu />
              </div>
            </div>
            
            {/* Mobile buttons */}
            <div className="md:hidden flex flex-col gap-2 mt-4">
              {view === "list" && <PatientFormDialog mode="create" />}
            </div>
            
            {/* Mobile NavMenu */}
            <div className="md:hidden absolute top-4 right-4">
              <NavMenu />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-2 sm:px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {view === "list" && (
            <>
              <PatientFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              {isLoading && !isSearching ? (
                <div className="text-center py-12">
                  <Loading size="small" text={t('loading')} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {patients?.length ? (
                    patients.map(patient => (
                      <PatientCard 
                        key={patient.id} 
                        patient={patient} 
                        onClick={() => navigate(`/patient/${patient.id}`)} 
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      {searchQuery ? (
                        <p className="text-muted-foreground">No patients found matching your search</p>
                      ) : (
                        <p className="text-muted-foreground">No patients found. Add your first patient to get started.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {view === "calendar" && <CalendarView />}
        </div>
      </main>
    </div>
  );
};

export default Index;
