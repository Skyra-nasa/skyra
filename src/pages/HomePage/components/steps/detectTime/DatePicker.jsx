import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./dateCalendar.scss";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ date, onDateChange, placeholder = "Choose any date to analyze" }) {
  const [open, setOpen] = React.useState(false);

  const formatDisplayDate = (date) => {
    if (!date) return null;
    const selectedDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (selectedDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return format(selectedDate, "MMM dd, yyyy");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`
            group relative w-full h-16 px-5 py-4 text-left overflow-hidden
            border-2 border-border/40 hover:border-primary/50
            bg-gradient-to-br from-card/60 to-card/40
            backdrop-blur-md
            hover:shadow-xl hover:shadow-primary/10
            transition-all duration-300 ease-out
            focus:border-primary focus:ring-4 focus:ring-primary/20
            rounded-xl
            ${date ? 'border-primary/60 bg-gradient-to-br from-primary/8 to-accent/8 shadow-lg shadow-primary/5' : ''}
          `}
        >
          {/* Animated gradient background */}
          <div className={`
            absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500
          `} />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`
                p-2.5 rounded-xl transition-all duration-300 border-2
                ${date 
                  ? 'bg-primary/20 text-primary border-primary/30 shadow-lg shadow-primary/20' 
                  : 'bg-muted/40 text-muted-foreground border-border/30 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30'
                }
              `}>
                {date ? (
                  <CheckCircle className="h-5 w-5 animate-in zoom-in duration-300" />
                ) : (
                  <CalendarIcon className="h-5 w-5" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className={`
                  font-semibold text-base transition-colors duration-200
                  ${date ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {date ? formatDisplayDate(date) : placeholder}
                </span>
                {date && (
                  <span className="text-xs text-primary font-bold uppercase tracking-wider animate-in slide-in-from-left duration-300">
                    {format(new Date(date), "EEEE")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {date && (
                <div className="px-2 py-1 rounded-full bg-primary/20 border border-primary/30">
                  <span className="text-xs font-bold text-primary">Selected</span>
                </div>
              )}
              <CalendarIcon className={`
                h-5 w-5 transition-all duration-300
                ${open ? 'rotate-180 text-primary scale-110' : 'text-muted-foreground'}
                group-hover:text-primary group-hover:scale-110
              `} />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-auto bg-card/95 backdrop-blur-2xl border-2 border-border/40 shadow-2xl shadow-primary/20 rounded-2xl overflow-hidden" 
        align="center"
        sideOffset={12}
      >
        <div className="relative p-5 border-b-2 border-border/30 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
          {/* Decorative gradient blob */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/30">
                <CalendarIcon className="w-3.5 h-3.5 text-primary" />
              </div>
              <h4 className="font-bold text-base text-foreground">Select Date</h4>
            </div>
            <p className="text-xs text-muted-foreground">Choose any date for weather analysis</p>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-b from-transparent to-card/50">
          <Calendar
            onChange={(selectedDate) => {
              const formattedDate = format(selectedDate, "yyyy-MM-dd");
              onDateChange(formattedDate);
              setOpen(false);
            }}
            value={date ? new Date(date) : null}
            minDetail="decade"
            maxDetail="month"
            showNeighboringMonth={false}
            className="enhanced-calendar"
            tileClassName={({ date: calendarDate }) => {
              const today = new Date();
              const selected = date ? new Date(date) : null;
              
              let classes = "calendar-tile";
              
              if (calendarDate.toDateString() === today.toDateString()) {
                classes += " today-tile";
              }
              
              if (selected && calendarDate.toDateString() === selected.toDateString()) {
                classes += " selected-tile";
              }
              
              return classes;
            }}
            formatShortWeekday={(locale, date) => {
              const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
              return weekdays[date.getDay()];
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
