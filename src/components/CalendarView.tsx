import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentsList } from "./appointments/AppointmentsList";
import { addHours, parseISO } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/stores/useLanguage";

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { appointments, monthlyAppointments } = useAppointments(selectedDate);
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();

  const handleDateSelect = (arg: any) => {
    setSelectedDate(new Date(arg.event.start));
  };

  // Transform appointments for calendar
  const calendarEvents = monthlyAppointments?.map(appointment => {
    if (!appointment.appointment_time || !appointment.visit_date) return null;

    try {
      const baseDate = parseISO(appointment.visit_date);
      const [hours, minutes] = appointment.appointment_time.split(':');
      const startDate = new Date(baseDate);
      startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
      const endDate = addHours(startDate, 1);

      return {
        id: appointment.id,
        title: isMobile 
          ? `${appointment.patient.first_name} ${appointment.patient.last_name[0]}.`
          : `${appointment.patient.first_name} ${appointment.patient.last_name} - ${appointment.operation_type || t('consultation')}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: false,
        extendedProps: {
          patientId: appointment.patient.id,
          operationType: appointment.operation_type
        }
      };
    } catch (error) {
      console.error('Error processing appointment:', error);
      return null;
    }
  }).filter(Boolean) || [];

  return (
    <div className="w-full max-w-[1800px] mx-auto px-1">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        <Card className="p-2 lg:col-span-3 overflow-hidden bg-secondary">
          <div style={{ '--fc-timegrid-slot-height': isMobile ? '40px' : '80px' } as React.CSSProperties}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: isMobile ? 'timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              eventClick={handleDateSelect}
              height={isMobile ? "500px" : "800px"}
              slotMinTime="08:00:00"
              slotMaxTime="24:00:00"
              weekends={true}
              allDaySlot={false}
              slotDuration="00:30:00"
              firstDay={1}
              locale={language}
              buttonText={{
                today: t('calendar_today'),
                month: t('calendar_month'),
                week: t('calendar_week'),
                day: t('calendar_day'),
              }}
              businessHours={{
                daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                startTime: '08:00',
                endTime: '24:00',
              }}
              eventDisplay="block"
              dayMaxEvents={3}
              views={{
                timeGridDay: {
                  titleFormat: { month: 'long', day: 'numeric' }
                }
              }}
              eventContent={arg => (
                <div className="text-xs p-1 overflow-hidden">
                  <div className="font-semibold truncate">{arg.event.title}</div>
                  {!isMobile && arg.event.extendedProps.operationType && (
                    <div className="text-muted-foreground truncate">
                      {arg.event.extendedProps.operationType || t('consultation')}
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </Card>

        <Card className="p-2 lg:static fixed bottom-0 left-0 right-0 lg:relative bg-secondary backdrop-blur-sm lg:backdrop-blur-none lg:bg-secondary z-10 max-h-[250px] lg:max-h-none overflow-y-auto">
          <AppointmentsList 
            appointments={appointments}
            selectedDate={selectedDate}
          />
        </Card>
      </div>
    </div>
  );
};
