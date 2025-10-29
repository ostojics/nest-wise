import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
import {Progress} from '@/components/ui/progress';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {CategoryBudgetWithCurrentAmountContract} from '@nest-wise/contracts';
import EditCategoryBudgetDialog from './edit-category-budget-dialog';
import EditCategoryDialog from '@/modules/categories/components/edit-category-dialog';
import CategoryBudgetsAccordionListSkeleton from './category-budgets-accordion-list.skeleton';
import CategoryBudgetsAccordionListError from './category-budgets-accordion-list.error';
import {useGetCategoryBudgets} from '../hooks/use-get-category-budgets';
import DeleteCategoryDialog from './delete-category-dialog';

interface CategoryBudgetsAccordionListProps {
  data: CategoryBudgetWithCurrentAmountContract[];
  isEditable: boolean;
}

function calculateProgressPercent(planned: number, spent: number): number {
  if (planned <= 0) return spent > 0 ? 100 : 0;
  const ratio = (spent / planned) * 100;

  return Math.min(100, Math.max(0, ratio));
}

export default function CategoryBudgetsAccordionList({data, isEditable}: CategoryBudgetsAccordionListProps) {
  const {formatBalance} = useFormatBalance();
  const {isLoading, isError, refetch} = useGetCategoryBudgets();

  if (isLoading) return <CategoryBudgetsAccordionListSkeleton />;
  if (isError) return <CategoryBudgetsAccordionListError onRetry={refetch} />;

  if (!data.length) {
    return (
      <div className="rounded-md border bg-card p-6 text-center text-muted-foreground">Nema budžeta kategorija</div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Accordion type="single" collapsible className="w-full">
        {data.map((item) => {
          const planned = item.plannedAmount;
          const spent = item.currentAmount;
          const available = planned - spent;
          const negative = available < 0;
          const progressValue = calculateProgressPercent(planned, spent);
          const status = negative ? 'Prekoračeno' : planned > 0 ? 'U skladu sa planom' : '—';
          const percentUsed = Math.round(progressValue);
          const percentText = `${percentUsed}%`;

          return (
            <AccordionItem key={item.id} value={String(item.id)}>
              <AccordionTrigger className="px-4">
                <div className="w-full flex items-center justify-between gap-5 py-1.5 @container/cb">
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate font-medium text-foreground/90">{item.category.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{status}</div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <Badge
                      className={cn('tabular-nums px-2.5 py-1 bg-secondary text-secondary-fore')}
                      variant="secondary"
                    >
                      {percentText}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 gap-3 text-sm @sm:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground">Kategorija</div>
                    <div className="text-foreground/90">{item.category.name}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div className="text-foreground/80">{status}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Dodeljeno</div>
                    <div className="text-foreground/80 tabular-nums">{formatBalance(planned)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Potrošeno</div>
                    <div className="text-foreground/80 tabular-nums">{formatBalance(spent)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Raspoloživo</div>
                    <div className="mt-1">
                      <Badge
                        className={cn(
                          'tabular-nums px-2.5 py-1',
                          negative
                            ? 'bg-destructive text-white'
                            : 'bg-emerald-100 text-white dark:bg-emerald-900 dark:text-emerald-300',
                        )}
                        variant={negative ? 'destructive' : 'secondary'}
                      >
                        {formatBalance(available)}
                      </Badge>
                    </div>
                  </div>
                  <div className="@sm:col-span-2">
                    <div className="text-muted-foreground">Napredak</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress className="h-[6px]" value={progressValue} />
                      <span className="text-xs text-muted-foreground">{percentText}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <EditCategoryBudgetDialog
                    categoryBudgetId={item.id}
                    enableTrigger={isEditable}
                    plannedAmount={item.plannedAmount}
                  />
                  <EditCategoryDialog
                    categoryId={item.categoryId}
                    currentName={item.category.name}
                    currentDescription={item.category.description}
                  />
                  <DeleteCategoryDialog categoryId={item.categoryId} categoryName={item.category.name} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
