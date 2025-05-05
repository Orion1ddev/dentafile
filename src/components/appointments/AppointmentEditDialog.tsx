
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/stores/useLanguage";
import { DentalRecordFormFields, formSchema } from "../dental-records/DentalRecordFormFields";
import type { z } from "zod";

type AppointmentFormData = z.infer<typeof formSchema>;

interface AppointmentEditDialogProps {
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

export const AppointmentEditDialog = ({ appointment, onEditClick }: AppointmentEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visit_date: new Date(appointment.visit_date).toISOString().split('T')[0],
      appointment_time: appointment.appointment_time || '',
      operation_type: appointment.operation_type || '',
      diagnosis: appointment.diagnosis || '',
      treatment: appointment.treatment || '',
      notes: appointment.notes || '',
      images: appointment.images || []
    }
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const { error } = await supabase
        .from('dental_records')
        .update({
          visit_date: data.visit_date,
          appointment_time: data.appointment_time,
          operation_type: data.operation_type,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          notes: data.notes,
          images: data.images
        })
        .eq('id', appointment.id);

      if (error) throw error;
      
      toast.success(t("appointment_updated"));
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-appointments'] });
      setOpen(false);
    } catch (error: any) {
      console.error('Operation error:', error);
      toast.error(error.message);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onEditClick) {
      onEditClick(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          className="h-8 w-8"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('edit_appointment')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DentalRecordFormFields form={form} />
            <Button type="submit" className="w-full">
              {t('update_appointment')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
