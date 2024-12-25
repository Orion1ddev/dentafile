import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
  onAuthStateChange: (isAuthenticated: boolean) => void;
}

export const AuthProvider = ({ children, queryClient, onAuthStateChange }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get the current session and refresh if needed
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            onAuthStateChange(false);
            navigate('/auth', { replace: true });
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            onAuthStateChange(false);
            navigate('/auth', { replace: true });
          }
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User error:', userError);
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            console.error('Session refresh error:', refreshError);
            if (mounted) {
              setIsAuthenticated(false);
              onAuthStateChange(false);
              navigate('/auth', { replace: true });
            }
            return;
          }

          // Session refreshed successfully
          if (mounted) {
            setIsAuthenticated(true);
            onAuthStateChange(true);
          }
          return;
        }

        if (!user) {
          if (mounted) {
            setIsAuthenticated(false);
            onAuthStateChange(false);
            navigate('/auth', { replace: true });
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          onAuthStateChange(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          onAuthStateChange(false);
          navigate('/auth', { replace: true });
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
        onAuthStateChange(false);
        queryClient.clear();
        navigate('/auth', { replace: true });
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        onAuthStateChange(true);
        navigate('/', { replace: true });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setIsAuthenticated(true);
        onAuthStateChange(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onAuthStateChange, queryClient, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};