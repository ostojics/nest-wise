import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {IconTarget} from '@tabler/icons-react';
import React, {useMemo} from 'react';

const mockSpendingData = {
  currentSpending: 2847.3,
  targetBudget: 3200.0,
  lastMonthSpending: 3125.45,
};

const SpendingVsTargetCard: React.FC = () => {
  const {formatBalance} = useFormatBalance();

  const spendingPercentage = useMemo(() => {
    return Math.min((mockSpendingData.currentSpending / mockSpendingData.targetBudget) * 100, 100);
  }, []);

  const remainingBudget = useMemo(() => {
    return mockSpendingData.targetBudget - mockSpendingData.currentSpending;
  }, []);

  const getStatusColor = () => {
    if (spendingPercentage >= 100) return 'text-red-600 dark:text-red-400';
    if (spendingPercentage >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <Card className="@container/card group hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <IconTarget className="h-4 w-4" />
          Monthly Budget
        </CardDescription>
        <CardTitle
          className={cn(
            'text-2xl font-semibold tabular-nums @[250px]/card:text-3xl transition-colors',
            getStatusColor(),
          )}
        >
          {formatBalance(mockSpendingData.currentSpending)}
        </CardTitle>
        <div className="text-sm text-muted-foreground">of {formatBalance(mockSpendingData.targetBudget)} target</div>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-4 text-sm">
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn('font-medium', getStatusColor())}>{spendingPercentage.toFixed(1)}%</span>
          </div>
          <Progress
            value={spendingPercentage}
            className={cn(
              'h-2.5',
              spendingPercentage >= 100
                ? '[&>[data-slot="progress-indicator"]]:bg-red-500'
                : spendingPercentage >= 80
                  ? '[&>[data-slot="progress-indicator"]]:bg-yellow-500'
                  : '[&>[data-slot="progress-indicator"]]:bg-green-500',
            )}
          />
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
    </Card>
  );
};

export default SpendingVsTargetCard;
