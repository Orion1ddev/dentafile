
import { format } from "date-fns";
import { PatientCard } from "../PatientCard";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/stores/useLanguage";

interface DentalRecord {
  id: string;
  visit_date: string;
  appointment_time: string;
  operation_type: string | null;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    created_at: string;
    date_of_birth: string;
    email: string | null;
    gender: string;
    medical_history: string[] | null;
    phone: string | null;
    pinned: boolean | null;
    updated_at: string;
    user_id: string | null;
  };
}

interface AppointmentsListProps {
  appointments: DentalRecord[] | undefined;
  selectedDate: Date;
}

export const AppointmentsList = ({ appointments, selectedDate }: AppointmentsListProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 p-2 bg-primary/10 rounded-md">
        {format(selectedDate, 'MMMM d, yyyy')} - {appointments?.length || 0} {t('appointments')}
      </h3>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((record) => (
              <div key={record.id} className="bg-card rounded-md p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-primary">
                    {record.appointment_time}
                  </div>
                  <div className="text-sm px-2 py-1 bg-primary/20 text-primary-foreground rounded-full">
                    {record.operation_type || t('consultation')}
                  </div>
                </div>
                <PatientCard
                  patient={record.patient}
                  onClick={() => navigate(`/patient/${record.patient.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-card p-6 rounded-md text-muted-foreground h-32 flex items-center justify-center">
            {t('no_appointments')}
          </div>
        )}
      </div>
    </div>
  );
};
