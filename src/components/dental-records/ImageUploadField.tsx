import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { uploadImageToImgBB } from "@/utils/imageUpload";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  form: UseFormReturn<any>;
}

export const ImageUploadField = ({ form }: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImageToImgBB(file);
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, imageUrl]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', newImages);
    toast.success('Image removed successfully');
  };

  return (
    <FormItem>
      <FormLabel>Photos</FormLabel>
      <div className="space-y-4">
        <FormControl>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
        </FormControl>
        {form.watch('images')?.map((url: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <img 
              src={url} 
              alt={`Uploaded ${index + 1}`} 
              className="w-20 h-20 object-cover rounded"
            />
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
      </div>
      <FormMessage />
    </FormItem>
  );
};