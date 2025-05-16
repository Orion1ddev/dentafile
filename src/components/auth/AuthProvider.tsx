
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!supabaseConfigured) {
      setIsLoading(false);
      console.error("Supabase is not properly configured");
      return;
    }

    // Function to update authentication state
    const updateAuthState = (newSession: Session | null) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      onAuthStateChange(!!newSession?.user);
      setIsLoading(false);
    };

    // Set up auth state listener
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log("Auth state change:", event);
          
          // Fix: Only check for SIGNED_OUT event which is a valid event type
          if (event === 'SIGNED_OUT') {
            // Clear any cached data in React Query
            queryClient.clear();
          }
          
          updateAuthState(newSession);
        }
      );

      // Check for existing session
      supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Failed to retrieve authentication session");
        }
        updateAuthState(currentSession);
      });

      // Cleanup subscription
      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error("Error in auth setup:", error);
      setIsLoading(false);
    }
  }, [onAuthStateChange, queryClient, supabaseConfigured]);

  const value = {
    session,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
