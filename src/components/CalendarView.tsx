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
  const {
    appointments,
    monthlyAppointments
  } = useAppointments(selectedDate);
  const isMobile = useIsMobile();
  const {
    t,
    language
  } = useLanguage();
  const handleDateSelect = (arg: any) => {
    setSelectedDate(new Date(arg.event.start));
  };

  // Add new handler for date changes
  const handleDatesSet = (arg: any) => {
    setSelectedDate(arg.view.currentStart);
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
        title: isMobile ? `${appointment.patient.first_name} ${appointment.patient.last_name[0]}.` : `${appointment.patient.first_name} ${appointment.patient.last_name} - ${appointment.operation_type || t('consultation')}`,
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
  return <div className="w-full max-w-[2800px] pt-4 py-0 px-0 my-0 mx-0">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-4 lg:col-span-4 overflow-hidden bg-secondary py-[12px] px-[10px] mx-[5px]">
          <div style={{
          '--fc-timegrid-slot-height': isMobile ? '40px' : '80px'
        } as React.CSSProperties}>
            <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="timeGridDay" headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: isMobile ? 'timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
          }} events={calendarEvents} eventClick={handleDateSelect} datesSet={handleDatesSet} height={isMobile ? "500px" : "800px"} slotMinTime="08:00:00" slotMaxTime="24:00:00" weekends={true} allDaySlot={false} slotDuration="00:30:00" firstDay={1} locale={language} buttonText={{
            today: t('calendar_today'),
            month: t('calendar_month'),
            week: t('calendar_week'),
            day: t('calendar_day')
          }} businessHours={{
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
            startTime: '08:00',
            endTime: '24:00'
          }} eventDisplay="block" dayMaxEvents={3} views={{
            timeGridDay: {
              titleFormat: {
                month: 'long',
                day: 'numeric'
              }
            }
          }} eventContent={arg => <div className="text-xs p-1 overflow-hidden">
                  <div className="font-semibold truncate">{arg.event.title}</div>
                  {!isMobile && arg.event.extendedProps.operationType && <div className="text-muted-foreground truncate">
                      {arg.event.extendedProps.operationType || t('consultation')}
                    </div>}
                </div>} />
          </div>
        </Card>

        <Card className="p-4 lg:static bg-secondary lg:h-[800px] overflow-y-auto py-[7px] mx-px px-[8px] my-0">
          <AppointmentsList appointments={appointments} selectedDate={selectedDate} />
        </Card>
      </div>
    </div>;
};