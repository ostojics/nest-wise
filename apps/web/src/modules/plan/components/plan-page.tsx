import CategoryBudgetsList from '@/modules/category-budgets/components/category-budgets-list';
import AvailableBalanceCard from './available-balance-card';
import SpendingVsTargetCard from './spending-vs-target-card';
import NewCategoryDialog from './new-category-dialog';
import MonthSwitcher from './selects/month-switcher';

const PlanPage = () => {
  return (
    <section className="p-4 space-y-6 @container/dashboard">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col @4xl/dashboard:flex-row gap-3">
          <AvailableBalanceCard />
          <SpendingVsTargetCard />
        </div>
        {/* <SpendingByCategoryCard />
        <Suspense fallback={<NetWorthTrendCardSkeleton />}>
          <div ref={ref}>{isVisible && <NetWorthTrendCard />}</div>
        </Suspense> */}
      </section>
      <section>
        <MonthSwitcher />
      </section>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold">Plan your spending by category</h3>
          <p className="text-muted-foreground text-sm">
            Set a planned amount for each category. As you log transactions, your spending is tracked automatically for
            the selected month.
          </p>
        </div>
        <NewCategoryDialog />
      </div>
      <CategoryBudgetsList />
    </section>
  );
};

export default PlanPage;
