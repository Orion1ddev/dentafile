import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PatientCard } from "./PatientCard";
import { useNavigate } from "react-router-dom";

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const { data: appointments } = useQuery({
    queryKey: ['appointments', selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      
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

  return (
    <div className="space-y-6">
      <div className="flex justify-center p-4 bg-card rounded-lg shadow">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>

      {selectedDate && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Appointments for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
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
                No appointments scheduled for this date
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};