import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

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
          onError={(error) => {
            console.error('Auth error:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          }}
        />
      </div>
    </div>
  );
};

export default LoginForm;