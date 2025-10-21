import {Badge} from '@/components/ui/badge';
import {Progress} from '@/components/ui/progress';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {CategoryBudgetWithCurrentAmountContract} from '@nest-wise/contracts';
import {ColumnDef, getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {useMemo} from 'react';
import EditCategoryBudgetDialog from '../components/edit-category-budget-dialog';
import EditCategoryDialog from '@/modules/categories/components/edit-category-dialog';
import DeleteCategoryDialog from '../components/delete-category-dialog';

export const useCategoryBudgetsTable = (
  data: CategoryBudgetWithCurrentAmountContract[],
  opts?: {isEditable?: boolean},
) => {
  const {formatBalance} = useFormatBalance();

  const columns = useMemo<ColumnDef<CategoryBudgetWithCurrentAmountContract>[]>(
    () => [
      {
        id: 'category',
        header: 'Kategorija',
        cell: ({row}) => {
          const planned = row.original.plannedAmount;
          const spent = row.original.currentAmount;
          const value = planned <= 0 ? 0 : Math.min(100, Math.max(0, (spent / planned) * 100));
          const percentText = `${Math.round(value)}%`;

          return (
            <div className="min-w-[9.375rem] pr-4">
              <div className="text-foreground/90">{row.original.category.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <Progress className="h-[0.375rem]" value={value} />
                <span className="text-xs text-muted-foreground">{percentText}</span>
              </div>
            </div>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({row}) => {
          const planned = row.original.plannedAmount;
          const spent = row.original.currentAmount;
          const available = planned - spent;
          const isOverspent = available < 0;
          const label = isOverspent ? 'Prekoračeno' : planned > 0 ? 'U skladu sa planom' : '—';
          return <span>{label}</span>;
        },
        enableSorting: false,
      },
      {
        accessorKey: 'plannedAmount',
        header: 'Planirano',
        enableSorting: false,
        cell: ({row}) => <span className="tabular-nums">{formatBalance(row.original.plannedAmount)}</span>,
      },
      {
        id: 'spent',
        header: 'Potrošeno',
        enableSorting: false,
        cell: ({row}) => <span className="tabular-nums">{formatBalance(row.original.currentAmount)}</span>,
      },
      {
        id: 'available',
        header: 'Raspoloživo',
        cell: ({row}) => {
          const available = row.original.plannedAmount - row.original.currentAmount;
          const negative = available < 0;
          return (
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
          );
        },
      },
      {
        id: 'actions',
        cell: ({row}) => (
          <div className="flex items-center gap-2">
            <EditCategoryBudgetDialog
              categoryBudgetId={row.original.id}
              enableTrigger={opts?.isEditable}
              plannedAmount={row.original.plannedAmount}
            />
            <EditCategoryDialog
              categoryId={row.original.categoryId}
              currentName={row.original.category.name}
              currentDescription={row.original.category.description}
            />
            <DeleteCategoryDialog categoryId={row.original.categoryId} categoryName={row.original.category.name} />
          </div>
        ),
        enableSorting: false,
      },
    ],
    [formatBalance, opts?.isEditable],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSortingRemoval: false,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    debugAll: import.meta.env.DEV,
  });

  return table;
};
