
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DentalRecordFormDialog } from "@/components/DentalRecordFormDialog";
import { NavMenu } from "@/components/NavMenu";
import { useLanguage } from "@/stores/useLanguage";
import { DentalNoteFormDialog } from "./dental-records/DentalNoteFormDialog";
import { BackButton } from "./navigation/BackButton";

interface PatientHeaderProps {
  patient: {
    id: string;
  };
}

export const PatientHeader = ({ patient }: PatientHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo with Back Button */}
          <div className="flex items-center space-x-2">
            <BackButton to="/patients" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              DentaFile
            </h1>
          </div>
          
          {/* Right section - Action buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <DentalNoteFormDialog patientId={patient.id} />
              <DentalRecordFormDialog 
                patientId={patient.id} 
                trigger={
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    {t('add_dental_record')}
                  </Button>
                } 
              />
            </div>
            <NavMenu />
          </div>
        </div>
        
        {/* Mobile buttons - shown below navbar on small screens */}
        <div className="md:hidden flex flex-wrap gap-2 pb-2">
          <DentalNoteFormDialog patientId={patient.id} />
          <DentalRecordFormDialog 
            patientId={patient.id} 
            trigger={
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                {t('add_dental_record')}
              </Button>
            } 
          />
        </div>
      </div>
    </nav>
  );
};
