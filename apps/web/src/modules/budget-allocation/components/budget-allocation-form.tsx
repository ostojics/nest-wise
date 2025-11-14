import {
  BudgetAllocationWithCalculationsContract,
  CreateBudgetAllocationDTO,
  BudgetAllocationCategoryInput,
} from '@nest-wise/contracts';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useCreateBudgetAllocation, useUpdateBudgetAllocation} from '../hooks/use-budget-allocation';
import {toast} from 'sonner';
import {Slider} from '@/components/ui/slider';
import {Plus, Trash2} from 'lucide-react';

interface BudgetAllocationFormProps {
  householdId: string;
  selectedMonth: string;
  allocation?: BudgetAllocationWithCalculationsContract;
  isLoading: boolean;
}

const DEFAULT_CATEGORIES: BudgetAllocationCategoryInput[] = [
  {name: 'Potrošnja', percentage: 25, displayOrder: 0},
  {name: 'Investicije', percentage: 65, displayOrder: 1},
  {name: 'Davanje', percentage: 10, displayOrder: 2},
];

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
  const [categories, setCategories] = useState<BudgetAllocationCategoryInput[]>(DEFAULT_CATEGORIES);

  // Update form when allocation changes
  useEffect(() => {
    if (allocation) {
      setSalaryAmount(String(allocation.salaryAmount));
      setFixedBillsAmount(String(allocation.fixedBillsAmount));
      setCategories(
        allocation.categories
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((cat) => ({
            name: cat.name,
            percentage: cat.percentage,
            displayOrder: cat.displayOrder,
          })),
      );
    } else {
      // Reset to defaults for new month
      setSalaryAmount('0');
      setFixedBillsAmount('0');
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [allocation, selectedMonth]);

  const remainder = Number(salaryAmount) - Number(fixedBillsAmount);

  const percentagesSum = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  const isValidPercentages = percentagesSum === 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleCategoryPercentageChange = (index: number, newPercentage: number) => {
    const newCategories = [...categories];
    const category = newCategories[index];
    if (category) {
      category.percentage = newPercentage;
      setCategories(newCategories);
    }
  };

  const handleCategoryNameChange = (index: number, newName: string) => {
    const newCategories = [...categories];
    const category = newCategories[index];
    if (category) {
      category.name = newName;
      setCategories(newCategories);
    }
  };

  const addCategory = () => {
    const newCategory: BudgetAllocationCategoryInput = {
      name: '',
      percentage: 0,
      displayOrder: categories.length,
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (index: number) => {
    if (categories.length <= 1) {
      toast.error('Mora postojati najmanje jedna kategorija');
      return;
    }
    const newCategories = categories.filter((_, i) => i !== index);
    // Update display orders
    newCategories.forEach((cat, i) => {
      cat.displayOrder = i;
    });
    setCategories(newCategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPercentages) {
      toast.error('Procenti moraju biti tačno 100%');
      return;
    }

    // Check for empty category names
    if (categories.some((cat) => !cat.name.trim())) {
      toast.error('Sve kategorije moraju imati ime');
      return;
    }

    const dto: CreateBudgetAllocationDTO = {
      month: selectedMonth,
      salaryAmount: Number(salaryAmount),
      fixedBillsAmount: Number(fixedBillsAmount),
      categories: categories.map((cat, index) => ({
        name: cat.name.trim(),
        percentage: cat.percentage,
        displayOrder: index,
      })),
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
      setCategories(
        allocation.categories
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((cat) => ({
            name: cat.name,
            percentage: cat.percentage,
            displayOrder: cat.displayOrder,
          })),
      );
    } else {
      setSalaryAmount('0');
      setFixedBillsAmount('0');
      setCategories(DEFAULT_CATEGORIES);
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Kategorije Raspodele</h3>
          <Button type="button" variant="outline" size="sm" onClick={addCategory} disabled={isLoading}>
            <Plus className="size-4 mr-2" />
            Dodaj kategoriju
          </Button>
        </div>

        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor={`category-name-${index}`}>Ime kategorije</Label>
                  <Input
                    id={`category-name-${index}`}
                    type="text"
                    value={category.name}
                    onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                    disabled={isLoading}
                    placeholder="Unesite ime kategorije"
                  />
                </div>
                {categories.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCategory(index)}
                    disabled={isLoading}
                    className="mt-6"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{category.percentage}%</Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency((remainder * category.percentage) / 100)} RSD
                  </span>
                </div>
                <Slider
                  value={[category.percentage]}
                  onValueChange={(value: number[]) => handleCategoryPercentageChange(index, value[0] ?? 0)}
                  max={100}
                  step={1}
                  disabled={isLoading}
                />
              </div>
            </div>
          ))}

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
