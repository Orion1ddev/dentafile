import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUploadField } from "./dental-records/ImageUploadField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  visit_date: z.string().min(1, "Visit date is required"),
  appointment_time: z.string().min(1, "Appointment time is required"),
  operation_type: z.string().min(1, "Operation type is required"),
  diagnosis: z.string().nullable(),
  treatment: z.string().nullable(),
  notes: z.string().nullable(),
  images: z.array(z.string()).nullable(),
});

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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointment_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="operation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operation Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Cleaning, Filling, etc." required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ImageUploadField form={form} />
            <Button type="submit" className="w-full">
              Add Record
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};