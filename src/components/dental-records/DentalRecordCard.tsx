
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DentalNoteEditDialog } from "./DentalNoteEditDialog";
import { useLanguage } from "@/stores/useLanguage";
import { useState } from "react";
import { ImageViewer } from "./ImageViewer";
import { AppointmentEditDialog } from "../appointments/AppointmentEditDialog";

interface DentalRecord {
  id: string;
  visit_date: string;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  images: string[] | null;
  appointment_time: string | null;
  operation_type: string | null;
}

interface DentalRecordCardProps {
  record: DentalRecord;
  patientId: string;
  onDelete: (recordId: string) => void;
  isAppointment?: boolean;
}

export const DentalRecordCard = ({
  record,
  patientId,
  onDelete,
  isAppointment = false
}: DentalRecordCardProps) => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const formatDisplayDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };
  
  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time.substring(0, 5); // Only show HH:mm, removing seconds
  };
  
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  return (
    <Card key={record.id} className="bg-secondary">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-lg">
          {formatDisplayDate(record.visit_date)}
          {isAppointment && record.appointment_time && ` - ${formatTime(record.appointment_time)}`}
        </CardTitle>
        <div className="flex items-center gap-2">
          {!isAppointment ? (
            <DentalNoteEditDialog record={record} patientId={patientId} />
          ) : (
            <AppointmentEditDialog appointment={record} />
          )}
          <Button variant="destructive" size="icon" onClick={() => onDelete(record.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isAppointment && (
            <div>
              <p><strong>{t('operation_type')}:</strong> {record.operation_type || 'N/A'}</p>
              <p><strong>{t('diagnosis')}:</strong> {record.diagnosis || 'N/A'}</p>
              <p><strong>{t('treatment')}:</strong> {record.treatment || 'N/A'}</p>
            </div>
          )}
          <p className="my-[4px]"><strong>{t('notes')}:</strong> {record.notes || 'N/A'}</p>
          {record.images && record.images.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">{t('photos')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {record.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer rounded-lg overflow-hidden hover:opacity-90 transition-opacity border border-gray-200"
                    onClick={() => handleImageClick(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Dental record ${index + 1}`} 
                      className="rounded-lg w-full aspect-square object-contain" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {selectedImage && (
        <ImageViewer 
          isOpen={!!selectedImage} 
          imageUrl={selectedImage} 
          onClose={closeImageViewer} 
        />
      )}
    </Card>
  );
};
