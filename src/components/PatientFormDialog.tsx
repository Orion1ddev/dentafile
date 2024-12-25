import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PatientBasicInfo } from "./patient-form/PatientBasicInfo";
import { PatientContactInfo } from "./patient-form/PatientContactInfo";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PatientFormData, PatientFormDialogProps } from "./patient-form/types";

export const PatientFormDialog = ({
  mode = "create",
  patientId,
  defaultValues,
  onSubmitSuccess,
  trigger
}: PatientFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const form = useForm<PatientFormData>({
    defaultValues: defaultValues || {
      first_name: "",
      last_name: "",
      medical_history: [],
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const patientData = {
        ...data,
        user_id: user.id,
      };

      let error;
      if (mode === "create") {
        const { error: createError } = await supabase
          .from("patients")
          .insert([patientData]);
        error = createError;
      } else {
        const { error: updateError } = await supabase
          .from("patients")
          .update(patientData)
          .eq("id", patientId);
        error = updateError;
      }

      if (error) throw error;

      toast.success(t(mode === "create" ? "patient_created" : "patient_updated"));
      setOpen(false);
      form.reset();
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error(t("error_occurred"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("add_patient")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("add_patient") : t("edit_patient")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PatientBasicInfo form={form} />
            <PatientContactInfo form={form} />
            <Button type="submit" className="w-full">
              {mode === "create" ? t("add_patient") : t("save_changes")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};