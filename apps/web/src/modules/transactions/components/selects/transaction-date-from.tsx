import {format, sub} from 'date-fns';
import {ChevronsUpDown} from 'lucide-react';
import {useMemo, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {formatSelectedDate} from '../../utils';

interface TransactionDateFromPickerProps {
  className?: string;
}

const TransactionDateFromPicker: React.FC<TransactionDateFromPickerProps> = ({className}) => {
  const [open, setOpen] = useState(false);
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const navigate = useNavigate();

  const selectedDate = search.transactionDate_from ? new Date(search.transactionDate_from) : undefined;

  const dateDisableReference = useMemo(() => {
    if (!search.transactionDate_to) return;

    return sub(new Date(search.transactionDate_to), {days: 1});
  }, [search.transactionDate_to]);

  const handleSelectDate = (value: Date | undefined) => {
    if (!value) return;

    void navigate({
      search: (prev) => ({...prev, transactionDate_from: formatSelectedDate(value)}),
      to: '/transactions',
    });
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor="transaction-date-from" className="px-1 sr-only">
        Transaction date from
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="transaction-date-from" className="h-9 min-w-50 justify-between font-normal">
            {selectedDate ? format(selectedDate, 'PPP') : 'Select date from'}
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
