import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from "date-fns";
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
    title: appointment.title,
    start: appointment.start,
    allDay: false
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
            height="500px"
            slotMinTime="09:00:00"
            slotMaxTime="24:00:00"
            weekends={false}
            allDaySlot={false}
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