
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ImageUploadField } from "./ImageUploadField";
import { z } from "zod";

export const formSchema = z.object({
  visit_date: z.string().min(1, "Visit date is required"),
  appointment_time: z.string().min(1, "Appointment time is required"),
  operation_type: z.string().min(1, "Operation type is required"),
  notes: z.string().nullable(),
  images: z.array(z.string()).nullable(),
});

export type DentalRecordFormData = z.infer<typeof formSchema>;

interface DentalRecordFormFieldsProps {
  form: UseFormReturn<any>;
}

export const DentalRecordFormFields = ({ form }: DentalRecordFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
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
          name="appointment_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="operation_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Operation Type</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., Cleaning, Filling, etc." required />
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
      <ImageUploadField form={form} />
    </>
  );
};
