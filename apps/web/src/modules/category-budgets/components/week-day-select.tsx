import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {format} from 'date-fns';
import {useWeeklySpending} from './weekly-spending.context';

export default function WeekDaySelect() {
  const {days, selectedDayKey, setSelectedDayKey} = useWeeklySpending();
  const {formatBalance} = useFormatBalance();

  return (
    <Select value={selectedDayKey} onValueChange={setSelectedDayKey}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Izaberite dan" />
      </SelectTrigger>
      <SelectContent>
        {days.map((day) => {
          const dateLabel = format(day.date, 'd.M.');
          const amountLabel = formatBalance(day.total);

          return (
            <SelectItem key={day.key} value={day.key} disabled={day.isFuture}>
              <div className="flex items-center justify-between gap-4 w-full">
                <span>
                  {day.label}, {dateLabel}
                </span>
                <span className={day.total > 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                  {amountLabel}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
