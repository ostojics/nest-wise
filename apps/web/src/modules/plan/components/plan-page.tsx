import {lazy} from 'react';
import CategoryBudgetsList from '@/modules/category-budgets/components/category-budgets-list';
const WeeklySpendingOverview = lazy(
  () => import('@/modules/plan/weekly-spending-overview/components/weekly-spending-overview'),
);
import AvailableBalanceCard from './available-balance-card';
import SpendingVsTargetCard from './spending-vs-target-card';
import NewCategoryDialog from './new-category-dialog';
import MonthSwitcher from './selects/month-switcher';
import {useIntersectionObserver} from 'usehooks-ts';
import {Suspense, useState} from 'react';
import WeeklySpendingLoading from '../weekly-spending-overview/components/weekly-spending-loading';

const PlanPage = () => {
  const {ref} = useIntersectionObserver({
    threshold: 0.5,
    onChange: (isIntersecting) => {
      if (isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    },
  });
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="p-4 space-y-6 @container/plan">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold" data-testid="plan-page-title">
            Planirajte troškove
          </h3>
          <p className="text-muted-foreground" data-testid="plan-page-description">
            Pratite potrošnju i postavite ciljeve za svaku kategoriju.
          </p>
        </div>
        <NewCategoryDialog />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AvailableBalanceCard />
        <SpendingVsTargetCard />
      </section>

      <section className="flex items-center justify-between py-2">
        <MonthSwitcher />
      </section>

      <CategoryBudgetsList />
      <Suspense fallback={<WeeklySpendingLoading />}>
        <div ref={ref}>{isVisible && <WeeklySpendingOverview />}</div>
      </Suspense>
    </section>
  );
};

export default PlanPage;
