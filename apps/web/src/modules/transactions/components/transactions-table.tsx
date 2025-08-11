import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {TransactionContract} from '@maya-vault/contracts';
import {flexRender} from '@tanstack/react-table';
import {ArrowUpDown} from 'lucide-react';
import {useTransactionsTable} from '../hooks/useTransactionsTable';
import {cn} from '@/lib/utils';

interface TransactionsTableProps {
  data: TransactionContract[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function TransactionsTable({data, isLoading = false, skeletonCount = 10}: TransactionsTableProps) {
  const table = useTransactionsTable(data, {isLoading, skeletonCount});

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
                        {sorted && <span className="sr-only">{sorted === 'asc' ? 'ascending' : 'descending'}</span>}
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
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
