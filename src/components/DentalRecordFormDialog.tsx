
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
import { z } from "zod"; // Change from type import to regular import
import { useLanguage } from "@/stores/useLanguage";
import { usePatients } from "@/hooks/usePatients";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Extending the schema to include patient selection
const formSchemaWithPatient = formSchema.extend({
  patient_id: z.string().min(1, "Patient is required")
});

type DentalRecordFormData = z.infer<typeof formSchema>;
type DentalRecordFormDataWithPatient = z.infer<typeof formSchemaWithPatient>;

interface DentalRecordFormDialogProps {
  patientId: string;
  trigger?: React.ReactNode;
  includePatientSelect?: boolean;
}

export const DentalRecordFormDialog = ({
  patientId,
  trigger,
  includePatientSelect = false
}: DentalRecordFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { patients, isLoading: patientsLoading } = usePatients("");
  
  // Determine which schema to use based on whether patient selection is needed
  const resolverSchema = includePatientSelect && !patientId ? formSchemaWithPatient : formSchema;
  
  const form = useForm({
    resolver: zodResolver(resolverSchema),
    defaultValues: {
      visit_date: new Date().toISOString().split('T')[0],
      appointment_time: '09:00',
      operation_type: '',
      notes: '',
      images: [],
      ...(includePatientSelect && !patientId ? { patient_id: '' } : {})
    }
  });

  const onSubmit = async (data: any) => {
    try {
      // Determine which patient ID to use - either from props or form selection
      const effectivePatientId = patientId || data.patient_id;
      
      if (!effectivePatientId) {
        toast.error(t("patient_required"));
        return;
      }
      
      const {
        error
      } = await supabase.from('dental_records').insert([{
        patient_id: effectivePatientId,
        visit_date: `${data.visit_date}T${data.appointment_time}:00`,
        appointment_time: data.appointment_time,
        operation_type: data.operation_type,
        notes: data.notes,
        images: data.images
      }]);
      
      if (error) throw error;
      
      toast.success(t("record_added"));
      
      // Invalidate multiple queries to ensure all views are updated
      queryClient.invalidateQueries({
        queryKey: ['patient', effectivePatientId]
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments']
      });
      queryClient.invalidateQueries({
        queryKey: ['monthly-appointments']
      });
      
      setOpen(false);
    } catch (error: any) {
      console.error('Operation error:', error);
      toast.error(error.message);
    }
  };

  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>
            {t('add_dental_record')}
          </Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] px-[10px] my-0 py-[10px]">
        <DialogHeader>
          <DialogTitle>{t('add_dental_record')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {includePatientSelect && !patientId && (
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patient')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_patient')} />
                        </SelectTrigger>
                        <SelectContent>
                          {patientsLoading ? (
                            <SelectItem value="loading" disabled>{t('loading')}...</SelectItem>
                          ) : (
                            patients?.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.first_name} {patient.last_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DentalRecordFormFields form={form as any} />
            <Button type="submit" className="w-full">
              {t('add_record')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>;
};
