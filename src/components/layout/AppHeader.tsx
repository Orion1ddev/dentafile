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
interface AppHeaderProps {
  view?: "list" | "calendar";
}
export const AppHeader = ({
  view = "list"
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  return <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col py-4">
          <div className="grid grid-cols-3 items-center w-full px-[20px] md:px-[40px]">
            {/* Left section - Quick Access Menu */}
            <div className="flex items-center justify-start">
              {isMobile ? <QuickAccessDrawer open={drawerOpen} onOpenChange={setDrawerOpen} /> : <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-accent/50 rounded-full" aria-label={t('dashboard')}>
                  <Menu className="h-5 w-5" />
                </Button>}
            </div>
            
            {/* Center section - Logo */}
            <div className="flex justify-center">
              <h1 onClick={() => navigate('/')} className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity" aria-label="DentaFile">
                DentaFile
              </h1>
            </div>
            
            {/* Right section - User Menu */}
            <div className="flex items-center justify-end">
              <NavMenu />
            </div>
          </div>
          
          {/* Action Buttons Section */}
          <div className="flex items-center justify-center mt-4 md:hidden">
            {view === "list" && <PatientFormDialog mode="create" />}
            {view === "calendar" && <DentalRecordFormDialog patientId="" trigger={<Button>
                    {t('add_appointment')}
                  </Button>} />}
          </div>
          
          {/* Desktop action buttons */}
          <div className="hidden md:flex items-center justify-center mt-4">
            {view === "list" && <PatientFormDialog mode="create" />}
            {view === "calendar"}
          </div>
        </div>
      </div>
    </nav>;
};