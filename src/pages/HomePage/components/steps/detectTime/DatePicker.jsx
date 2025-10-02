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
            group relative w-full h-14 px-4 py-3 text-left
            border-2 border-border/40 hover:border-primary/40
            bg-gradient-to-r from-background/80 to-background/60
            backdrop-blur-sm
            hover:shadow-lg hover:shadow-primary/5
            transition-all duration-300 ease-out
            focus:border-primary focus:ring-4 focus:ring-primary/20
            ${date ? 'border-primary/60 bg-gradient-to-r from-primary/5 to-accent/5' : ''}
          `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-lg transition-all duration-300
                ${date 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }
              `}>
                {date ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <CalendarIcon className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className={`
                  font-medium transition-colors duration-200
                  ${date ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {date ? formatDisplayDate(date) : placeholder}
                </span>
                {date && (
                  <span className="text-xs text-primary font-medium">
                    {format(new Date(date), "EEEE")}
                  </span>
                )}
              </div>
            </div>
            <CalendarIcon className={`
              h-4 w-4 transition-all duration-300
              ${open ? 'rotate-180 text-primary' : 'text-muted-foreground'}
              group-hover:text-primary
            `} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-auto bg-card/98 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/10" 
        align="center"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <h4 className="font-semibold text-sm text-foreground">Select Date</h4>
          <p className="text-xs text-muted-foreground mt-1">Choose any date for weather analysis</p>
        </div>
        <div className="p-3">
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
