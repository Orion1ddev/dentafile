
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AppointmentEditDialog } from "./AppointmentEditDialog";

interface AppointmentCardActionsProps {
  appointment: {
    id: string;
    visit_date: string;
    appointment_time: string | null;
    operation_type: string | null;
    diagnosis: string | null;
    treatment: string | null;
    notes: string | null;
    images: string[] | null;
  };
  onEditClick?: (e: React.MouseEvent) => void;
}

export const AppointmentCardActions = ({ appointment, onEditClick }: AppointmentCardActionsProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('dental_records')
      .delete()
      .eq('id', appointment.id);

    if (error) {
      toast.error('Failed to delete appointment');
      return;
    }

    toast.success('Appointment deleted successfully');
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    queryClient.invalidateQueries({ queryKey: ['monthly-appointments'] });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditClick) {
      onEditClick(e);
    }
  };

  return (
    <div className="flex gap-2">
      <AppointmentEditDialog 
        appointment={appointment}
        onEditClick={handleEditClick}
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
