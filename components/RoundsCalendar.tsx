"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface IEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data.map((e: any) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        );
      })
      .catch(console.error);
  }, []);

  return (
    <section className="p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
      <div className="md:h-[70vh] rounded-lg border border-gray-200 dark:border-gray-100 overflow-hidden dark:text-gray-200 h-[50vh]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{ height: "100%", backgroundColor: "transparent"}}
          views={["month"]}
          popup
        />
      </div>
    </section>
  );
}
