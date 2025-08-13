import {format} from 'date-fns';
import {ChevronsUpDown} from 'lucide-react';
import React, {useEffect, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

interface DateToPickerProps {
  className?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabledBefore?: Date;
}

const DateToPicker: React.FC<DateToPickerProps> = ({className, value, onChange, disabledBefore}) => {
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
      <Label htmlFor="dashboard-date-to" className="px-1 sr-only">
        Date to
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="dashboard-date-to" className="h-9 min-w-50 justify-between font-normal">
            {selectedDate ? format(selectedDate, 'PPP') : 'Select date to'}
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
          <Calendar
            mode="single"
            selected={selectedDate}
            disabled={disabledBefore ? {before: disabledBefore} : undefined}
            captionLayout="dropdown"
            onSelect={handleSelectDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateToPicker;
