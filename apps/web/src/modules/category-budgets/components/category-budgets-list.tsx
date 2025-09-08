import {CategoryBudgetWithCurrentAmountContract} from '@maya-vault/contracts';
import {useSearch} from '@tanstack/react-router';
import {format, isAfter, parse} from 'date-fns';
import {useMemo} from 'react';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {useGetCategoryBudgets} from '../hooks/use-get-category-budgets';
import CategoryBudgetsTable from './category-budgets-table';
import CategoryBudgetsListSkeleton from './category-budgets-list.skeleton';
import CategoryBudgetsListError from './category-budgets-list.error';
import CategoryBudgetsAccordionList from './category-budgets-accordion-list';
import {useIsMobile, TABLET_BREAKPOINT} from '@/hooks/use-mobile';

const CategoryBudgetsList = () => {
  const search = useSearch({from: '/__pathlessLayout/plan'});
  const {data, isLoading, isError, refetch} = useGetCategoryBudgets();
  const {formatBalance} = useFormatBalance();
  const isMobile = useIsMobile(TABLET_BREAKPOINT);

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

  if (isLoading && !isMobile) return <CategoryBudgetsListSkeleton />;
  if (isError && !isMobile) return <CategoryBudgetsListError onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <Card className="@container/card overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Total planned</CardTitle>
          <CardDescription>{format(parse(search.month, 'yyyy-MM', new Date()), 'LLLL yyyy')}</CardDescription>
        </CardHeader>
        <CardContent className="py-1">
          <div className="text-xl font-semibold tabular-nums">{formatBalance(totals.planned)}</div>
        </CardContent>
      </Card>

      {isMobile ? (
        <CategoryBudgetsAccordionList data={items} isEditable={isEditable} />
      ) : (
        <CategoryBudgetsTable data={items} isEditable={isEditable} />
      )}
    </div>
  );
};

export default CategoryBudgetsList;
