import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const LoginForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Listen for auth state changes to handle errors
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        console.error('Authentication error occurred');
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred during authentication. Please try again.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('login_title')}
      </h2>
      <div className="space-y-4">
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: {
                background: 'rgb(37 99 235)',
                color: 'white',
                borderRadius: '0.375rem',
              },
              input: {
                borderRadius: '0.375rem',
              },
              message: {
                borderRadius: '0.375rem',
              }
            }
          }}
          view="sign_in"
          showLinks={true}
          redirectTo={`${window.location.origin}/auth`}
        />
      </div>
    </div>
  );
};

export default LoginForm;