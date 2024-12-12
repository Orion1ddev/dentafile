import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/stores/useLanguage";
import { DentalRecordEditDialog } from "@/components/DentalRecordEditDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface DentalRecord {
  id: string;
  visit_date: string;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  images: string[] | null;
}

interface DentalRecordsListProps {
  records: DentalRecord[];
  patientId: string;
}

export const DentalRecordsList = ({ records, patientId }: DentalRecordsListProps) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const formatDisplayDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const handleDeleteVisit = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this visit record? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('dental_records')
      .delete()
      .eq('id', recordId);

    if (error) {
      toast.error('Failed to delete visit record');
      return;
    }

    toast.success('Visit record deleted successfully');
    queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
  };

  return (
    <div className="space-y-4">
      {records?.map((record) => (
        <Card key={record.id}>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">
              {t('visit')}: {formatDisplayDate(record.visit_date)}
            </CardTitle>
            <div className="flex items-center gap-2">
              <DentalRecordEditDialog record={record} patientId={patientId} />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteVisit(record.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p><strong>{t('diagnosis')}:</strong> {record.diagnosis || 'N/A'}</p>
                <p><strong>{t('treatment')}:</strong> {record.treatment || 'N/A'}</p>
                <p><strong>{t('notes')}:</strong> {record.notes || 'N/A'}</p>
              </div>
              {record.images && record.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">{t('photos')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {record.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Dental record ${index + 1}`}
                        className="rounded-lg object-cover w-full aspect-square"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};