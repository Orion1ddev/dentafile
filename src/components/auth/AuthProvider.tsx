
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";
import { motion } from "framer-motion";

interface AuthProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
  onAuthStateChange: (isAuthenticated: boolean) => void;
}

export const AuthProvider = ({ children, queryClient, onAuthStateChange }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication state...');
        
        // Add a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.log('Auth initialization timed out, proceeding as unauthenticated');
            handleUnauthenticated();
          }
        }, 3000);

        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Clear timeout as we got a response
        clearTimeout(timeoutId);
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          toast.error('Failed to authenticate. Please try again.');
          handleUnauthenticated();
          return;
        }
        
        if (session) {
          console.log('Session found, user is authenticated');
          handleAuthenticated();
        } else {
          console.log('No session found, user is unauthenticated');
          handleUnauthenticated();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          toast.error('Authentication error. Please reload the page.');
          handleUnauthenticated();
        }
      } finally {
        if (mounted) {
          // Always ensure loading state is set to false
          setIsLoading(false);
        }
      }
    };

    const handleAuthenticated = () => {
      setIsAuthenticated(true);
      onAuthStateChange(true);
      if (location.pathname.startsWith('/auth')) {
        navigate('/', { replace: true });
      }
    };

    const handleUnauthenticated = () => {
      setIsAuthenticated(false);
      onAuthStateChange(false);
      queryClient.clear();
      if (!location.pathname.startsWith('/auth')) {
        navigate('/auth', { replace: true });
      }
      setIsLoading(false); // Ensure loading is always set to false
    };

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session) {
        handleAuthenticated();
      } else if (event === 'SIGNED_OUT') {
        handleUnauthenticated();
      } else if (event === 'TOKEN_REFRESHED') {
        // Check session after token refresh
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          handleAuthenticated();
        } else {
          handleUnauthenticated();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onAuthStateChange, queryClient, navigate, location.pathname]);

  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-background/60 fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
            Loading Application
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
    );
  }

  return <>{children}</>;
};
