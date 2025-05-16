
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/stores/useLanguage";
import { CalendarView } from "@/components/CalendarView";
import { Loading } from "@/components/ui/loading";
import { AppHeader } from "@/components/layout/AppHeader";
import { PatientsListView } from "@/components/patients/PatientsListView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { usePatients } from "@/hooks/usePatients";
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";
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
  const [pageReady, setPageReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const {
    patients,
    isLoading,
    error,
    isInitialLoading,
    refetch
  } = usePatients(searchQuery);

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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No session found in Index page, redirecting to auth');
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

  // Show loading state only when page is first loading
  if (!pageReady || isInitialLoading) {
    return <Loading text={view === "list" ? t('loading_patients') : t('loading_calendar')} />;
  }

  // If there's an error, show an error message with a retry button
  if (error) {
    return <ErrorDisplay onRetry={handleRetry} />;
  }

  return (
    <PageLayout>
      <AppHeader view={view} />
      
      <PageTransition className="container mx-auto py-8 px-2 sm:px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {view === "list" && (
            <PatientsListView 
              patients={patients}
              isLoading={isLoading}
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
