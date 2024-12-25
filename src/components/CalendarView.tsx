import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentsList } from "./appointments/AppointmentsList";

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { appointments, monthlyAppointments } = useAppointments(selectedDate);

  const handleDateSelect = (arg: any) => {
    setSelectedDate(new Date(arg.event.start));
  };

  // Transform appointments for calendar
  const calendarEvents = monthlyAppointments?.map(appointment => ({
    id: appointment.id,
    title: `${appointment.patient.first_name} ${appointment.patient.last_name} - ${appointment.operation_type || 'Consultation'}`,
    start: new Date(`${appointment.visit_date.split('T')[0]}T${appointment.appointment_time}`).toISOString(),
    end: new Date(`${appointment.visit_date.split('T')[0]}T${appointment.appointment_time}`).toISOString(),
    allDay: false,
    extendedProps: {
      patientId: appointment.patient.id,
      operationType: appointment.operation_type
    }
  })) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-6">
        <Card className="p-4 w-full">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            eventClick={handleDateSelect}
            height="600px"
            slotMinTime="09:00:00"
            slotMaxTime="18:00:00"
            weekends={false}
            allDaySlot={false}
            slotDuration="00:30:00"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: '09:00',
              endTime: '18:00',
            }}
          />
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