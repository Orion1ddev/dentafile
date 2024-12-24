import { useState } from "react";
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PatientCard } from "./PatientCard";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Pin } from "lucide-react";
import { useLanguage } from "@/stores/useLanguage";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Query for appointments on selected date
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

  // Query for monthly appointment counts
  const { data: monthlyAppointments } = useQuery({
    queryKey: ['monthly-appointments', selectedDate],
    queryFn: async () => {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          visit_date,
          patient:patients(pinned)
        `)
        .eq('patients.user_id', user.id)
        .gte('visit_date', start.toISOString())
        .lte('visit_date', end.toISOString());

      if (error) throw error;

      // Create a map of dates to appointment counts and pinned status
      const appointmentMap = new Map();
      
      data?.forEach(record => {
        const date = format(new Date(record.visit_date), 'yyyy-MM-dd');
        const current = appointmentMap.get(date) || { total: 0, pinned: 0 };
        current.total += 1;
        if (record.patient.pinned) {
          current.pinned += 1;
        }
        appointmentMap.set(date, current);
      });

      return appointmentMap;
    },
    enabled: !!selectedDate
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-12rem)]">
        <Card className="p-4 lg:w-2/3">
          <div className="aspect-square w-full flex items-center justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="w-full h-full"
              modifiers={{
                hasAppointments: (date) => {
                  const key = format(date, 'yyyy-MM-dd');
                  return monthlyAppointments?.has(key) || false;
                }
              }}
              modifiersStyles={{
                hasAppointments: {
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }
              }}
              components={{
                DayContent: ({ date }) => {
                  const key = format(date, 'yyyy-MM-dd');
                  const appointments = monthlyAppointments?.get(key);
                  
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{date.getDate()}</span>
                      {appointments && (
                        <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-1">
                          <Badge variant="secondary" className="h-2 w-2 p-0">
                            {appointments.total}
                          </Badge>
                          {appointments.pinned > 0 && (
                            <Pin className="h-2 w-2 text-primary" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </div>
        </Card>

        <Card className="p-4 lg:w-1/3 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">
            {format(selectedDate, 'MMMM d, yyyy')} - {appointments?.length || 0} {t('appointments')}
          </h3>
          
          <div className="space-y-4 flex-grow overflow-y-auto">
            {appointments?.map((record) => (
              <PatientCard
                key={record.id}
                patient={record.patient}
                onClick={() => navigate(`/patient/${record.patient.id}`)}
              />
            ))}
            {appointments?.length === 0 && (
              <div className="text-center text-muted-foreground">
                {t('no_appointments')}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};