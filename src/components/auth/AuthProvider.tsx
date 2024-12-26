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

    const handleAuthChange = async (session: any) => {
      if (!mounted) return;

      if (!session) {
        setIsAuthenticated(false);
        onAuthStateChange(false);
        queryClient.clear();
        
        if (!location.pathname.startsWith('/auth')) {
          navigate('/auth', { replace: true });
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          setIsAuthenticated(false);
          onAuthStateChange(false);
          queryClient.clear();
          
          if (!location.pathname.startsWith('/auth')) {
            navigate('/auth', { replace: true });
          }
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        onAuthStateChange(true);
        
        if (location.pathname.startsWith('/auth')) {
          navigate('/', { replace: true });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        onAuthStateChange(false);
        queryClient.clear();
        
        if (!location.pathname.startsWith('/auth')) {
          navigate('/auth', { replace: true });
        }
        setIsLoading(false);
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
          setIsLoading(false);
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