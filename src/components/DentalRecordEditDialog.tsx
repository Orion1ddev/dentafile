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
import { Pencil } from "lucide-react";

interface DentalRecordFormData {
  visit_date: string;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  images: string[] | null;
}

interface DentalRecordEditDialogProps {
  record: {
    id: string;
    visit_date: string;
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
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<DentalRecordFormData>({
    defaultValues: {
      visit_date: new Date(record.visit_date).toISOString().split('T')[0],
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      notes: record.notes || '',
      images: record.images || [],
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${patientId}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('dental_photos')
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Error uploading ${file.name}`);
          console.error(uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('dental_photos')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...uploadedUrls]);
      toast.success('Files uploaded successfully');
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
        .update({ 
          visit_date: data.visit_date,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          notes: data.notes,
          images: data.images,
        })
        .eq('id', record.id);

      if (error) throw error;
      
      toast.success("Record updated successfully");
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
          Edit Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Dental Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormItem>
              <FormLabel>Add More Photos</FormLabel>
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
              Update Record
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};