import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');

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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Welcome content */}
      <div className="w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Stethoscope className="h-8 w-8" />
            <h1 className="text-3xl font-bold">DentaFile</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-6">
            Welcome to DentaFile - Your Partner in Dental Practice Management
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Customizable Patient Cards</h3>
              <p className="text-blue-100">
                Design patient profiles to suit your needs with flexible, personalized fields.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Seamless Dental Record Keeping</h3>
              <p className="text-blue-100">
                Organize and access comprehensive patient records securely and effortlessly.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Photo Storage</h3>
              <p className="text-blue-100">
                Store and manage patient images, from X-rays to progress photos, all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-1/2 p-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {view === 'sign_in' ? 'Login' : 'Sign Up'}
          </h2>
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'rgb(37 99 235)',
                  color: 'white',
                  borderRadius: '0.5rem',
                },
                anchor: {
                  color: 'rgb(37 99 235)',
                },
              },
            }}
            providers={[]}
            view={view}
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
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;