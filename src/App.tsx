
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
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence>
        <motion.div 
          className="min-h-screen flex items-center justify-center bg-background/60 fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center p-8 rounded-lg bg-card/30 backdrop-blur-md shadow-lg"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <motion.div 
              className="relative h-16 w-16 mb-4"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-primary"></div>
            </motion.div>
            
            <motion.h3 
              className="text-xl font-medium mb-2 text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading Translations
            </motion.h3>
            
            <motion.p 
              className="text-muted-foreground text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Preparing your experience...
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
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
