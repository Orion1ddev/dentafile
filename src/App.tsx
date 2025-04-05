
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useLanguage } from "@/stores/useLanguage";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { Loading } from "@/components/ui/loading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Increase retry attempts
      retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000), // Exponential backoff
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      refetchOnMount: true,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const { fetchTranslations } = useLanguage();
  const languageState = useLanguage();
  const translationsLoading = 'isLoading' in languageState ? languageState.isLoading : false;

  // Check if demo mode is enabled
  useEffect(() => {
    const demoMode = localStorage.getItem('demoMode') === 'true';
    if (demoMode) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const initTranslations = async () => {
      try {
        await fetchTranslations();
        setTranslationsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch translations:', error);
        // Set translations loaded to true even if there's an error
        // so the app can still function with fallback translations
        setTranslationsLoaded(true);
      }
    };

    initTranslations();
  }, [fetchTranslations]);

  // Show loading state until translations are loaded
  if (!translationsLoaded && translationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <Loading text="Loading translations..." size="large" />
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider 
              queryClient={queryClient}
              onAuthStateChange={setIsAuthenticated}
            >
              <AppRoutes isAuthenticated={isAuthenticated} />
              <Toaster />
              <Sonner />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
