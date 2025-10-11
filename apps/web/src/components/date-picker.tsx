import * as React from 'react';
import {Calendar as CalendarIcon} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {formatDateOnly, formatUtcDateForDisplay, parseUtcDateOnly} from '@/lib/date-utils';

interface DatePickerProps {
  value?: string; // Date-only string (YYYY-MM-DD)
  onChange?: (date: string | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({value, onChange, placeholder = 'Pick a date', className}: DatePickerProps) {
  const selectedDate = value ? parseUtcDateOnly(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(formatDateOnly(date));
    } else {
      onChange?.(undefined);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={`data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal ${className ?? ''}`}
        >
          <CalendarIcon />
          {value ? formatUtcDateForDisplay(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar timeZone="UTC" mode="single" selected={selectedDate} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
