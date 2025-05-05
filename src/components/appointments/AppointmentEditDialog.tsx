
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
import { useParams } from "react-router-dom";

type AppointmentFormData = z.infer<typeof formSchema>;

interface AppointmentEditDialogProps {
  appointment: {
    id: string;
    visit_date: string;
    appointment_time: string | null;
    operation_type: string | null;
    notes: string | null;
    images: string[] | null;
  };
}

export const AppointmentEditDialog = ({ appointment }: AppointmentEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { id: patientId } = useParams();
  
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visit_date: appointment.visit_date ? new Date(appointment.visit_date).toISOString().split('T')[0] : '',
      appointment_time: appointment.appointment_time || '',
      operation_type: appointment.operation_type || '',
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
          notes: data.notes,
          images: data.images
        })
        .eq('id', appointment.id);

      if (error) throw error;
      
      toast.success(t("appointment_updated"));
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-appointments'] });
      setOpen(false);
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
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
