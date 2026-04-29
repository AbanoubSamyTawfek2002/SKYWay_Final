import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  minDate?: Date
  placeholder?: string
  className?: string
  inputClassName?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  setDate,
  minDate,
  placeholder = "Pick a date",
  className,
  inputClassName,
  disabled,
  hideIcon = false
}: DatePickerProps & { hideIcon?: boolean }) {
  // We need to parse minDate if it's passed so disabled prop works correctly.
  const disabledFn = minDate ? (d: Date) => {
    const minD = new Date(minDate);
    minD.setHours(0, 0, 0, 0);
    return d < minD;
  } : undefined;

  return (
    <div className={`relative w-full group ${className || ''}`}>
      {!hideIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none z-10">
          <CalendarIcon size={16} />
        </div>
      )}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              disabled={disabled}
              variant={"outline"}
              className={inputClassName || cn(
                "w-full h-16 bg-muted/30 border-none rounded-2xl justify-start text-left font-bold text-sm md:text-base pl-10 pr-4 transition-colors focus:ring-2 focus:ring-primary/20 hover:bg-muted/40",
                !date && "text-muted-foreground font-normal",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            />
          }
        >
          {date ? format(date, "MMM d, yyyy") : <span>{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 z-[100] bg-popover dark:bg-[#1E1E1E] text-popover-foreground dark:text-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-border dark:border-white/10" 
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disabledFn}
            initialFocus
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
