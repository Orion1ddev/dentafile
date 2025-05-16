import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
  queryClient: QueryClient;
  onAuthStateChange: (isAuthenticated: boolean) => void;
}

export const AuthProvider = ({ children, queryClient, onAuthStateChange }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!supabaseConfigured) {
      setIsLoading(false);
      console.error("Supabase is not properly configured");
      toast.error("Authentication service is not configured properly");
      return;
    }

    let mounted = true;
    let authTimeout: NodeJS.Timeout;

    // Function to update authentication state
    const updateAuthState = (newSession: Session | null) => {
      if (!mounted) return;
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        onAuthStateChange(true);
        if (location.pathname.startsWith('/auth')) {
          navigate('/', { replace: true });
        }
      } else {
        onAuthStateChange(false);
        queryClient.clear();
        if (!location.pathname.startsWith('/auth')) {
          navigate('/auth', { replace: true });
        }
      }
      
      setIsLoading(false);
    };

    // Set up auth state listener
    try {
      // Add a timeout to prevent infinite loading
      authTimeout = setTimeout(() => {
        if (mounted && isLoading) {
          console.warn('Auth initialization timed out');
          updateAuthState(null);
        }
      }, 5000); // 5 seconds timeout

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          if (!mounted) return;
          
          switch (event) {
            case 'SIGNED_IN':
              updateAuthState(newSession);
              break;
            case 'SIGNED_OUT':
              updateAuthState(null);
              break;
            case 'TOKEN_REFRESHED':
              const { data: { session: currentSession } } = await supabase.auth.getSession();
              updateAuthState(currentSession);
              break;
          }
        }
      );

      // Check for existing session
      supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Failed to retrieve authentication session");
          updateAuthState(null);
          return;
        }
        updateAuthState(currentSession);
      });

      // Cleanup
      return () => {
        mounted = false;
        clearTimeout(authTimeout);
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error("Error in auth setup:", error);
      if (mounted) {
        toast.error("Authentication setup failed");
        updateAuthState(null);
      }
    }
  }, [onAuthStateChange, queryClient, navigate, location.pathname, supabaseConfigured]);

  if (isLoading) {
    return <Loading text="Authenticating..." fullScreen />;
  }

  const value = {
    session,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
