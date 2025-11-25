import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {TransactionContract} from '@nest-wise/contracts';
import {flexRender} from '@tanstack/react-table';
import {ArrowUpDown} from 'lucide-react';
import {useTransactionsTable} from '../hooks/use-transactions-table';
import {cn} from '@/lib/utils';

interface TransactionsTableProps {
  data: TransactionContract[];
}

export function TransactionsTable({data}: TransactionsTableProps) {
  const table = useTransactionsTable(data);

  return (
    <div className="rounded-xl border-none shadow-sm bg-card/50 overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border/50">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();

                return (
                  <TableHead key={header.id} className={cn('text-sm font-medium text-muted-foreground')}>
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        className={cn(
                          'inline-flex hover:text-foreground cursor-pointer items-center gap-1 rounded-sm px-1 py-0.5 transition-colors',
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                className="border-b border-border/50 hover:bg-muted/30"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center text-muted-foreground">
                Nema pronađenih transakcija
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
