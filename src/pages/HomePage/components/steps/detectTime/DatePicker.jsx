import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./dateCalendar.scss";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ date, onDateChange }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-between w-full h-12 px-3 py-2 text-sm cursor-pointer"
        >
          <span>
            {date ? format(new Date(date), "dd/MM/yyyy") : "Choose any date to analyze"}
          </span>
          <CalendarIcon className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-auto bg-card/95 backdrop-blur-md border-border/50" align="center">
        <Calendar
          onChange={(selectedDate) => {
            const formattedDate = format(selectedDate, "yyyy-MM-dd");
            onDateChange(formattedDate);
            setOpen(false);
          }}
          value={date ? new Date(date) : null}
          minDetail="decade"
          maxDetail="month"
          className="rounded-lg border shadow-md p-2 bg-card/95 backdrop-blur-md border-border/50"
          tileClassName={({ date, view }) => {
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
              return "bg-blue-100 text-blue-600 font-semibold rounded-md";
            }
            return "";
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
