import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle auth errors through the error event listener
  useEffect(() => {
    const handleAuthError = (error: Error) => {
      if (error.message.includes('User already registered')) {
        toast({
          variant: "destructive",
          title: "Account Already Exists",
          description: "This email is already registered. Please try logging in instead.",
        });
        navigate('/auth');
      }
    };

    // Add error event listener
    const subscription = supabase.auth.onError(handleAuthError);

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('sign_up_title')}
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
          view="sign_up"
          showLinks={true}
          redirectTo={`${window.location.origin}/auth`}
        />
      </div>
    </div>
  );
};

export default SignupForm;