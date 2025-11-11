import {Card} from '@/components/ui/card';
import {useGetBudgetAllocation} from '../hooks/use-budget-allocation';
import {format} from 'date-fns';
import {useState} from 'react';
import {BudgetAllocationForm} from '../components/budget-allocation-form';
import {AllocationVisualTree} from '../components/allocation-visual-tree';
import {MonthSwitcher} from '../components/month-switcher';
import {useGetHouseholdById} from '@/modules/households/hooks/use-get-household-by-id';

const BudgetAllocationPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const {data: household} = useGetHouseholdById();
  const {data: allocation, isLoading} = useGetBudgetAllocation(household?.id ?? '', {month: selectedMonth});

  if (!household) {
    return null;
  }

  return (
    <section className="p-4 space-y-6 @container/budget-allocation">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Budžet</h1>
          <MonthSwitcher selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </div>
      </div>

      <div className="grid gap-6 @4xl/budget-allocation:grid-cols-2">
        <Card className="p-6">
          <BudgetAllocationForm
            householdId={household.id}
            selectedMonth={selectedMonth}
            allocation={allocation ?? undefined}
            isLoading={isLoading}
          />
        </Card>

        {allocation && (
          <Card className="p-6">
            <AllocationVisualTree allocation={allocation} />
          </Card>
        )}
      </div>
    </section>
  );
};

export default BudgetAllocationPage;
