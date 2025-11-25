import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {cn, getStartAndEndOfMonthIso} from '@/lib/utils';
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
  const {start, end} = getStartAndEndOfMonthIso();
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
    <Card
      className="group flex-1 h-full border-none shadow-sm bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300"
      data-testid="spending-vs-target-card"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 bg-primary/10 rounded-full text-primary">
              <IconTarget className="h-4 w-4" />
            </div>
            Mesečni budžet
          </CardDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditModalOpen(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
            title="Izmeni mesečni budžet"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <CardTitle
            className={cn('text-2xl font-bold tabular-nums transition-colors', getStatusColor())}
            data-testid="spending-amount"
          >
            {formatBalance(currentSpending)}
          </CardTitle>
          <span className="text-sm text-muted-foreground">/ {formatBalance(budget)}</span>
        </div>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-4 pt-4">
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Iskorišćeno</span>
            <span className={cn('font-medium', getStatusColor())}>{spendingPercentage.toFixed(1)}%</span>
          </div>
          <Progress
            value={spendingPercentage}
            className={cn('h-2 rounded-full bg-secondary/50', getProgressBarClassName(spendingPercentage))}
          />
        </div>

        <div className="w-full h-px bg-border/50" />

        <div className="flex justify-between items-center w-full text-sm">
          <span className="text-muted-foreground">Preostalo za trošenje</span>
          <span
            className={cn(
              'font-medium text-base',
              remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
            )}
            data-testid="remaining-amount"
          >
            {remainingBudget >= 0 ? formatBalance(remainingBudget) : `-${formatBalance(Math.abs(remainingBudget))}`}
          </span>
        </div>
      </CardFooter>

      <EditMonthlyBudgetModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </Card>
  );
};

export default SpendingVsTargetCard;
