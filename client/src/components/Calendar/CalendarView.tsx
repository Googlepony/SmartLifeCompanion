import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import GlassContainer from "../GlassContainer";
import DayDetail from "./DayDetail";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";

// Type for events that need to be displayed as indicators
interface EventIndicator {
  color: string;
}

// Day information including date and indicators
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EventIndicator[];
}

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useUser();
  
  // Fetch events for the current month
  const { data: events } = useQuery<Record<string, any[]>>({
    queryKey: ['/api/calendar', user?.uid, format(currentMonth, 'yyyy-MM')],
    enabled: !!user?.uid,
  });

  // Navigate to the previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to the next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Go to today
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Generate calendar days for the current month view
  const generateCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const today = new Date();
    
    // Get all days in the current calendar view
    const days = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
      // Get events for this date if available
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayEvents = (events && events[dateStr]) || [];
      
      // Convert events to indicators with colors
      const indicators: EventIndicator[] = dayEvents.map((event: any) => ({
        color: event.category === 'work' ? 'blue' : 
               event.category === 'personal' ? 'green' : 
               event.category === 'health' ? 'red' : 
               event.category === 'education' ? 'purple' : 'yellow'
      })).slice(0, 3); // Show max 3 indicators
      
      return {
        date,
        isCurrentMonth: isSameMonth(date, currentMonth),
        isToday: isSameDay(date, today),
        events: indicators
      };
    });
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <section className="mb-8 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <span className="font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={nextMonth}
          >
            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={goToToday}
          >
            <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <GlassContainer className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>{day}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div 
              key={index}
              className={`calendar-date aspect-square rounded-lg flex flex-col items-center justify-center p-1 cursor-pointer 
                ${day.isCurrentMonth ? "hover:bg-gray-100 dark:hover:bg-gray-800" : "text-gray-400"} 
                ${isSameDay(day.date, selectedDate) ? "active-date bg-gray-100 dark:bg-gray-800" : ""} 
                transition-all`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span>{format(day.date, 'd')}</span>
              {day.events.length > 0 && (
                <div className="flex space-x-0.5 mt-1">
                  {day.events.map((event, i) => (
                    <div 
                      key={i}
                      className={`h-1 w-1 rounded-full bg-${event.color}-500`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassContainer>
      
      {/* Day detail view */}
      <DayDetail date={selectedDate} />
    </section>
  );
};

export default CalendarView;
