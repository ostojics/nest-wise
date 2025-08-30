import {useMemo} from 'react';
import {useSearch} from '@tanstack/react-router';
import {format, isAfter, parse} from 'date-fns';
import {CategoryBudgetWithCurrentAmountContract} from '@maya-vault/contracts';

import {Skeleton} from '@/components/ui/skeleton';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {Progress} from '@/components/ui/progress';
import {useGetCategoryBudgets} from '../hooks/use-get-category-budgets';
import CategoryBudgetsTable from './category-budgets-table';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {Activity, PiggyBank, Wallet} from 'lucide-react';

const CategoryBudgetsList = () => {
  const search = useSearch({from: '/__pathlessLayout/plan'});
  const {data, isLoading} = useGetCategoryBudgets();
  const {formatBalance} = useFormatBalance();

  const isEditable = useMemo(() => {
    const monthDate = parse(search.month, 'yyyy-MM', new Date());
    const startOfThisMonth = parse(format(new Date(), 'yyyy-MM'), 'yyyy-MM', new Date());
    return isAfter(monthDate, startOfThisMonth) || monthDate.getTime() === startOfThisMonth.getTime();
  }, [search.month]);

  const items = useMemo(() => (data ?? []) as unknown as CategoryBudgetWithCurrentAmountContract[], [data]);

  const totals = useMemo(() => {
    const planned = items.reduce((sum: number, it) => sum + it.plannedAmount, 0);
    const spent = items.reduce((sum: number, it) => sum + it.currentAmount, 0);
    const available = planned - spent;
    return {planned, spent, available};
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold">Plan your spending by category</h3>
          <p className="text-muted-foreground text-sm">
            Set a planned amount for each category. As you log transactions, your spending is tracked automatically for
            the selected month.
          </p>
        </div>
        <Button size="sm">New Category</Button>
      </div>

      <Card className="@container/card overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-base">This month overview</CardTitle>
          <CardDescription>
            {format(parse(search.month, 'yyyy-MM', new Date()), 'LLLL yyyy')} · Snapshot of your plan and spending
          </CardDescription>
        </CardHeader>
        <CardContent className="py-5 space-y-4">
          <div className="grid gap-3 @[520px]/card:grid-cols-3">
            <div className="rounded-md border bg-muted/20 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Total Planned</span>
                <Badge variant="outline" className="gap-1">
                  <Wallet className="size-3 text-muted-foreground" /> Planned
                </Badge>
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">{formatBalance(totals.planned)}</div>
            </div>
            <div className="rounded-md border bg-muted/20 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Total Spent</span>
                <Badge variant="outline" className="gap-1">
                  <Activity className="size-3 text-muted-foreground" /> Spent
                </Badge>
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">{formatBalance(totals.spent)}</div>
            </div>
            <div className="rounded-md border bg-muted/20 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Remaining</span>
                <Badge className="gap-1" variant="outline">
                  <PiggyBank className="size-3 text-muted-foreground" /> Available
                </Badge>
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">{formatBalance(totals.available)}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Spent vs Planned</span>
              <span className="tabular-nums">
                {totals.planned > 0 ? Math.round((totals.spent / totals.planned) * 100) : 0}%
              </span>
            </div>
            <Progress className="h-3" value={totals.planned > 0 ? (totals.spent / totals.planned) * 100 : 0} />
            <div className="text-muted-foreground text-xs">
              {totals.available < 0
                ? 'You have overspent your plan this month.'
                : 'You are on track. Keep logging transactions to stay within plan.'}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      ) : (
        <CategoryBudgetsTable data={items} isEditable={isEditable} />
      )}
    </div>
  );
};

export default CategoryBudgetsList;
