import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PatientBasicInfo } from "./patient-form/PatientBasicInfo";
import { PatientContactInfo } from "./patient-form/PatientContactInfo";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/stores/useLanguage";

export interface PatientFormDialogProps {
  mode: "create" | "edit";
  patientId?: string;
  trigger?: React.ReactNode;
}

export const PatientFormDialog = ({ mode, patientId, trigger }: PatientFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const handleSubmit = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const patientData = {
        user_id: user.id,
        first_name: data.first_name,
        last_name: data.last_name,
        medical_history: data.medical_history || [],
        email: data.email,
        phone: data.phone,
        avatar_url: data.avatar_url,
      };

      if (mode === "create") {
        const { error } = await supabase
          .from('patients')
          .insert([patientData]);

        if (error) throw error;
        toast.success(t('patient_created'));
      } else {
        const { error } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', patientId);

        if (error) throw error;
        toast.success(t('patient_updated'));
      }

      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {mode === "create" ? t('add_patient') : t('edit_patient')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t('add_patient') : t('edit_patient')}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <PatientBasicInfo onSubmit={handleSubmit} mode={mode} patientId={patientId} />
          <PatientContactInfo />
        </div>
      </DialogContent>
    </Dialog>
  );
};