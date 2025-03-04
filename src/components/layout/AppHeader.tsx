
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavMenu } from "@/components/NavMenu";
import { PatientFormDialog } from "@/components/PatientFormDialog";
import { DentalRecordFormDialog } from "@/components/DentalRecordFormDialog";
import { useLanguage } from "@/stores/useLanguage";

interface AppHeaderProps {
  view?: "list" | "calendar";
}

export const AppHeader = ({ view = "list" }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col py-4">
          <div className="flex items-center justify-between w-full px-[40px]">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="hidden md:flex items-center">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 onClick={() => navigate('/')} className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                DentaFile
              </h1>
            </div>
            
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-4">
              {view === "list" && <PatientFormDialog mode="create" />}
              {view === "calendar" && (
                <DentalRecordFormDialog 
                  patientId="" 
                  trigger={
                    <Button>
                      {t('add_appointment')}
                    </Button>
                  }
                />
              )}
              <NavMenu />
            </div>
          </div>
          
          {/* Mobile buttons */}
          <div className="md:hidden flex flex-col gap-2 mt-4">
            {view === "list" && <PatientFormDialog mode="create" />}
            {view === "calendar" && (
              <DentalRecordFormDialog 
                patientId="" 
                trigger={
                  <Button>
                    {t('add_appointment')}
                  </Button>
                }
              />
            )}
          </div>
          
          {/* Mobile NavMenu */}
          <div className="md:hidden absolute top-4 right-4">
            <NavMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};
