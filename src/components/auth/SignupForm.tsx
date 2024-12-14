import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const SignupForm = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('sign_up_title')}
      </h2>
      <div className="space-y-4">
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: {
                background: 'white',
                color: 'black',
                border: '1px solid #e5e7eb',
              }
            }
          }}
          providers={['google']}
          view="sign_up"
        />
      </div>
    </div>
  );
};

export default SignupForm;