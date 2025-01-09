import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DentalRecordFormDialog } from "@/components/DentalRecordFormDialog";
import { NavMenu } from "@/components/NavMenu";
import { useLanguage } from "@/stores/useLanguage";
import { DentalNoteFormDialog } from "./dental-records/DentalNoteFormDialog";

interface PatientHeaderProps {
  patient: {
    id: string;
  };
}

export const PatientHeader = ({ patient }: PatientHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBack = () => {
    navigate("/patients");
  };

  return (
    <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col py-4">
          <div className="flex items-center justify-start w-full mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-4 text-foreground hover:text-foreground/80"
              onClick={handleBack}
              aria-label={t('patient_list')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('patient_details')}</h1>
          </div>
          
          {/* Responsive button container */}
          <div className="flex md:flex-row flex-col gap-2 md:gap-4 w-full md:items-center">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
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
          
          <div className="absolute top-4 right-4">
            <NavMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};