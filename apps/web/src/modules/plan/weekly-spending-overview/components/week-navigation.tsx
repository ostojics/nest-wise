import {Button} from '@/components/ui/button';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {format} from 'date-fns';
import {useWeeklySpending} from './weekly-spending.context';

export default function WeekNavigation() {
  const {weekStart, weekEnd, goToPreviousWeek, goToNextWeek} = useWeeklySpending();
  const weekRangeText = `${format(weekStart, 'd.M.')} - ${format(weekEnd, 'd.M.yyyy')}`;

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="outline" size="icon" onClick={goToPreviousWeek} aria-label="Prethodna nedelja">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">{weekRangeText}</span>
      </div>

      <Button variant="outline" size="icon" onClick={goToNextWeek} aria-label="Sledeća nedelja">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
