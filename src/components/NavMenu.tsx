import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/stores/useLanguage";
import { Moon, Sun, Languages, LogOut, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export const NavMenu = () => {
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      // First check if we have a session
      const {
        data: {
          session
        },
        error: sessionError
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        // If there's no session, just clear everything and redirect
        localStorage.clear();
        navigate('/auth', {
          replace: true
        });
        return;
      }
      if (!session) {
        // No session found, just clear and redirect
        localStorage.clear();
        navigate('/auth', {
          replace: true
        });
        return;
      }

      // If we have a session, attempt to sign out
      const {
        error
      } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      // Clear any local storage or state
      localStorage.clear();
      toast.success(t("sign_out"));
      navigate('/auth', {
        replace: true
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if there's an error, we should clear local state and redirect
      localStorage.clear();
      navigate('/auth', {
        replace: true
      });
      toast.error(error.message || t("sign_out_error"));
    }
  };
  return <div className="fixed top-4 right-4 z-[100] my-[5px] mx-[14px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 py-0 px-0 rounded-sm mx-0 my-[36px]">
          <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {theme === "dark" ? t("light_mode") : t("dark_mode")}
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages className="mr-2 h-4 w-4" />
              {t("language")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English {language === "en" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("tr")}>
                Türkçe {language === "tr" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            {t("sign_out")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
};