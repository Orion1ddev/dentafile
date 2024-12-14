import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('login_title')}
      </h2>
      <div className="space-y-4">
        <div className="supabase-auth-ui">
          {supabase.auth.ui.createFormHelpers({
            view: 'sign_in',
            localization: {
              variables: {
                sign_in: {
                  email_label: t('email_label'),
                  password_label: t('password_label'),
                  button_label: t('login_title'),
                }
              }
            }
          })}
        </div>
        <div className="text-center mt-4">
          <Link 
            to="/auth/signup" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {t('signup_link')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;