
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { useLanguage } from "@/stores/useLanguage";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { Loading } from "@/components/ui/loading";

// Configure query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Reduced from 3 to improve UX
      retryDelay: (attempt) => Math.min(1000 * Math.pow(2, attempt), 30000),
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      refetchOnMount: "always",
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const { fetchTranslations } = useLanguage();
  const languageState = useLanguage();
  const translationsLoading = 'isLoading' in languageState ? languageState.isLoading : false;

  useEffect(() => {
    let mounted = true;

    const initTranslations = async () => {
      try {
        await fetchTranslations();
        if (mounted) {
          setTranslationsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error);
        if (mounted) {
          // Set translations loaded to true even if there's an error
          // so the app can still function with fallback translations
          setTranslationsLoaded(true);
        }
      }
    };

    initTranslations();

    return () => {
      mounted = false;
    };
  }, [fetchTranslations]);

  if (!translationsLoaded && translationsLoading) {
    return <Loading text="Loading Translations" fullScreen />;
  }

  return (
    <Suspense 
      fallback={<Loading text="Loading Application" fullScreen />}
    >
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
    </Suspense>
  );
};

export default App;
