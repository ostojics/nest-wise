import {format} from 'date-fns';
import {ChevronsUpDown} from 'lucide-react';
import {useMemo, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn, getDateDisableReference} from '@/lib/utils';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {formatSelectedDate} from '../../utils';

interface TransactionDateFromPickerProps {
  className?: string;
}

const TransactionDateFromPicker: React.FC<TransactionDateFromPickerProps> = ({className}) => {
  const [open, setOpen] = useState(false);
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const navigate = useNavigate();

  const selectedDate = search.from ? new Date(search.from) : undefined;

  const dateDisableReference = useMemo(() => {
    if (!search.to) return;

    return getDateDisableReference(new Date(search.to), true);
  }, [search.to]);

  const handleSelectDate = (value: Date | undefined) => {
    if (!value) return;

    void navigate({
      search: (prev) => ({...prev, from: formatSelectedDate(value)}),
      to: '/transactions',
    });
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor="transaction-date-from" className="px-1 sr-only">
        Datum transakcije od
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="transaction-date-from" className="h-9 min-w-50 justify-between font-normal">
            {selectedDate ? format(selectedDate, 'PPP') : 'Izaberi datum od'}
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
          <Calendar
            mode="single"
            // @ts-expect-error Unexpected type errors based on the docs
            disabled={{after: dateDisableReference}}
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleSelectDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TransactionDateFromPicker;
