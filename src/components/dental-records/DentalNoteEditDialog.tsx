import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";
import { useLanguage } from "@/stores/useLanguage";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  notes: z.string().min(1, "Notes are required"),
  images: z.array(z.string()).nullable(),
});

type DentalNoteFormData = z.infer<typeof formSchema>;

interface DentalNoteEditDialogProps {
  record: {
    id: string;
    notes: string | null;
    images: string[] | null;
  };
  patientId: string;
}

export const DentalNoteEditDialog = ({ record, patientId }: DentalNoteEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const form = useForm<DentalNoteFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: record.notes || '',
      images: record.images || [],
    },
  });

  const onSubmit = async (data: DentalNoteFormData) => {
    try {
      const { error } = await supabase
        .from('dental_records')
        .update({
          notes: data.notes,
          images: data.images,
        })
        .eq('id', record.id);

      if (error) throw error;
      
      toast.success(t("note_updated"));
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
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('edit_note')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {t('update_note')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};