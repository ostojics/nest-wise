import {format, parse} from 'date-fns';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useMemo, useState} from 'react';

import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {cn} from '@/lib/utils';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {useGetCategoryBudgets} from '@/modules/category-budgets/hooks/use-get-category-budgets';

interface MonthSwitcherProps {
  className?: string;
}

const MonthSwitcher: React.FC<MonthSwitcherProps> = ({className}) => {
  const search = useSearch({from: '/__pathlessLayout/plan'});
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {isLoading} = useGetCategoryBudgets();

  const current = useMemo(() => parse(search.month, 'yyyy-MM', new Date()), [search.month]);

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
    void navigate({to: '/plan', search: (prev) => ({...prev, month: formatDate(date)})});
    setOpen(false);
  };

  const handleNext = () => {
    const date = new Date(current);
    date.setMonth(date.getMonth() + 1);
    void navigate({to: '/plan', search: (prev) => ({...prev, month: formatDate(date)})});
    setOpen(false);
  };

  const handleMonthChange = (value: string) => {
    const date = new Date(current);
    date.setMonth(parseInt(value, 10) - 1);
    void navigate({to: '/plan', search: (prev) => ({...prev, month: formatDate(date)})});
    setOpen(false);
  };

  const handleYearChange = (value: string) => {
    const date = new Date(current);
    date.setFullYear(parseInt(value, 10));
    void navigate({to: '/plan', search: (prev) => ({...prev, month: formatDate(date)})});
    setOpen(false);
  };

  return (
    <div
      className={cn('flex items-center gap-1 bg-card/50 p-1 rounded-lg border border-border/40 shadow-sm', className)}
    >
      <Button
        variant="ghost"
        size="icon"
        disabled={isLoading}
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={handlePrev}
        aria-label="Prethodni mesec"
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Prethodni mesec</span>
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={isLoading}
            variant="ghost"
            title="Izaberite mesec"
            className="h-8 min-w-40 justify-center font-normal text-sm hover:bg-background/80"
          >
            {format(current, 'LLLL yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="center" sideOffset={10}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="month-select" className="px-1 sr-only">
                Mesec
              </Label>
              <Select value={format(current, 'MM')} onValueChange={handleMonthChange}>
                <SelectTrigger id="month-select" className="h-9 min-w-40 capitalize">
                  <SelectValue placeholder="Mesec" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="capitalize">
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
      <Button
        disabled={isLoading}
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={handleNext}
        aria-label="Sledeći mesec"
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Sledeći mesec</span>
      </Button>
    </div>
  );
};

export default MonthSwitcher;
