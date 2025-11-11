import {format, parse} from 'date-fns';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useMemo, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {cn} from '@/lib/utils';

interface MonthSwitcherProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  className?: string;
}

export const MonthSwitcher: React.FC<MonthSwitcherProps> = ({selectedMonth, onMonthChange, className}) => {
  const [open, setOpen] = useState(false);

  const current = useMemo(() => parse(selectedMonth, 'yyyy-MM', new Date()), [selectedMonth]);

  const years = useMemo(() => {
    const currentYear = current.getFullYear();
    return Array.from({length: 5}, (_, i) => String(currentYear - 2 + i));
  }, [current]);

  const months = [
    {value: '01', label: 'januar'},
    {value: '02', label: 'februar'},
    {value: '03', label: 'mart'},
    {value: '04', label: 'april'},
    {value: '05', label: 'maj'},
    {value: '06', label: 'jun'},
    {value: '07', label: 'jul'},
    {value: '08', label: 'avgust'},
    {value: '09', label: 'septembar'},
    {value: '10', label: 'oktobar'},
    {value: '11', label: 'novembar'},
    {value: '12', label: 'decembar'},
  ];

  const formatDate = (date: Date) => format(date, 'yyyy-MM');

  const handlePrev = () => {
    const date = new Date(current);
    date.setMonth(date.getMonth() - 1);
    onMonthChange(formatDate(date));
    setOpen(false);
  };

  const handleNext = () => {
    const date = new Date(current);
    date.setMonth(date.getMonth() + 1);
    onMonthChange(formatDate(date));
    setOpen(false);
  };

  const handleMonthChange = (value: string) => {
    const date = new Date(current);
    date.setMonth(parseInt(value, 10) - 1);
    onMonthChange(formatDate(date));
    setOpen(false);
  };

  const handleYearChange = (value: string) => {
    const date = new Date(current);
    date.setFullYear(parseInt(value, 10));
    onMonthChange(formatDate(date));
    setOpen(false);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button variant="outline" size="icon" className="h-9 w-9" onClick={handlePrev} aria-label="Prethodni mesec">
        <ChevronLeft className="size-4" />
        <span className="sr-only">Prethodni mesec</span>
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" title="Izaberite mesec" className="h-9 min-w-50 justify-between font-normal">
            {format(current, 'LLLL yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start" sideOffset={10}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="month-select" className="px-1 sr-only">
                Mesec
              </Label>
              <Select value={format(current, 'MM')} onValueChange={handleMonthChange}>
                <SelectTrigger id="month-select" className="h-9 min-w-40">
                  <SelectValue placeholder="Mesec" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="year-select" className="px-1 sr-only">
                Godina
              </Label>
              <Select value={String(current.getFullYear())} onValueChange={handleYearChange}>
                <SelectTrigger id="year-select" className="h-9 min-w-28">
                  <SelectValue placeholder="Godina" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleNext} aria-label="Sledeći mesec">
        <ChevronRight className="size-4" />
        <span className="sr-only">Sledeći mesec</span>
      </Button>
    </div>
  );
};
