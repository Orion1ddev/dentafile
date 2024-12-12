import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PatientBasicInfo } from "./patient-form/PatientBasicInfo";
import { PatientContactInfo } from "./patient-form/PatientContactInfo";
import { PatientGenderSelect } from "./patient-form/PatientGenderSelect";
import type { PatientFormData } from "./patient-form/types";

interface PatientFormDialogProps {
  patient?: any;
  mode: 'create' | 'edit';
  trigger?: React.ReactNode;
}

export const PatientFormDialog = ({ patient, mode, trigger }: PatientFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const form = useForm<PatientFormData>({
    defaultValues: mode === 'edit' && patient ? {
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      medical_history: patient.medical_history || [],
      email: patient.email,
      phone: patient.phone,
    } : {
      medical_history: [],
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to perform this action");
        navigate('/auth');
        return;
      }

      if (mode === 'create') {
        const { error } = await supabase
          .from('patients')
          .insert([{ ...data, user_id: user.id }]);

        if (error) throw error;
        toast.success("Patient created successfully");
      } else {
        const { error } = await supabase
          .from('patients')
          .update(data)
          .eq('id', patient.id);

        if (error) throw error;
        toast.success("Patient updated successfully");
      }

      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setOpen(false);
    } catch (error: any) {
      console.error('Operation error:', error);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === 'create' ? 'default' : 'outline'}>
            {mode === 'create' ? 'Add New Patient' : 'Edit Patient'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Patient' : 'Edit Patient'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PatientBasicInfo form={form} />
            <PatientGenderSelect form={form} />
            <PatientContactInfo form={form} />
            <Button type="submit" className="w-full">
              {mode === 'create' ? 'Create Patient' : 'Update Patient'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};