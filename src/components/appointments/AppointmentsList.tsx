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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {format(selectedDate, 'MMMM d, yyyy')} - {appointments?.length || 0} {t('appointments')}
      </h3>
      
      <div className="space-y-4">
        {appointments?.map((record) => (
          <div key={record.id} className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {record.operation_type}
            </div>
            <PatientCard
              patient={record.patient}
              onClick={() => navigate(`/patient/${record.patient.id}`)}
            />
          </div>
        ))}
        {appointments?.length === 0 && (
          <div className="text-center text-muted-foreground">
            {t('no_appointments')}
          </div>
        )}
      </div>
    </div>
  );
};