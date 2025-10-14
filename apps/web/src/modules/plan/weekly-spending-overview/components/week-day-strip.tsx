import {Card} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {format} from 'date-fns';
import {useWeeklySpending} from './weekly-spending.context';
import {DayData} from '../hooks/use-selected-day-data';

interface WeekDayStripProps {
  days: DayData[];
}

export default function WeekDayStrip({days}: WeekDayStripProps) {
  const {selectedDayKey, setSelectedDayKey} = useWeeklySpending();
  const {formatBalance} = useFormatBalance();

  return (
    <div className="max-w-[62.3125rem] overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 min-w-max">
        {days.map((day) => {
          const isSelected = day.key === selectedDayKey;
          const dateLabel = format(day.date, 'd.M.');

          return (
            <Card
              key={day.key}
              className={cn(
                'p-3 cursor-pointer transition-all hover:border-primary/50 min-w-[8rem]',
                isSelected && 'border-primary bg-primary/5',
              )}
              onClick={() => setSelectedDayKey(day.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedDayKey(day.key);
                }
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs text-muted-foreground font-medium">{day.shortLabel}</div>
                <div className="text-sm font-semibold">{dateLabel}</div>
                <div className="text-sm font-medium">{formatBalance(day.total)}</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
