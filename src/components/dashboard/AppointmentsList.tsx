import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useLanguage } from "@/stores/useLanguage";
import { useNavigate } from "react-router-dom";

interface AppointmentsListProps {
  appointments: any[];
}

export const AppointmentsList = ({ appointments }: AppointmentsListProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!appointments || appointments.length === 0) return null;

  const formatAppointmentTime = (time: string | null) => {
    if (!time) return '';
    try {
      return format(new Date(`2000-01-01T${time}`), 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return time;
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">{t('today_appointments')}</h3>
      <div className="space-y-4">
        {appointments.map((record: any) => (
          <Card 
            key={record.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/patient/${record.patient.id}`)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">
                  {record.patient.first_name} {record.patient.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatAppointmentTime(record.appointment_time)}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {record.operation_type || t('consultation')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};