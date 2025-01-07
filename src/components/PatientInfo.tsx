import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/stores/useLanguage";
import { PatientFormDialog } from "./PatientFormDialog";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";

interface PatientInfoProps {
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string | null;
  };
}

export const PatientInfo = ({ patient }: PatientInfoProps) => {
  const { t } = useLanguage();

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl sm:text-2xl">
              {patient.first_name} {patient.last_name}
            </CardTitle>
            <div className="text-muted-foreground">
              <p>{capitalizeFirstLetter(t('contact'))}: {patient.phone || 'N/A'} • {patient.email || 'N/A'}</p>
            </div>
          </div>
          <PatientFormDialog 
            patientId={patient.id} 
            mode="edit"
            trigger={
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                {t('edit_patient')}
              </Button>
            }
          />
        </div>
      </CardHeader>
    </Card>
  );
};