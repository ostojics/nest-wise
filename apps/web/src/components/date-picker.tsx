import * as React from 'react';
import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({value, onChange, placeholder = 'Pick a date', className}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={`data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal ${className ?? ''}`}
        >
          <CalendarIcon />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar timeZone="UTC" mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
