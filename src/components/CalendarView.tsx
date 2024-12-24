import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentsList } from "./appointments/AppointmentsList";

interface DentalRecord {
  id: string;
  visit_date: string;
  appointment_time: string;
  operation_type: string | null;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    created_at: string;
    date_of_birth: string;
    email: string | null;
    gender: string;
    medical_history: string[] | null;
    phone: string | null;
    pinned: boolean | null;
    updated_at: string;
    user_id: string | null;
  };
}

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Query for appointments on selected date
  const { data: appointments } = useQuery<DentalRecord[]>({
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
          id,
          visit_date,
          appointment_time,
          operation_type,
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

  // Query for monthly appointments
  const { data: monthlyAppointments } = useQuery({
    queryKey: ['monthly-appointments', selectedDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dental_records')
        .select(`
          id,
          visit_date,
          appointment_time,
          operation_type,
          patient:patients(*)
        `)
        .eq('patients.user_id', user.id);

      if (error) throw error;
      
      return data?.map(record => ({
        id: record.id,
        title: `${format(new Date(`2000-01-01T${record.appointment_time}`), 'HH:mm')} - ${record.patient.first_name} ${record.patient.last_name}`,
        start: new Date(`${record.visit_date.split('T')[0]}T${record.appointment_time}`).toISOString(),
        extendedProps: {
          patientId: record.patient.id,
          operationType: record.operation_type
        }
      })) || [];
    }
  });

  const handleDateSelect = (info: any) => {
    const date = new Date(info.date);
    setSelectedDate(date);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-6">
        <Card className="p-4 w-full">
          <div className="w-full">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={monthlyAppointments || []}
              dateClick={handleDateSelect}
              height="auto"
              aspectRatio={2}
              headerToolbar={{
                left: 'title',
                center: '',
                right: 'prev,next'
              }}
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hour12: false
              }}
            />
          </div>
        </Card>

        <Card className="p-4 w-full">
          <AppointmentsList 
            appointments={appointments}
            selectedDate={selectedDate}
          />
        </Card>
      </div>
    </div>
  );
};