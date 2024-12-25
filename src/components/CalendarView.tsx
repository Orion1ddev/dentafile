import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { format } from "date-fns";
import { AppointmentsList } from "./appointments/AppointmentsList";
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { appointments, monthlyAppointments } = useAppointments(selectedDate);

  const handleDateSelect = (args: any) => {
    if (args.data) {
      setSelectedDate(new Date(args.data.StartTime));
    }
  };

  // Transform appointments for Syncfusion Scheduler
  const schedulerData = monthlyAppointments?.map(appointment => ({
    Id: appointment.id,
    Subject: appointment.title,
    StartTime: new Date(appointment.start),
    EndTime: new Date(new Date(appointment.start).setHours(new Date(appointment.start).getHours() + 1)),
    Description: appointment.extendedProps?.operationType || '',
    PatientId: appointment.extendedProps?.patientId,
    IsReadonly: true
  })) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-6">
        <Card className="p-4 w-full">
          <div className="w-full">
            <ScheduleComponent 
              height='550px'
              selectedDate={selectedDate}
              eventSettings={{ dataSource: schedulerData }}
              eventClick={handleDateSelect}
              readonly={true}
              firstDayOfWeek={1}
              workDays={[1, 2, 3, 4, 5, 6]}
              startHour='09:00'
              endHour='18:00'
              currentView='Week'
            >
              <ViewsDirective>
                <ViewDirective option='Day' />
                <ViewDirective option='Week' />
                <ViewDirective option='Month' />
              </ViewsDirective>
              <Inject services={[Day, Week, Month]} />
            </ScheduleComponent>
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