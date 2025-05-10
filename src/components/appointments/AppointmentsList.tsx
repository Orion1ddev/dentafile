
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/stores/useLanguage";
import { AppointmentCardActions } from "./AppointmentCardActions";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export interface Appointment {
  id: string;
  patient: Patient;
  visit_date: string;
  appointment_time: string | null;
  operation_type: string | null;
  notes: string | null;
  images: string[] | null;
}

interface AppointmentsListProps {
  appointments?: Appointment[];
  selectedDate: Date;
}

export const AppointmentsList = ({ appointments = [], selectedDate }: AppointmentsListProps) => {
  const { t } = useLanguage();
  
  const formatTime = (time: string | null) => {
    if (!time) return "";
    
    try {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      return format(date, "h:mm a");
    } catch (error) {
      console.error("Error formatting time:", error);
      return time;
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {format(selectedDate, "MMMM d, yyyy")}
        </h3>
      </div>
      
      <div className="flex-1 overflow-auto">
        {appointments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <p>{t('no_appointments')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="bg-card">
                <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      {appointment.patient.first_name} {appointment.patient.last_name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(appointment.appointment_time)}
                    </p>
                  </div>
                  <AppointmentCardActions 
                    appointment={appointment} 
                    onEditClick={handleEditClick}
                  />
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  {appointment.operation_type && (
                    <p className="text-sm"><span className="font-medium">{t('procedure')}: </span>{appointment.operation_type}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
