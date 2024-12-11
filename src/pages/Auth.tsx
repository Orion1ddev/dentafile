import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Stethoscope, Languages } from "lucide-react";
import { useLanguage } from "@/stores/useLanguage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');
  const { language, setLanguage, t } = useLanguage();

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
            {t('welcome_title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('patient_cards_title')}</h3>
              <p className="text-blue-100">
                {t('patient_cards_desc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('record_keeping_title')}</h3>
              <p className="text-blue-100">
                {t('record_keeping_desc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('photo_storage_title')}</h3>
              <p className="text-blue-100">
                {t('photo_storage_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-1/2 p-12 flex flex-col">
        {/* Language Toggle */}
        <div className="self-end mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English {language === "en" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("tr")}>
                Türkçe {language === "tr" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {view === 'sign_in' ? t('login') : t('sign_up')}
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
              localization={{
                variables: {
                  sign_in: {
                    email_label: t('email_label'),
                    password_label: t('password_label'),
                  },
                  sign_up: {
                    email_label: t('email_label'),
                    password_label: t('password_label'),
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;