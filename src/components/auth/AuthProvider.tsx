
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { Loading } from "@/components/ui/loading";

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
        // Add a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.log('Auth initialization timed out, proceeding as unauthenticated');
            handleUnauthenticated();
          }
        }, 5000);

        const { data: { session } } = await supabase.auth.getSession();
        
        // Clear timeout as we got a response
        clearTimeout(timeoutId);
        
        if (!mounted) return;
        
        if (session) {
          handleAuthenticated();
        } else {
          handleUnauthenticated();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          handleUnauthenticated();
        }
      } finally {
        if (mounted) {
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
    return <Loading fullScreen text="Initializing application..." />;
  }

  return <>{children}</>;
};
