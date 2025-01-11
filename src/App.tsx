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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { fetchTranslations } = useLanguage();

  useEffect(() => {
    const initTranslations = async () => {
      try {
        await fetchTranslations();
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      }
    };

    initTranslations();
  }, [fetchTranslations]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
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