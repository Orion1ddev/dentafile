import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/stores/useLanguage";
import { CalendarView } from "@/components/CalendarView";
import { AppHeader } from "@/components/layout/AppHeader";
import { PatientsListView } from "@/components/patients/PatientsListView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { usePatients } from "@/hooks/usePatients";
import { PageTransition } from "@/components/effects/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";

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
  const [retryCount, setRetryCount] = useState(0);

  const {
    patients,
    error,
    refetch
  } = usePatients(searchQuery);

  useEffect(() => {
    // Cleanup auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Verify auth state on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Authentication error occurred");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // If we're at the root path, redirect to /patients
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/patients');
    }
  }, [location.pathname, navigate]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  // If there's an error, show an error message with a retry button
  if (error) {
    return <ErrorDisplay onRetry={handleRetry} />;
  }

  return (
    <PageLayout>
      <AppHeader view={view} />
      
      <PageTransition mode="slide" className="container mx-auto py-8 px-2 sm:px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {view === "list" && (
            <PatientsListView 
              patients={patients}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {view === "calendar" && <CalendarView />}
        </div>
      </PageTransition>
    </PageLayout>
  );
};

export default Index;
