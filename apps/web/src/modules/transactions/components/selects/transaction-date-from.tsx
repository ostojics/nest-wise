import {format} from 'date-fns';
import {ChevronsUpDown} from 'lucide-react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

interface TransactionDateFromPickerProps {
  className?: string;
}

const TransactionDateFromPicker: React.FC<TransactionDateFromPickerProps> = ({className}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor="transaction-date-from" className="px-1 sr-only">
        Transaction date from
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="transaction-date-from" className="h-9 min-w-50 justify-between font-normal">
            {date ? format(date, 'PPP') : 'Select date from'}
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TransactionDateFromPicker;
