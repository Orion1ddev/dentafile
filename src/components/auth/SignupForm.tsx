import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const SignupForm = () => {
  const { t } = useLanguage();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Terms and conditions will be displayed here");
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('sign_up_title')}
      </h2>
      <div className="space-y-4">
        <div className="supabase-auth-ui">
          {supabase.auth.ui.createFormHelpers({
            view: 'sign_up',
            localization: {
              variables: {
                sign_up: {
                  email_label: t('email_label'),
                  password_label: t('password_label'),
                  button_label: t('sign_up_title'),
                }
              }
            }
          })}
        </div>
        
        <div className="flex items-start space-x-2 mb-4">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            className="mt-1"
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600 cursor-pointer"
          >
            {t('terms_agreement')}{' '}
            <button
              onClick={handleTermsClick}
              className="text-blue-600 hover:underline"
            >
              {t('terms_and_conditions')}
            </button>
          </label>
        </div>

        <div className="text-center mt-4">
          <Link 
            to="/auth" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {t('login_link')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;