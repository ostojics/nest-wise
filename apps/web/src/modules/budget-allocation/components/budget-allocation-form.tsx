import {BudgetAllocationWithCalculationsContract, CreateBudgetAllocationDTO} from '@nest-wise/contracts';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useCreateBudgetAllocation, useUpdateBudgetAllocation} from '../hooks/use-budget-allocation';
import {toast} from 'sonner';
import {Slider} from '@/components/ui/slider';

interface BudgetAllocationFormProps {
  householdId: string;
  selectedMonth: string;
  allocation?: BudgetAllocationWithCalculationsContract;
  isLoading: boolean;
}

export const BudgetAllocationForm: React.FC<BudgetAllocationFormProps> = ({
  householdId,
  selectedMonth,
  allocation,
  isLoading,
}) => {
  const createMutation = useCreateBudgetAllocation(householdId);
  const updateMutation = useUpdateBudgetAllocation(householdId, allocation?.id ?? '');

  const [salaryAmount, setSalaryAmount] = useState('0');
  const [fixedBillsAmount, setFixedBillsAmount] = useState('0');
  const [spendingPercentage, setSpendingPercentage] = useState(25);
  const [investingPercentage, setInvestingPercentage] = useState(65);
  const [givingPercentage, setGivingPercentage] = useState(10);

  // Update form when allocation changes
  useEffect(() => {
    if (allocation) {
      setSalaryAmount(String(allocation.salaryAmount));
      setFixedBillsAmount(String(allocation.fixedBillsAmount));
      setSpendingPercentage(allocation.spendingPercentage);
      setInvestingPercentage(allocation.investingPercentage);
      setGivingPercentage(allocation.givingPercentage);
    } else {
      // Reset to defaults for new month
      setSalaryAmount('0');
      setFixedBillsAmount('0');
      setSpendingPercentage(25);
      setInvestingPercentage(65);
      setGivingPercentage(10);
    }
  }, [allocation, selectedMonth]);

  const remainder = Number(salaryAmount) - Number(fixedBillsAmount);
  const spendingAmount = (remainder * spendingPercentage) / 100;
  const investingAmount = (remainder * investingPercentage) / 100;
  const givingAmount = (remainder * givingPercentage) / 100;

  const percentagesSum = spendingPercentage + investingPercentage + givingPercentage;
  const isValidPercentages = percentagesSum === 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPercentages) {
      toast.error('Procenti moraju biti tačno 100%');
      return;
    }

    const dto: CreateBudgetAllocationDTO = {
      month: selectedMonth,
      salaryAmount: Number(salaryAmount),
      fixedBillsAmount: Number(fixedBillsAmount),
      spendingPercentage,
      investingPercentage,
      givingPercentage,
    };

    try {
      if (allocation) {
        await updateMutation.mutateAsync(dto);
        toast.success('Alokacija budžeta je ažurirana');
      } else {
        await createMutation.mutateAsync(dto);
        toast.success('Alokacija budžeta je kreirana');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Došlo je do greške');
    }
  };

  const handleReset = () => {
    if (allocation) {
      setSalaryAmount(String(allocation.salaryAmount));
      setFixedBillsAmount(String(allocation.fixedBillsAmount));
      setSpendingPercentage(allocation.spendingPercentage);
      setInvestingPercentage(allocation.investingPercentage);
      setGivingPercentage(allocation.givingPercentage);
    } else {
      setSalaryAmount('0');
      setFixedBillsAmount('0');
      setSpendingPercentage(25);
      setInvestingPercentage(65);
      setGivingPercentage(10);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mesečna Primanja i Troškovi</h3>

        <div className="space-y-2">
          <Label htmlFor="salary">Plata (RSD)</Label>
          <Input
            id="salary"
            type="number"
            step="0.01"
            min="0"
            value={salaryAmount}
            onChange={(e) => setSalaryAmount(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fixedBills">Fiksni troškovi (RSD)</Label>
          <Input
            id="fixedBills"
            type="number"
            step="0.01"
            min="0"
            value={fixedBillsAmount}
            onChange={(e) => setFixedBillsAmount(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="pt-2 space-y-1">
          <div className="text-sm font-medium">Ostatak:</div>
          <div className="text-2xl font-bold">{formatCurrency(remainder)} RSD</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pravila Raspodele (Golden Rules)</h3>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Potrošnja: {spendingPercentage}%</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(spendingAmount)} RSD</span>
            </div>
            <Slider
              value={[spendingPercentage]}
              onValueChange={(value: number[]) => setSpendingPercentage(value[0] ?? 0)}
              max={100}
              step={1}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Investicije: {investingPercentage}%</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(investingAmount)} RSD</span>
            </div>
            <Slider
              value={[investingPercentage]}
              onValueChange={(value: number[]) => setInvestingPercentage(value[0] ?? 0)}
              max={100}
              step={1}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Davanje: {givingPercentage}%</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(givingAmount)} RSD</span>
            </div>
            <Slider
              value={[givingPercentage]}
              onValueChange={(value: number[]) => setGivingPercentage(value[0] ?? 0)}
              max={100}
              step={1}
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <div className={`text-sm font-medium ${isValidPercentages ? 'text-green-600' : 'text-destructive'}`}>
              Ukupno: {percentagesSum}% {isValidPercentages ? '✓' : '✗'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isLoading || !isValidPercentages || createMutation.isPending || updateMutation.isPending}
        >
          {allocation ? 'Ažuriraj' : 'Sačuvaj'}
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
          Poništi
        </Button>
      </div>
    </form>
  );
};
