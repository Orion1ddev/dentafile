import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          handleUnauthenticated();
          return;
        }

        if (!session) {
          handleUnauthenticated();
          return;
        }

        // Verify user exists
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          handleUnauthenticated();
          return;
        }

        handleAuthenticated();
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleUnauthenticated();
      }
    };

    const handleAuthenticated = () => {
      if (!mounted) return;
      setIsAuthenticated(true);
      onAuthStateChange(true);
      setIsLoading(false);
      
      if (location.pathname.startsWith('/auth')) {
        navigate('/', { replace: true });
      }
    };

    const handleUnauthenticated = () => {
      if (!mounted) return;
      setIsAuthenticated(false);
      onAuthStateChange(false);
      queryClient.clear();
      setIsLoading(false);
      
      if (!location.pathname.startsWith('/auth')) {
        navigate('/auth', { replace: true });
      }
    };

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN' && session) {
        handleAuthenticated();
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        handleUnauthenticated();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onAuthStateChange, queryClient, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};