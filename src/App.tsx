import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider } from "next-themes";
import { useLanguage } from "@/stores/useLanguage";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import PatientDetails from "./pages/PatientDetails";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { fetchTranslations } = useLanguage();

  useEffect(() => {
    // Fetch translations on app initialization
    fetchTranslations();
  }, [fetchTranslations]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsAuthenticated(false);
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          return;
        }

        // Check if session is valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth event:', event);
          
          if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            queryClient.clear();
          } else if (event === 'SIGNED_IN') {
            setIsAuthenticated(true);
          } else if (event === 'TOKEN_REFRESHED') {
            setIsAuthenticated(true);
          } else if (event === 'USER_UPDATED') {
            setIsAuthenticated(true);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
        toast.error("Authentication error. Please try logging in again.");
      }
    };

    initializeAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/patients" 
                element={isAuthenticated ? <Index /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/calendar" 
                element={isAuthenticated ? <Index view="calendar" /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/settings" 
                element={isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />} 
              />
              <Route 
                path="/auth/*" 
                element={!isAuthenticated ? <Auth /> : <Navigate to="/" replace />} 
              />
              <Route 
                path="/patient/:id" 
                element={isAuthenticated ? <PatientDetails /> : <Navigate to="/auth" replace />} 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;