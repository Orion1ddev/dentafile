
import { useLanguage } from "@/stores/useLanguage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { DentalRecordCard } from "./dental-records/DentalRecordCard";

interface DentalRecord {
  id: string;
  visit_date: string;
  notes: string | null;
  images: string[] | null;
  appointment_time: string | null;
  operation_type: string | null;
}

interface DentalRecordsListProps {
  records: DentalRecord[];
  patientId: string;
}

export const DentalRecordsList = ({ records, patientId }: DentalRecordsListProps) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const handleDeleteVisit = async (recordId: string) => {
    if (!confirm(t('confirm_delete_record'))) {
      return;
    }

    const { error } = await supabase
      .from('dental_records')
      .delete()
      .eq('id', recordId);

    if (error) {
      toast.error(t('delete_record_error'));
      return;
    }

    toast.success(t('record_deleted'));
    queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
  };

  // Separate notes and appointments
  const notes = records.filter(record => !record.appointment_time);
  const appointments = records.filter(record => record.appointment_time);

  return (
    <div className="space-y-4">
      {notes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{t('notes')}</h3>
          <div className="space-y-4">
            {notes.map((record) => (
              <DentalRecordCard
                key={record.id}
                record={record}
                patientId={patientId}
                onDelete={handleDeleteVisit}
              />
            ))}
          </div>
        </div>
      )}

      {appointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{t('appointments')}</h3>
          <div className="space-y-4">
            {appointments.map((record) => (
              <DentalRecordCard
                key={record.id}
                record={record}
                patientId={patientId}
                onDelete={handleDeleteVisit}
                isAppointment
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
