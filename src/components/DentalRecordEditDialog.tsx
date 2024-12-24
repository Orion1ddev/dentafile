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
import { Pencil } from "lucide-react";
import { ImageUploadField } from "./dental-records/ImageUploadField";
import { useLanguage } from "@/stores/useLanguage";

interface DentalRecordFormData {
  visit_date: string;
  appointment_time: string | null;
  operation_type: string | null;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  images: string[] | null;
}

interface DentalRecordEditDialogProps {
  record: {
    id: string;
    visit_date: string;
    appointment_time: string | null;
    operation_type: string | null;
    diagnosis: string | null;
    treatment: string | null;
    notes: string | null;
    images: string[] | null;
  };
  patientId: string;
}

export const DentalRecordEditDialog = ({ record, patientId }: DentalRecordEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const form = useForm<DentalRecordFormData>({
    defaultValues: {
      visit_date: new Date(record.visit_date).toISOString().split('T')[0],
      appointment_time: record.appointment_time || '',
      operation_type: record.operation_type || '',
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      notes: record.notes || '',
      images: record.images || [],
    },
  });

  const onSubmit = async (data: DentalRecordFormData) => {
    try {
      const { error } = await supabase
        .from('dental_records')
        .update({ 
          visit_date: data.visit_date,
          appointment_time: data.appointment_time || null,
          operation_type: data.operation_type,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          notes: data.notes,
          images: data.images,
        })
        .eq('id', record.id);

      if (error) throw error;
      
      toast.success(t("appointment_updated"));
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
        <Button variant="outline" size="sm" className="ml-auto">
          <Pencil className="h-4 w-4 mr-2" />
          {t('edit_appointment')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('edit_appointment')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('visit_date')}</FormLabel>
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
                    <FormLabel>{t('time')}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                  <FormLabel>{t('operation_type')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Cleaning, Filling, etc." />
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
                  <FormLabel>{t('diagnosis')}</FormLabel>
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
                  <FormLabel>{t('treatment')}</FormLabel>
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
                  <FormLabel>{t('notes')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ImageUploadField form={form} />
            <Button type="submit" className="w-full">
              {t('update_appointment')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};