import BudgetAllocationPage from '@/modules/budget-allocation/pages/budget-allocation-page';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/budget-allocation')({
  component: BudgetAllocationPage,
});
