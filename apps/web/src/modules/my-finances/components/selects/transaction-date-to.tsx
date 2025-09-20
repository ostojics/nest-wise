import {format} from 'date-fns';
import {ChevronsUpDown} from 'lucide-react';
import {useMemo, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn, getDateDisableReference} from '@/lib/utils';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {formatSelectedDate} from '@/modules/transactions/utils';

interface PrivateTransactionDateToPickerProps {
  className?: string;
}

const PrivateTransactionDateToPicker: React.FC<PrivateTransactionDateToPickerProps> = ({className}) => {
  const [open, setOpen] = useState(false);
  const search = useSearch({from: '/__pathlessLayout/my-finances'});
  const navigate = useNavigate();

  const selectedDate = search.to ? new Date(search.to) : undefined;

  const dateDisableReference = useMemo(() => {
    if (!search.from) return;
    return getDateDisableReference(new Date(search.from), false);
  }, [search.from]);

  const handleSelectDate = (value: Date | undefined) => {
    if (!value) return;
    void navigate({
      search: (prev) => ({...prev, to: formatSelectedDate(value), page: 1}),
      to: '/my-finances',
    });
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor="private-transaction-date-to" className="px-1 sr-only">
        Private transaction date to
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="private-transaction-date-to"
            className="h-9 min-w-50 justify-between font-normal"
          >
            {selectedDate ? format(selectedDate, 'PPP') : 'Select date to'}
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
          <Calendar
            mode="single"
            // @ts-expect-error Unexpected type errors based on the docs
            disabled={{before: dateDisableReference}}
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleSelectDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PrivateTransactionDateToPicker;
