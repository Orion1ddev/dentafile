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
import { Pencil, Plus, X } from "lucide-react";

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
  const [newImageUrl, setNewImageUrl] = useState("");
  
  const form = useForm<DentalRecordFormData>({
    defaultValues: {
      visit_date: new Date(record.visit_date).toISOString().split('T')[0],
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      notes: record.notes || '',
      images: record.images || [],
    },
  });

  const handleAddImage = () => {
    if (!newImageUrl) {
      toast.error("Please enter an image URL");
      return;
    }

    try {
      new URL(newImageUrl); // Validate URL format
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, newImageUrl]);
      setNewImageUrl(""); // Clear input after adding
      toast.success('Image URL added successfully');
    } catch (error) {
      toast.error('Please enter a valid URL');
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', newImages);
    toast.success('Image removed successfully');
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
              <FormLabel>Add Photo URL</FormLabel>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
                <Button 
                  type="button" 
                  onClick={handleAddImage}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.watch('images')?.map((url, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input value={url} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </FormItem>
            <Button type="submit" className="w-full">
              Update Record
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};