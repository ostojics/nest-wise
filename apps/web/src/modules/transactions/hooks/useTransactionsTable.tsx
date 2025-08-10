import {Badge} from '@/components/ui/badge';
import {cn, deserializeSortOption, serializeSortOption} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {TransactionContract, TransactionType} from '@maya-vault/contracts';
import {TransactionSortField} from '@maya-vault/validation';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {ColumnDef, getCoreRowModel, SortingState, useReactTable} from '@tanstack/react-table';
import {format} from 'date-fns';
import {useMemo} from 'react';

export const useTransactionsTable = (data: TransactionContract[]) => {
  const {formatBalance} = useFormatBalance();
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const navigate = useNavigate();

  const sortValue: SortingState = useMemo(() => {
    if (!search.sort) {
      return [{id: 'transactionDate', desc: true}];
    }

    return [deserializeSortOption(search.sort)];
  }, [search.sort]);

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
    state: {sorting: sortValue},
    onSortingChange: (newSorting) => {
      if (typeof newSorting === 'function') {
        const sorted = newSorting(sortValue);
        const sort = sorted[0];

        if (sort) {
          void navigate({
            search: (prev) => ({
              ...prev,
              sort: serializeSortOption(sort) as TransactionSortField,
            }),
            to: '/transactions',
          });
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
  });

  return table;
};
