import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { Stethoscope, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Auth = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        navigate("/", { replace: true });
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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

      {/* Right side - Auth forms */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col relative">
        {/* Language Toggle */}
        <div className="absolute top-4 right-4">
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
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </div>
        
        <div className="fixed bottom-4 right-4">
          <BuyMeCoffeeButton />
        </div>
      </div>
    </div>
  );
};

export default Auth;