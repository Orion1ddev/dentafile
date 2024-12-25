import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
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

    const handleAuthChange = async (session: any) => {
      if (!mounted) return;

      if (!session) {
        setIsAuthenticated(false);
        onAuthStateChange(false);
        queryClient.clear();
        navigate('/auth', { replace: true });
        return;
      }

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          setIsAuthenticated(false);
          onAuthStateChange(false);
          queryClient.clear();
          navigate('/auth', { replace: true });
          return;
        }

        setIsAuthenticated(true);
        onAuthStateChange(true);
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        onAuthStateChange(false);
        queryClient.clear();
        navigate('/auth', { replace: true });
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
          navigate('/auth', { replace: true });
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