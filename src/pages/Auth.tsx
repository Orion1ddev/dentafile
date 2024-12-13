import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Stethoscope, Menu } from "lucide-react";
import { useLanguage } from "@/stores/useLanguage";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');
  const { language, setLanguage, t, translations, fetchTranslations } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Fetch translations when component mounts
    fetchTranslations();
  }, [fetchTranslations]);

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

  // Show loading state while translations are being fetched
  if (!translations.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side - Welcome content */}
      {!isMobile && (
        <div className="w-full md:w-1/2 bg-blue-600 p-6 md:p-12 text-white flex flex-col justify-center">
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
      )}

      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
        {/* Language Toggle - Moved to top */}
        <div className="mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
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

        {/* Mobile header */}
        {isMobile && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-blue-600">DentaFile</h1>
            </div>
            <p className="text-gray-600">{t('welcome_title')}</p>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('login')}
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
                    button_label: t('login'),
                    link_text: t('sign_up'),
                  },
                  sign_up: {
                    email_label: t('email_label'),
                    password_label: t('password_label'),
                    button_label: t('sign_up'),
                    link_text: t('login'),
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