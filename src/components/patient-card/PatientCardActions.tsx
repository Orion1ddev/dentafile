
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { PatientFormDialog } from "../PatientFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface PatientCardActionsProps {
  patient: {
    id: string;
  };
  onEditClick: (e: React.MouseEvent) => void;
}

export const PatientCardActions = ({ patient, onEditClick }: PatientCardActionsProps) => {
  const queryClient = useQueryClient();

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

  return (
    <div className="flex gap-2">
      <PatientFormDialog 
        patientId={patient.id} 
        mode="edit"
        trigger={
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditClick}
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
  );
};
