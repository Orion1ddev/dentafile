
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

  // Simplified event handler to handle both click and date change
  const handleDateChange = (arg: any) => {
    const newDate = arg.event?.start || arg.start || arg.view?.currentStart;
    if (newDate) {
      setSelectedDate(new Date(newDate));
    }
  };
  
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
        title: isMobile ? `${appointment.patient.first_name} ${appointment.patient.last_name[0]}.` : `${appointment.patient.first_name} ${appointment.patient.last_name}${appointment.operation_type ? ` - ${appointment.operation_type}` : ''}`,
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
    <div className="w-full h-screen flex flex-col md:flex-row gap-1 p-0">
      {/* Calendar Section - Left Side - Now 2/3 width */}
      <div className="w-full md:w-2/3 h-[600px] md:h-[calc(100vh-1rem)]">
        <Card className="h-full overflow-hidden bg-secondary/50 shadow-md w-full rounded-none md:rounded-lg">
          <div className="h-full" style={{
            '--fc-page-bg-color': 'transparent'
          } as React.CSSProperties}>
            <FullCalendar 
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
              initialView="timeGridDay" 
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: isMobile ? 'timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
              }} 
              events={calendarEvents} 
              eventClick={handleDateChange} 
              datesSet={handleDateChange} 
              select={handleDateChange} 
              height="100%" 
              slotMinTime="08:00:00" 
              slotMaxTime="24:00:00" 
              weekends={true} 
              allDaySlot={false} 
              slotDuration="00:30:00" 
              firstDay={1} 
              locale={language} 
              selectable={true} 
              selectMirror={true} 
              dayMaxEvents={true} 
              nowIndicator={true} 
              buttonText={{
                today: t('calendar_today'),
                month: t('calendar_month'),
                week: t('calendar_week'),
                day: t('calendar_day')
              }} 
              eventDisplay="block" 
              eventContent={arg => (
                <div className="text-xs p-1 overflow-hidden">
                  <div className="font-semibold truncate">{arg.event.title}</div>
                  {!isMobile && arg.event.extendedProps.operationType && (
                    <div className="text-muted-foreground truncate">
                      {arg.event.extendedProps.operationType}
                    </div>
                  )}
                </div>
              )} 
            />
          </div>
        </Card>
      </div>

      {/* Appointments Section - Right Side - Now 1/3 width */}
      <div className="w-full md:w-1/3 h-auto md:h-[calc(100vh-1rem)]">
        <Card className="h-full bg-secondary/50 shadow-md rounded-none md:rounded-lg">
          <div className="p-2 h-full">
            <AppointmentsList appointments={appointments} selectedDate={selectedDate} />
          </div>
        </Card>
      </div>
    </div>
  );
};
