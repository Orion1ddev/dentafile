import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DentalRecordFormFields, formSchema } from "./dental-records/DentalRecordFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

type DentalRecordFormData = z.infer<typeof formSchema>;

interface DentalRecordFormDialogProps {
  patientId: string;
}

export const DentalRecordFormDialog = ({ patientId }: DentalRecordFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<DentalRecordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visit_date: new Date().toISOString().split('T')[0],
      appointment_time: '09:00',
      operation_type: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      images: [],
    },
  });

  const onSubmit = async (data: DentalRecordFormData) => {
    try {
      const { error } = await supabase
        .from('dental_records')
        .insert([{ 
          patient_id: patientId,
          visit_date: `${data.visit_date}T${data.appointment_time}:00`,
          appointment_time: data.appointment_time,
          operation_type: data.operation_type,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          notes: data.notes,
          images: data.images,
        }]);

      if (error) throw error;
      
      toast.success("Record added successfully");
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      setOpen(false);
    } catch (error: any) {
      console.error('Operation error:', error);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Dental Record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Dental Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DentalRecordFormFields form={form} />
            <Button type="submit" className="w-full">
              Add Record
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};