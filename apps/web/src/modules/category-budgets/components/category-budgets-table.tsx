import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {CategoryBudgetWithCurrentAmountContract} from '@nest-wise/contracts';
import {flexRender} from '@tanstack/react-table';
import {ArrowUpDown} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useCategoryBudgetsTable} from '../hooks/use-category-budgets-table';

interface CategoryBudgetsTableProps {
  data: CategoryBudgetWithCurrentAmountContract[];
  isEditable: boolean;
}

const CategoryBudgetsTable = ({data, isEditable}: CategoryBudgetsTableProps) => {
  const table = useCategoryBudgetsTable(data, {isEditable});

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();

                return (
                  <TableHead key={header.id} className={cn('text-xs text-muted-foreground')}>
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        className={cn(
                          'inline-flex hover:text-white cursor-pointer items-center gap-1 rounded-sm px-1 py-0.5 transition-colors',
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown className="size-4" />
                        {sorted && <span className="sr-only">{sorted === 'asc' ? 'rastuće' : 'opadajuće'}</span>}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center text-muted-foreground">
                Nema podataka za prikaz
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryBudgetsTable;
