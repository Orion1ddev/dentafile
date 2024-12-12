import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useLanguage } from "@/stores/useLanguage";

interface PatientInfoProps {
  patient: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone: string | null;
    email: string | null;
  };
}

export const PatientInfo = ({ patient }: PatientInfoProps) => {
  const { t } = useLanguage();

  const formatDisplayDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          {patient.first_name} {patient.last_name}
        </CardTitle>
        <div className="text-muted-foreground">
          <p>{t('born')}: {formatDisplayDate(patient.date_of_birth)}</p>
          <p>{t('contact')}: {patient.phone || 'N/A'} • {patient.email || 'N/A'}</p>
        </div>
      </CardHeader>
    </Card>
  );
};