import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AuthProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
  onAuthStateChange: (isAuthenticated: boolean) => void;
}

export const AuthProvider = ({ children, queryClient, onAuthStateChange }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            onAuthStateChange(false);
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            onAuthStateChange(false);
          }
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          await supabase.auth.signOut();
          if (mounted) {
            setIsAuthenticated(false);
            onAuthStateChange(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          onAuthStateChange(true);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth event:', event);
          
          if (!mounted) return;

          if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            onAuthStateChange(false);
            queryClient.clear();
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            try {
              const { data: { user }, error } = await supabase.auth.getUser();
              if (error || !user) throw error;
              setIsAuthenticated(true);
              onAuthStateChange(true);
            } catch (error) {
              console.error('Auth state change error:', error);
              setIsAuthenticated(false);
              onAuthStateChange(false);
            }
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          onAuthStateChange(false);
          toast.error("Authentication error. Please try logging in again.");
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [onAuthStateChange, queryClient]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};