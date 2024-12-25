import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PatientBasicInfo } from "./patient-form/PatientBasicInfo";
import { PatientContactInfo } from "./patient-form/PatientContactInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { uploadImageSecurely } from "@/utils/secureImageUpload";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/stores/useLanguage";
import { Edit2 } from "lucide-react";
import { PatientFormData } from "./patient-form/types";

const patientFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  medical_history: z.array(z.string()),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  avatar_url: z.string().optional()
});

interface PatientFormDialogProps {
  patient?: any;
  mode: 'create' | 'edit';
  trigger?: React.ReactNode;
}

export const PatientFormDialog = ({ patient, mode, trigger }: PatientFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: mode === 'edit' && patient ? {
      first_name: patient.first_name,
      last_name: patient.last_name,
      medical_history: patient.medical_history || [],
      email: patient.email,
      phone: patient.phone,
      avatar_url: patient.avatar_url
    } : {
      medical_history: [],
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImageSecurely(file);
      form.setValue('avatar_url', imageUrl);
      toast.success(t('image_uploaded'));
    } catch (error: any) {
      toast.error(error.message || t('upload_failed'));
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (data: PatientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      const patientData = {
        ...data,
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('patients')
          .insert([{ ...patientData, user_id: user.id }]);

        if (error) throw error;
        toast.success(t("patient_created"));
      } else {
        const { error } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', patient.id);

        if (error) throw error;
        toast.success(t("patient_updated"));
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
            {mode === 'create' ? (
              <>{t('add_new_patient')}</>
            ) : (
              <><Edit2 className="h-4 w-4 mr-2" />{t('edit_patient')}</>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('add_new_patient') : t('edit_patient')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={form.watch('avatar_url')} />
                <AvatarFallback>
                  {form.watch('first_name')?.[0]}{form.watch('last_name')?.[0]}
                </AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="max-w-[250px]"
              />
            </div>
            <PatientBasicInfo form={form} />
            <PatientContactInfo form={form} />
            <Button type="submit" className="w-full">
              {mode === 'create' ? t('create_patient') : t('update_patient')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};