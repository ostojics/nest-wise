import {useMemo} from 'react';
import {useSearch} from '@tanstack/react-router';
import {format, isAfter, parse} from 'date-fns';
import {CategoryBudgetWithCurrentAmountContract} from '@maya-vault/contracts';

import {Skeleton} from '@/components/ui/skeleton';
import {useGetCategoryBudgets} from '../hooks/use-get-category-budgets';
import CategoryBudgetItem from './category-budget-item';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';

const CategoryBudgetsList = () => {
  const search = useSearch({from: '/__pathlessLayout/plan'});
  const {data, isLoading} = useGetCategoryBudgets(search);
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

  if (isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {items.map((item) => (
          <CategoryBudgetItem key={item.id} item={item} isEditable={isEditable} />
        ))}
      </div>

      <div className="border-t pt-4 grid grid-cols-3 text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">Total Planned</span>
          <span className="tabular-nums">{formatBalance(totals.planned)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">Total Spent</span>
          <span className="tabular-nums">{formatBalance(totals.spent)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">Remaining</span>
          <span className={`tabular-nums ${totals.available < 0 ? 'text-destructive' : ''}`}>
            {formatBalance(totals.available)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryBudgetsList;
