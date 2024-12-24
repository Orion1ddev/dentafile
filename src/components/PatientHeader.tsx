import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DentalRecordFormDialog } from "@/components/DentalRecordFormDialog";
import { PatientFormDialog } from "@/components/PatientFormDialog";
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
        <div className="flex flex-col sm:flex-row sm:justify-between py-4 sm:h-16 sm:py-0">
          <div className="flex items-center mb-4 sm:mb-0">
            <Button
              variant="ghost"
              className="mr-4 text-foreground hover:text-foreground/80"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('patient_list')}
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('patient_details')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <PatientFormDialog 
              patient={patient} 
              mode="edit" 
              trigger={
                <Button variant="outline">
                  {t('edit_patient')}
                </Button>
              }
            />
            <DentalNoteFormDialog patientId={patient.id} />
            <DentalRecordFormDialog patientId={patient.id} />
            <NavMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};