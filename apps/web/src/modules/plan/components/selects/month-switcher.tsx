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
    {value: '01', label: 'January'},
    {value: '02', label: 'February'},
    {value: '03', label: 'March'},
    {value: '04', label: 'April'},
    {value: '05', label: 'May'},
    {value: '06', label: 'June'},
    {value: '07', label: 'July'},
    {value: '08', label: 'August'},
    {value: '09', label: 'September'},
    {value: '10', label: 'October'},
    {value: '11', label: 'November'},
    {value: '12', label: 'December'},
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
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        disabled={isLoading}
        className="h-9 w-9"
        onClick={handlePrev}
        aria-label="Previous month"
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={isLoading}
            variant="outline"
            title="Select month"
            className="h-9 min-w-50 justify-between font-normal"
          >
            {format(current, 'LLLL yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start" sideOffset={10}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="month-select" className="px-1 sr-only">
                Month
              </Label>
              <Select value={format(current, 'MM')} onValueChange={handleMonthChange}>
                <SelectTrigger id="month-select" className="h-9 min-w-40">
                  <SelectValue placeholder="Month" />
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
                Year
              </Label>
              <Select value={String(current.getFullYear())} onValueChange={handleYearChange}>
                <SelectTrigger id="year-select" className="h-9 min-w-28">
                  <SelectValue placeholder="Year" />
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
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={handleNext}
        aria-label="Next month"
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
};

export default MonthSwitcher;
