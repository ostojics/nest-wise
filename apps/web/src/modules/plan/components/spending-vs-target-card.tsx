import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {cn, getStartAndEndOfMonth} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {useGetHouseholdById} from '@/modules/households/hooks/use-get-household-by-id';
import {IconEdit, IconTarget} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import EditMonthlyBudgetModal from './edit-monthly-budget-modal';
import SpendingVsTargetCardSkeleton from './spending-vs-target-card.skeleton';
import SpendingVsTargetCardError from './spending-vs-target-card.error';
import {useGetSpendingTotal} from '@/modules/transactions/hooks/use-get-spending-total';

const SpendingVsTargetCard = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {formatBalance} = useFormatBalance();
  const {data: household} = useGetHouseholdById();
  const {start, end} = getStartAndEndOfMonth();
  const {
    data: spendingSummary,
    isLoading,
    isError,
    refetch,
  } = useGetSpendingTotal({
    search: {
      from: start,
      to: end,
    },
  });

  const currentSpending = spendingSummary?.total ?? 0;

  const budget = household?.monthlyBudget ?? 0;

  const spendingPercentage = useMemo(() => {
    return Math.min((currentSpending / budget) * 100, 100);
  }, [budget, currentSpending]);

  const remainingBudget = useMemo(() => {
    return budget - currentSpending;
  }, [budget, currentSpending]);

  const getStatusColor = () => {
    if (spendingPercentage >= 100) return 'text-red-600 dark:text-red-400';
    if (spendingPercentage >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressBarClassName = (percentage: number) => {
    let colorClass: string;

    if (percentage >= 100) {
      colorClass = '[&>[data-slot="progress-indicator"]]:bg-red-500';
    } else if (percentage >= 80) {
      colorClass = '[&>[data-slot="progress-indicator"]]:bg-yellow-500';
    } else {
      colorClass = '[&>[data-slot="progress-indicator"]]:bg-green-500';
    }

    return cn('h-2.5', colorClass);
  };

  if (isLoading) {
    return <SpendingVsTargetCardSkeleton />;
  }

  if (isError) {
    return <SpendingVsTargetCardError onRetry={refetch} />;
  }

  return (
    <Card className="group flex-1 hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconTarget className="h-4 w-4" />
            Monthly Budget
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
            title="Edit monthly budget"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
        </CardDescription>
        <CardTitle
          className={cn(
            'text-2xl font-semibold tabular-nums @[250px]/card:text-3xl transition-colors',
            getStatusColor(),
          )}
        >
          {formatBalance(currentSpending)}
        </CardTitle>
        <div className="text-sm text-muted-foreground">of {formatBalance(budget)} target</div>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-4 text-sm">
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn('font-medium', getStatusColor())}>{spendingPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={spendingPercentage} className={getProgressBarClassName(spendingPercentage)} />
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Remaining</span>
            <span
              className={cn(
                'font-medium',
                remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
              )}
            >
              {remainingBudget >= 0 ? formatBalance(remainingBudget) : `-${formatBalance(Math.abs(remainingBudget))}`}
            </span>
          </div>
        </div>
      </CardFooter>

      <EditMonthlyBudgetModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </Card>
  );
};

export default SpendingVsTargetCard;
