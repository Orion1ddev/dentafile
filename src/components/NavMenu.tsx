
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/stores/useLanguage";
import { Moon, Sun, Languages, LogOut, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { exitDemoMode, isDemoMode } from "@/utils/demo";

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
      // Check if in demo mode
      if (isDemoMode()) {
        // Exit demo mode instead of signing out
        exitDemoMode();
        return;
      }
      
      // Normal logout flow for authenticated users
      navigate('/auth', {
        replace: true
      });
      localStorage.clear();
      const {
        error
      } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error(t("sign_out_error"));
        return;
      }
      toast.success(t("sign_out"));
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(t("sign_out_error"));
    }
  };
  
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 px-0 my-[17px] mx-0">
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
          {isDemoMode() ? t("exit_demo") : t("sign_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
};
