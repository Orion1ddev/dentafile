import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { PatientFormDialog } from "./PatientFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/stores/useLanguage";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone?: string | null;
  email?: string | null;
  dental_records?: any[];
};

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export const PatientCard = ({ patient, onClick }: PatientCardProps) => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patient.id);

    if (error) {
      toast.error('Failed to delete patient');
      return;
    }

    toast.success('Patient deleted successfully');
    queryClient.invalidateQueries({ queryKey: ['patients'] });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-shadow group relative"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {patient.first_name} {patient.last_name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(patient.date_of_birth), 'dd.MM.yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <PatientFormDialog 
            patient={patient} 
            mode="edit"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p>{patient.gender}</p>
          {patient.phone && <p>{patient.phone}</p>}
          {patient.email && <p>{patient.email}</p>}
        </div>
      </CardContent>
    </Card>
  );
};