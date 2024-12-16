import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PatientCard } from "./PatientCard";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/stores/useLanguage";

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: appointments } = useQuery({
    queryKey: ['appointments', selectedDate],
    queryFn: async () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          *,
          patient:patients(*)
        `)
        .eq('patients.user_id', user.id)
        .gte('visit_date', startOfDay.toISOString())
        .lte('visit_date', endOfDay.toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!selectedDate
  });

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-xl font-semibold">
          {t('appointments_for')} {format(selectedDate, 'dd MMMM, yyyy')}
        </h2>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextDay}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments?.map((record) => (
          <PatientCard
            key={record.id}
            patient={record.patient}
            onClick={() => navigate(`/patient/${record.patient.id}`)}
          />
        ))}
        {appointments?.length === 0 && (
          <Card className="p-6 col-span-full text-center text-muted-foreground">
            {t('no_appointments')}
          </Card>
        )}
      </div>
    </div>
  );
};