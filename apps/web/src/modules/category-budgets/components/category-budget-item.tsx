import {CategoryBudgetWithCurrentAmountContract} from '@maya-vault/contracts';
import {useMemo} from 'react';

import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import EditCategoryBudgetDialog from './edit-category-budget-dialog';
import {cn} from '@/lib/utils';

interface CategoryBudgetItemProps {
  item: CategoryBudgetWithCurrentAmountContract;
  isEditable: boolean;
}

const CategoryBudgetItem = ({item, isEditable}: CategoryBudgetItemProps) => {
  const {formatBalance} = useFormatBalance();

  const spent = item.currentAmount;
  const planned = item.plannedAmount;
  const available = useMemo(() => planned - spent, [planned, spent]);
  const progressValue = useMemo(() => {
    if (planned <= 0) return 0;
    const value = (spent / planned) * 100;
    return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  }, [planned, spent]);

  const overspent = spent > planned;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{item.category.name}</CardDescription>
        <CardTitle className="text-xl font-semibold">{formatBalance(planned)}</CardTitle>
        <CardAction>{isEditable && <EditCategoryBudgetDialog initialValue={item.plannedAmount} />}</CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 @[520px]/card:grid-cols-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Planned</span>
            <span className="tabular-nums">{formatBalance(item.plannedAmount)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Spent</span>
            <span className="tabular-nums">{formatBalance(spent)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Available</span>
            <span className={cn('tabular-nums', overspent && 'text-destructive')}>{formatBalance(available)}</span>
          </div>
        </div>

        <div className="space-y-1">
          <Progress value={progressValue} />
          <div className="text-muted-foreground text-xs">{Math.round(progressValue)}% of planned spent</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryBudgetItem;
