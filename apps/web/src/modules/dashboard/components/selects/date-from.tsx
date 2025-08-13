import {format} from 'date-fns';
import {ChevronsUpDown} from 'lucide-react';
import React, {useEffect, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

interface DateFromPickerProps {
  className?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabledAfter?: Date;
}

const DateFromPicker: React.FC<DateFromPickerProps> = ({className, value, onChange, disabledAfter}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | undefined>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const selectedDate = value ?? internalValue;

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;

    onChange?.(date);
    if (value === undefined) setInternalValue(date);
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor="dashboard-date-from" className="px-1 sr-only">
        Date from
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="dashboard-date-from" className="h-9 min-w-50 justify-between font-normal">
            {selectedDate ? format(selectedDate, 'PPP') : 'Select date from'}
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
          <Calendar
            mode="single"
            selected={selectedDate}
            disabled={disabledAfter ? {after: disabledAfter} : undefined}
            captionLayout="dropdown"
            onSelect={handleSelectDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFromPicker;
