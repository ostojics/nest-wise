import {CategoryBudgetWithCurrentAmountContract} from '@nest-wise/contracts';
import {useSearch} from '@tanstack/react-router';
import {format, isAfter, parse} from 'date-fns';

import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {useGetCategoryBudgets} from '../hooks/use-get-category-budgets';
import {lazy, Suspense, useMemo} from 'react';
import CategoryBudgetsTableSkeleton from './category-budgets-table.skeleton';
import CategoryBudgetsListSkeleton from './category-budgets-list.skeleton';
import CategoryBudgetsListError from './category-budgets-list.error';
import CategoryBudgetsAccordionListSkeleton from './category-budgets-accordion-list.skeleton';
import {useIsMobile, TABLET_BREAKPOINT} from '@/hooks/use-mobile';

const CategoryBudgetsTable = lazy(() => import('./category-budgets-table'));
const CategoryBudgetsAccordionList = lazy(() => import('./category-budgets-accordion-list'));

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
    <div className="space-y-6" data-testid="category-budgets-section">
      <Card className="border-none shadow-sm bg-card/50 overflow-hidden">
        <CardHeader className="pb-2">
          <CardDescription className="text-sm text-muted-foreground">
            Ukupno planirano za {format(new Date(search.month), 'LLLL yyyy')}
          </CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums mt-1" data-testid="total-planned">
            {formatBalance(totals.planned)}
          </CardTitle>
        </CardHeader>
      </Card>

      {isMobile ? (
        <Suspense fallback={<CategoryBudgetsAccordionListSkeleton />}>
          <CategoryBudgetsAccordionList data={items} isEditable={isEditable} />
        </Suspense>
      ) : (
        <Suspense fallback={<CategoryBudgetsTableSkeleton />}>
          <div className="rounded-xl border-none shadow-sm bg-card/50 overflow-hidden">
            <CategoryBudgetsTable data={items} isEditable={isEditable} />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default CategoryBudgetsList;
