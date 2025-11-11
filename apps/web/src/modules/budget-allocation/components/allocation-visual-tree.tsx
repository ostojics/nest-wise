import {BudgetAllocationWithCalculationsContract} from '@nest-wise/contracts';

interface AllocationVisualTreeProps {
  allocation: BudgetAllocationWithCalculationsContract;
}

export const AllocationVisualTree: React.FC<AllocationVisualTreeProps> = ({allocation}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculatePercentage = (amount: number, total: number) => {
    if (total === 0) return 0;
    return ((amount / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Vizuelni Pregled</h3>
      <div className="space-y-2 font-mono text-sm">
        <div className="font-semibold">PLATA: {formatCurrency(allocation.salaryAmount)} RSD</div>
        <div className="pl-4 text-muted-foreground">
          └─ Fiksni troškovi: {formatCurrency(allocation.fixedBillsAmount)} RSD [
          {calculatePercentage(allocation.fixedBillsAmount, allocation.salaryAmount)}%]
        </div>
        <div className="mt-4 font-semibold">OSTATAK: {formatCurrency(allocation.remainder)} RSD</div>
        <div className="pl-4">
          ├─ Potrošnja: {formatCurrency(allocation.spendingAmount)} RSD [{allocation.spendingPercentage}%]
        </div>
        <div className="pl-4">
          ├─ Investicije: {formatCurrency(allocation.investingAmount)} RSD [{allocation.investingPercentage}%]
        </div>
        <div className="pl-4">
          └─ Davanje: {formatCurrency(allocation.givingAmount)} RSD [{allocation.givingPercentage}%]
        </div>
      </div>
    </div>
  );
};
