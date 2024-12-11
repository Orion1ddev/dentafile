import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { uploadToImgBB } from "@/utils/imgbb";
import { useLanguage } from "@/stores/useLanguage";

interface DentalRecordFormData {
  visit_date: string;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  images: string[] | null;
}

interface DentalRecordFormDialogProps {
  patientId: string;
}

export const DentalRecordFormDialog = ({ patientId }: DentalRecordFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const { t } = useLanguage();
  
  const form = useForm<DentalRecordFormData>({
    defaultValues: {
      visit_date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      treatment: '',
      notes: '',
      images: [],
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        try {
          const url = await uploadToImgBB(file);
          uploadedUrls.push(url);
          toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`Error uploading ${file.name}`);
        }
      }

      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: DentalRecordFormData) => {
    try {
      const { error } = await supabase
        .from('dental_records')
        .insert([{ 
          patient_id: patientId,
          visit_date: data.visit_date,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          notes: data.notes,
          images: data.images,
        }]);

      if (error) throw error;
      
      toast.success(t('record_added'));
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
        <Button>{t('add_dental_record')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add_dental_record')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormItem>
              <FormLabel>{t('photos')}</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <Button type="submit" className="w-full" disabled={uploading}>
              {t('add_record')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};