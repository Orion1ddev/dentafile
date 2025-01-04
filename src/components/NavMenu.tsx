import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";
import { useLanguage } from "@/stores/useLanguage";

const navLinkClasses = "flex items-center space-x-2 text-sm text-foreground";

export const NavMenu = () => {
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t bg-background/80 px-4 py-2 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between max-w-md mx-auto space-x-4">
        <NavLink to="/dashboard" className={navLinkClasses}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs">{t('dashboard')}</span>
        </NavLink>
        <NavLink to="/patients" className={navLinkClasses}>
          <Users className="h-5 w-5" />
          <span className="text-xs">{t('patients')}</span>
        </NavLink>
        <NavLink to="/calendar" className={navLinkClasses}>
          <Calendar className="h-5 w-5" />
          <span className="text-xs">{t('calendar')}</span>
        </NavLink>
        <NavLink to="/settings" className={navLinkClasses}>
          <Settings className="h-5 w-5" />
          <span className="text-xs">{t('settings')}</span>
        </NavLink>
      </div>
    </nav>
  );
};
