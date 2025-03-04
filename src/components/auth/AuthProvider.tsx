
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
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
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <div className="relative flex flex-col items-center">
          <div className="h-16 w-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-primary/30 animate-pulse"></div>
          </div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
