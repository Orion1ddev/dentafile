import { useEffect, useRef, useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PatientCard } from "./PatientCard";
import { useNavigate } from "react-router-dom";
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { useLanguage } from "@/stores/useLanguage";

interface DentalRecord {
  id: string;
  visit_date: string;
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
  const calendarRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
          id,
          visit_date,
          patient:patients(*)
        `)
        .eq('patients.user_id', user.id)
        .gte('visit_date', start.toISOString())
        .lte('visit_date', end.toISOString());

      if (error) throw error;
      
      // Transform appointments into Toast UI Calendar format
      return data?.map(record => ({
        id: record.id,
        calendarId: '1',
        title: `${record.patient.first_name} ${record.patient.last_name}`,
        category: 'time',
        start: new Date(record.visit_date),
        end: new Date(new Date(record.visit_date).getTime() + 60 * 60 * 1000), // 1 hour duration
      })) || [];
    },
    enabled: !!selectedDate
  });

  const handleDateSelect = (e: any) => {
    const date = new Date(e.start);
    setSelectedDate(date);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-12rem)]">
        <Card className="p-4 lg:w-2/3">
          <div className="aspect-square w-full">
            <Calendar
              ref={calendarRef}
              height="100%"
              view="month"
              month={{
                dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                isAlways6Weeks: true,
              }}
              calendars={[
                {
                  id: '1',
                  name: 'Appointments',
                  backgroundColor: '#e2e8f0',
                  borderColor: '#94a3b8'
                }
              ]}
              events={monthlyAppointments || []}
              onSelectDateTime={handleDateSelect}
              isReadOnly={false}
              useDetailPopup={true}
              useCreationPopup={false}
              disableDblClick={true}
              selectable="day"
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