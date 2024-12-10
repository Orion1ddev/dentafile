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
import { format, parse } from "date-fns";
import { useLanguage } from "@/stores/useLanguage";

interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  medical_history: string[];
  email?: string;
  phone?: string;
}

interface PatientFormDialogProps {
  patient?: any;
  mode: 'create' | 'edit';
  trigger?: React.ReactNode;
}

export const PatientFormDialog = ({ patient, mode, trigger }: PatientFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const formatDateForForm = (dateString: string) => {
    try {
      if (dateString.includes('.')) {
        const parsedDate = parse(dateString, 'dd.MM.yyyy', new Date());
        return format(parsedDate, 'yyyy-MM-dd');
      }
      return dateString.split('T')[0];
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const form = useForm<PatientFormData>({
    defaultValues: mode === 'edit' && patient ? {
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: formatDateForForm(patient.date_of_birth),
      gender: patient.gender,
      medical_history: patient.medical_history || [],
      email: patient.email,
      phone: patient.phone,
    } : {
      medical_history: [],
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast.error("Error checking user profile");
        return;
      }

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

      const formDate = parse(data.date_of_birth, 'yyyy-MM-dd', new Date());
      const isoDate = format(formDate, 'yyyy-MM-dd');

      if (mode === 'create') {
        const { error } = await supabase
          .from('patients')
          .insert([{ 
            ...data, 
            date_of_birth: isoDate,
            user_id: user.id 
          }]);

        if (error) throw error;
        toast.success("Patient created successfully");
      } else {
        const { error } = await supabase
          .from('patients')
          .update({ 
            ...data,
            date_of_birth: isoDate
          })
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
        {trigger || (
          <Button variant={mode === 'create' ? 'default' : 'outline'}>
            {mode === 'create' ? t('add_new_patient') : t('edit_patient')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? t('add_new_patient') : t('edit_patient')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('first_name')}</FormLabel>
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
                  <FormLabel>{t('last_name')}</FormLabel>
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
                  <FormLabel>{t('date_of_birth')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                    />
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
                  <FormLabel>{t('gender')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_gender')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">{t('male')}</SelectItem>
                      <SelectItem value="female">{t('female')}</SelectItem>
                      <SelectItem value="other">{t('other')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {mode === 'create' ? t('create_patient') : t('update_patient')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};