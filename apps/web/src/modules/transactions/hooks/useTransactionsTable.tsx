import {Badge} from '@/components/ui/badge';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {TransactionContract, TransactionType} from '@maya-vault/contracts';
import {ColumnDef, SortingState, getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {format} from 'date-fns';
import {useMemo, useState} from 'react';
import {cn, serializeSortOption} from '@/lib/utils';

export const useTransactionsTable = (data: TransactionContract[]) => {
  const {formatBalance} = useFormatBalance();
  const [sorting, setSorting] = useState<SortingState>([{id: 'transactionDate', desc: true}]);

  const columns = useMemo<ColumnDef<TransactionContract>[]>(
    () => [
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({row}) => <span className="text-foreground/90">{row.original.description}</span>,
        enableSorting: false,
      },
      {
        id: 'accountName',
        header: 'Account',
        cell: ({row}) => <span className="text-muted-foreground">{row.original.account?.name ?? '-'}</span>,
      },
      {
        id: 'categoryName',
        header: 'Category',
        cell: ({row}) => <span className="text-muted-foreground">{row.original.category?.name ?? '-'}</span>,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({row}) => {
          const isIncome = row.original.type === TransactionType.INCOME;
          const sign = isIncome ? '+' : '-';
          const formatted = formatBalance(row.original.amount);

          return (
            <span className={cn('font-medium', isIncome ? 'text-emerald-600' : 'text-red-600')}>
              {sign}
              {formatted}
            </span>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({row}) => (
          <Badge
            className={cn(row.original.type === TransactionType.INCOME && 'bg-emerald-100 text-emerald-700')}
            variant={row.original.type === TransactionType.EXPENSE ? 'destructive' : 'secondary'}
          >
            {row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: 'transactionDate',
        header: 'Date',
        cell: ({row}) => (
          <span className="text-foreground/80">{format(new Date(row.original.transactionDate), 'PP')}</span>
        ),
      },
    ],
    [formatBalance],
  );

  const table = useReactTable({
    data,
    columns,
    state: {sorting},
    onSortingChange: (newSorting) => {
      if (typeof newSorting === 'function') {
        const sorted = newSorting(sorting);

        if (sorted[0]) {
          console.log(serializeSortOption(sorted[0]));
        }
      }

      setSorting(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
  });

  return table;
};
