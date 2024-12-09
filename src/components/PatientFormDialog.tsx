import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  medical_history: string[];
  avatar_url?: string;
}

interface PatientFormDialogProps {
  patient?: any;
  mode: 'create' | 'edit';
}

export const PatientFormDialog = ({ patient, mode }: PatientFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const form = useForm<PatientFormData>({
    defaultValues: mode === 'edit' && patient ? {
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      medical_history: patient.medical_history || [],
      avatar_url: patient.avatar_url,
    } : {
      medical_history: [],
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      // Get current user and check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to perform this action");
        navigate('/auth');
        return;
      }

      // Check if profile exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast.error("Error checking user profile");
        return;
      }

      // If no profile exists, create one
      if (!profiles || profiles.length === 0) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id }]);

        if (createProfileError) {
          console.error('Profile creation error:', createProfileError);
          toast.error("Error creating user profile");
          return;
        }
      }

      if (mode === 'create') {
        const { error } = await supabase
          .from('patients')
          .insert([{ ...data, user_id: user.id }]);

        if (error) throw error;
        toast.success("Patient created successfully");
      } else {
        const { error } = await supabase
          .from('patients')
          .update(data)
          .eq('id', patient.id);

        if (error) throw error;
        toast.success("Patient updated successfully");
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
        <Button variant={mode === 'create' ? 'default' : 'outline'}>
          {mode === 'create' ? 'Add New Patient' : 'Edit Patient'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Patient' : 'Edit Patient'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {mode === 'create' ? 'Create Patient' : 'Update Patient'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};