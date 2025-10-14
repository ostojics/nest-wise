import {Card} from '@/components/ui/card';
import {useWeeklyTransactions} from '@/modules/category-budgets/hooks/use-weekly-transactions';
import {WeeklySpendingProvider} from './weekly-spending.context';
import WeeklySpendingContent from './weekly-spending-content';
import WeeklySpendingLoading from './weekly-spending-loading';
import WeeklySpendingError from './weekly-spending-error';

export default function WeeklySpendingOverview() {
  const {data, isLoading, isError} = useWeeklyTransactions();

  return (
    <Card>
      {isLoading && <WeeklySpendingLoading />}
      {isError && <WeeklySpendingError />}
      {data && (
        <WeeklySpendingProvider initialSelectedDay={data.initialSelectedDay}>
          <WeeklySpendingContent days={data.days} />
        </WeeklySpendingProvider>
      )}
    </Card>
  );
}
