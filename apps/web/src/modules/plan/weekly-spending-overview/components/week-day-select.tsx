import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {format} from 'date-fns';
import {useWeeklySpending} from './weekly-spending.context';
import {DayData} from '../hooks/use-selected-day-data';

interface WeekDaySelectProps {
  days: DayData[];
}

export default function WeekDaySelect({days}: WeekDaySelectProps) {
  const {selectedDayKey, setSelectedDayKey} = useWeeklySpending();

  return (
    <Select value={selectedDayKey} onValueChange={setSelectedDayKey}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Izaberite dan" />
      </SelectTrigger>
      <SelectContent>
        {days.map((day) => {
          const dateLabel = format(day.date, 'd.M.');

          return (
            <SelectItem key={day.key} value={day.key}>
              {day.label}, {dateLabel}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
