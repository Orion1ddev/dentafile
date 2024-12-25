import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
  onAuthStateChange: (isAuthenticated: boolean) => void;
}

export const AuthProvider = ({ children, queryClient, onAuthStateChange }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (session: any) => {
      if (!mounted) return;

      if (!session) {
        setIsAuthenticated(false);
        onAuthStateChange(false);
        queryClient.clear();
        
        // Only navigate to /auth if we're not already on an auth route
        if (!location.pathname.startsWith('/auth')) {
          navigate('/auth', { replace: true });
        }
        return;
      }

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          setIsAuthenticated(false);
          onAuthStateChange(false);
          queryClient.clear();
          
          // Only navigate to /auth if we're not already on an auth route
          if (!location.pathname.startsWith('/auth')) {
            navigate('/auth', { replace: true });
          }
          return;
        }

        setIsAuthenticated(true);
        onAuthStateChange(true);
        
        // If we're on an auth route and we're authenticated, navigate to home
        if (location.pathname.startsWith('/auth')) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        onAuthStateChange(false);
        queryClient.clear();
        
        // Only navigate to /auth if we're not already on an auth route
        if (!location.pathname.startsWith('/auth')) {
          navigate('/auth', { replace: true });
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthChange(session);
      } catch (error) {
        console.error('Init auth error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          onAuthStateChange(false);
          if (!location.pathname.startsWith('/auth')) {
            navigate('/auth', { replace: true });
          }
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      await handleAuthChange(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onAuthStateChange, queryClient, navigate, location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};