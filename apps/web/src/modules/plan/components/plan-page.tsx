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
      <section className="flex flex-col gap-3">
        <div className="flex flex-col @4xl/plan:flex-row gap-3">
          <AvailableBalanceCard />
          <SpendingVsTargetCard />
        </div>
      </section>
      <section className="mt-10">
        <MonthSwitcher />
      </section>
      <div className="flex flex-col items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold" data-testid="plan-page-title">
            Planirajte troškove domaćinstva po kategorijama
          </h3>
          <p className="text-muted-foreground text-sm" data-testid="plan-page-description">
            Postavite planirani iznos za svaku kategoriju. Kako unosite transakcije, vaša potrošnja se automatski prati
            za izabrani mesec.
          </p>
        </div>
        <NewCategoryDialog />
      </div>
      <CategoryBudgetsList />
      <Suspense fallback={<WeeklySpendingLoading />}>
        <div ref={ref}>{isVisible && <WeeklySpendingOverview />}</div>
      </Suspense>
    </section>
  );
};

export default PlanPage;
