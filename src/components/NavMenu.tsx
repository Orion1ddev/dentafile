import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useLanguage } from "@/stores/useLanguage";
import { Moon, Sun, Languages, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NavMenu = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success(t("sign_out"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          {theme === "dark" ? t("light_mode") : t("dark_mode")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <Languages className="mr-2 h-4 w-4" />
          English {language === "en" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("tr")}>
          <Languages className="mr-2 h-4 w-4" />
          Türkçe {language === "tr" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {t("sign_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};