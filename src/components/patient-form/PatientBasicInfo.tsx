import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PatientFormData } from "./types";

interface PatientBasicInfoProps {
  form: UseFormReturn<PatientFormData>;
}

export const PatientBasicInfo = ({ form }: PatientBasicInfoProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="date_of_birth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth (DD.MM.YYYY)</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const formattedDate = date.toISOString().split('T')[0];
                  field.onChange(formattedDate);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};