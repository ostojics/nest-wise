import {Card} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {format} from 'date-fns';
import {useWeeklySpending} from './weekly-spending.context';

export default function WeekDayStrip() {
  const {days, selectedDayKey, setSelectedDayKey} = useWeeklySpending();
  const {formatBalance} = useFormatBalance();

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const isSelected = day.key === selectedDayKey;
        const dateLabel = format(day.date, 'd.M.');

        return (
          <Card
            key={day.key}
            className={cn(
              'p-3 cursor-pointer transition-all hover:border-primary/50',
              isSelected && 'border-primary bg-primary/5',
              day.isFuture && 'opacity-40 pointer-events-none',
            )}
            onClick={() => !day.isFuture && setSelectedDayKey(day.key)}
            role="button"
            tabIndex={day.isFuture ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !day.isFuture) {
                e.preventDefault();
                setSelectedDayKey(day.key);
              }
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs text-muted-foreground font-medium">{day.shortLabel}</div>
              <div className="text-sm font-semibold">{dateLabel}</div>
              <div className={cn('text-sm font-medium', day.total > 0 ? 'text-red-600' : 'text-muted-foreground')}>
                {formatBalance(day.total)}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
