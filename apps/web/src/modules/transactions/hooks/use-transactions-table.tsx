import {Badge} from '@/components/ui/badge';
import {cn, deserializeSortOption, serializeSortOption} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {TransactionContract, TransactionType, TransactionSortField} from '@nest-wise/contracts';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {ColumnDef, getCoreRowModel, SortingState, useReactTable} from '@tanstack/react-table';
import {format} from 'date-fns';
import {useMemo} from 'react';
import TransactionRowActions from '../components/transaction-row-actions';

export const useTransactionsTable = (data: TransactionContract[]) => {
  const {formatBalance} = useFormatBalance();
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const navigate = useNavigate();

  const sortValue: SortingState = useMemo(() => {
    return [deserializeSortOption(search.sort)];
  }, [search.sort]);

  const columns = useMemo<ColumnDef<TransactionContract>[]>(
    () => [
      {
        accessorKey: 'description',
        header: 'Opis',
        cell: ({row}) => <span className="text-foreground/90">{row.original.description}</span>,
        enableSorting: false,
      },
      {
        id: 'accountName',
        header: 'Račun',
        cell: ({row}) => <span className="text-muted-foreground">{row.original.account?.name ?? '-'}</span>,
      },
      {
        id: 'categoryName',
        header: 'Kategorija',
        cell: ({row}) => <span className="text-muted-foreground">{row.original.category?.name ?? '-'}</span>,
      },
      {
        accessorKey: 'amount',
        header: 'Iznos',
        cell: ({row}) => {
          const isIncome = row.original.type === TransactionType.INCOME;
          const formatted = formatBalance(row.original.amount);

          return <span className={cn('font-medium', isIncome ? 'text-emerald-600' : 'text-red-600')}>{formatted}</span>;
        },
      },
      {
        accessorKey: 'type',
        header: 'Tip',
        cell: ({row}) => (
          <Badge
            className={cn(row.original.type === TransactionType.INCOME && 'bg-emerald-100 text-emerald-700')}
            variant={row.original.type === TransactionType.EXPENSE ? 'destructive' : 'secondary'}
          >
            {row.original.type === TransactionType.EXPENSE ? 'Rashod' : 'Prihod'}
          </Badge>
        ),
      },
      {
        accessorKey: 'transactionDate',
        header: 'Datum',
        cell: ({row}) => (
          <span className="text-foreground/80">{format(new Date(row.original.transactionDate), 'PP')}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Radnje',
        cell: ({row}) => <TransactionRowActions transaction={row.original} />,
        enableSorting: false,
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
    enableSortingRemoval: false,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    debugAll: import.meta.env.DEV,
  });

  return table;
};
