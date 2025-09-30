import CategoryBudgetsList from '@/modules/category-budgets/components/category-budgets-list';
import AvailableBalanceCard from './available-balance-card';
import SpendingVsTargetCard from './spending-vs-target-card';
import NewCategoryDialog from './new-category-dialog';
import MonthSwitcher from './selects/month-switcher';

const PlanPage = () => {
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
          <h3 className="text-xl font-semibold">Planirajte troškove domaćinstva po kategorijama</h3>
          <p className="text-muted-foreground text-sm">
            Postavite planirani iznos za svaku kategoriju. Kako unosite transakcije, vaša potrošnja se automatski prati
            za izabrani mesec.
          </p>
        </div>
        <NewCategoryDialog />
      </div>
      <CategoryBudgetsList />
    </section>
  );
};

export default PlanPage;
