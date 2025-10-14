import {Card} from '@/components/ui/card';
import {useWeeklyTransactions} from '@/modules/category-budgets/hooks/use-weekly-transactions';
import {WeeklySpendingProvider, useWeeklySpending} from './weekly-spending.context';
import WeeklySpendingContent from './weekly-spending-content';
import WeeklySpendingLoading from './weekly-spending-loading';
import WeeklySpendingError from './weekly-spending-error';

function WeeklySpendingOverviewInner() {
  const {weekStart, weekEnd} = useWeeklySpending();
  const {data, isLoading, isError} = useWeeklyTransactions({weekStart, weekEnd});

  return (
    <Card>
      {isLoading && <WeeklySpendingLoading />}
      {isError && <WeeklySpendingError />}
      {data && <WeeklySpendingContent days={data.days} />}
    </Card>
  );
}

export default function WeeklySpendingOverview() {
  return (
    <WeeklySpendingProvider>
      <WeeklySpendingOverviewInner />
    </WeeklySpendingProvider>
  );
}
