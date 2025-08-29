import {useState, useMemo} from 'react';
import {CategoryBudgetWithCurrentAmountContract} from '@maya-vault/contracts';

import {Button} from '@/components/ui/button';
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Progress} from '@/components/ui/progress';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';

interface CategoryBudgetItemProps {
  item: CategoryBudgetWithCurrentAmountContract;
  isEditable: boolean;
}

const CategoryBudgetItem = ({item, isEditable}: CategoryBudgetItemProps) => {
  const {formatBalance} = useFormatBalance();
  const [isEditing, setIsEditing] = useState(false);
  const [plannedValue, setPlannedValue] = useState<number>(item.plannedAmount);

  const spent = item.currentAmount;
  const planned = isEditing ? plannedValue : item.plannedAmount;
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
        <CardAction>
          {isEditable ? (
            !isEditing ? (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPlannedValue(item.plannedAmount);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )
          ) : (
            <div className="text-muted-foreground text-xs">Read-only</div>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing && isEditable ? (
          <div className="flex items-center gap-2">
            <Input
              inputMode="decimal"
              type="number"
              min={0}
              value={Number.isNaN(plannedValue) ? '' : plannedValue}
              onChange={(e) => setPlannedValue(Number(e.target.value))}
              className="max-w-[200px]"
            />
            <div className="text-muted-foreground text-sm">Planned amount</div>
          </div>
        ) : null}

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
            <span className={`tabular-nums ${overspent ? 'text-destructive' : ''}`}>{formatBalance(available)}</span>
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
