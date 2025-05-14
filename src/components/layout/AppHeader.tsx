
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavMenu } from "@/components/NavMenu";
import { PatientFormDialog } from "@/components/PatientFormDialog";
import { DentalRecordFormDialog } from "@/components/DentalRecordFormDialog";
import { useLanguage } from "@/stores/useLanguage";
import { QuickAccessDrawer } from "@/components/navigation/QuickAccessDrawer";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { BackButton } from "@/components/navigation/BackButton";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  view?: "list" | "calendar";
}

export const AppHeader = ({
  view = "list"
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo with Back Button */}
          <div className="flex items-center space-x-2">
            <BackButton />
            <h1 onClick={() => navigate('/')} className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity" aria-label="DentaFile">
              DentaFile
            </h1>
          </div>
          
          {/* Right section - User Menu */}
          <div className="flex items-center gap-2">
            {view === "list" && !isMobile && <PatientFormDialog mode="create" />}
            {view === "calendar" && !isMobile && <DentalRecordFormDialog patientId="" includePatientSelect={true} trigger={<Button className="mx-[14px]">{t('add_appointment')}</Button>} />}
            <NavMenu />
          </div>
        </div>
      </div>
    </nav>;
};
