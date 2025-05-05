
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentsList, Appointment } from "./appointments/AppointmentsList";
import { addHours, parseISO } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/stores/useLanguage";
import { Loading } from "@/components/ui/loading";
import { Button } from "./ui/button";
import { CalendarPlus } from "lucide-react";
import { DentalRecordFormDialog } from "./DentalRecordFormDialog";

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDataReady, setIsDataReady] = useState(false);
  const {
    appointments: rawAppointments,
    monthlyAppointments,
    isLoading
  } = useAppointments(selectedDate);
  const isMobile = useIsMobile();
  const {
    t,
    language
  } = useLanguage();

  // Map raw appointments to the Appointment type expected by AppointmentsList
  const appointments: Appointment[] = (rawAppointments || []).map(appointment => ({
    id: appointment.id,
    patient: appointment.patient,
    visit_date: appointment.visit_date,
    appointment_time: appointment.appointment_time,
    operation_type: appointment.operation_type,
    // Add the missing properties with null values
    diagnosis: appointment.diagnosis || null,
    treatment: appointment.treatment || null,
    notes: appointment.notes || null,
    images: appointment.images || null
  }));

  // Set data ready status after initial loading
  useEffect(() => {
    if (!isLoading && (appointments || monthlyAppointments)) {
      setIsDataReady(true);
    }
  }, [isLoading, appointments, monthlyAppointments]);

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
          operationType: appointment.operation_type,
          appointmentId: appointment.id
        }
      };
    } catch (error) {
      console.error('Error processing appointment:', error);
      return null;
    }
  }).filter(Boolean) || [];

  // Show loading indicator if data isn't ready yet
  if (!isDataReady && isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">
        <Loading text={t('loading_calendar')} size="large" />
      </div>;
  }
  
  return (
    <div className="w-full h-screen flex flex-col md:flex-row gap-6 p-4 max-w-[1800px] mx-auto">
      {/* Calendar Section - Left Side - Now 2/3 width on larger screens */}
      <div className="w-full md:w-2/3 h-[600px] md:h-[calc(100vh-2rem)]">
        <Card className="h-full overflow-hidden bg-secondary/50 shadow-md w-full rounded-lg">
          <div className="h-full" style={{
          '--fc-page-bg-color': 'transparent'
        } as React.CSSProperties}>
            {isLoading && !isDataReady ? <div className="h-full flex items-center justify-center">
                <Loading text={t('loading_calendar')} size="medium" />
              </div> : <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="timeGridDay" headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: isMobile ? 'timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
          }} events={calendarEvents} eventClick={handleDateChange} datesSet={handleDateChange} select={handleDateChange} height="100%" slotMinTime="08:00:00" slotMaxTime="24:00:00" weekends={true} allDaySlot={false} slotDuration="00:30:00" firstDay={1} locale={language} selectable={true} selectMirror={true} dayMaxEvents={true} nowIndicator={true} buttonText={{
            today: t('calendar_today'),
            month: t('calendar_month'),
            week: t('calendar_week'),
            day: t('calendar_day')
          }} eventDisplay="block" eventContent={arg => <div className="text-xs p-1 overflow-hidden">
                    <div className="font-semibold truncate">{arg.event.title}</div>
                    {!isMobile && arg.event.extendedProps.operationType && <div className="text-muted-foreground truncate">
                        {arg.event.extendedProps.operationType}
                      </div>}
                  </div>} />}
          </div>
        </Card>
      </div>

      {/* Appointments Section - Right Side - Now 1/3 width on larger screens */}
      <div className="w-full md:w-1/3 h-auto md:h-[calc(100vh-2rem)]">
        <Card className="h-full bg-secondary/50 shadow-md rounded-lg">
          <div className="p-4 h-full">
            {isLoading && !isDataReady ? <div className="h-full flex items-center justify-center">
                <Loading text={t('loading_appointments')} size="medium" />
              </div> : <AppointmentsList appointments={appointments} selectedDate={selectedDate} />}
          </div>
        </Card>
      </div>
    </div>
  );
};
