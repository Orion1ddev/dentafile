import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session first
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (event === 'TOKEN_REFRESHED') {
        // Handle successful token refresh
        console.log('Token refreshed successfully');
      } else if (event === 'USER_UPDATED') {
        // Handle user data update
        console.log('User data updated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">DentaFile</h1>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: 'rgb(59 130 246)',
                color: 'white',
                borderRadius: '0.5rem',
              },
              anchor: {
                color: 'rgb(59 130 246)',
              },
            },
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Password',
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Auth;