import {Badge} from '@/components/ui/badge';
import {cn, deserializeSortOption, serializeSortOption} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {PrivateTransactionContract, TPrivateTransactionSortField, TransactionType} from '@nest-wise/contracts';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {ColumnDef, getCoreRowModel, SortingState, useReactTable} from '@tanstack/react-table';
import {format} from 'date-fns';
import {useMemo} from 'react';
import PrivateTransactionRowActions from '../components/private-transaction-row-actions';

export const usePrivateTransactionsTable = (data: PrivateTransactionContract[]) => {
  const {formatBalance} = useFormatBalance();
  const search = useSearch({from: '/__pathlessLayout/my-finances'});
  const navigate = useNavigate();

  const sortValue: SortingState = useMemo(() => {
    return [deserializeSortOption(search.sort)];
  }, [search.sort]);

  const columns = useMemo<ColumnDef<PrivateTransactionContract>[]>(
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
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({row}) => {
          const isIncome = row.original.type === TransactionType.INCOME;
          const formatted = formatBalance(row.original.amount);
          return <span className={cn('font-medium', isIncome ? 'text-emerald-600' : 'text-red-600')}>{formatted}</span>;
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
      {
        id: 'actions',
        header: 'Actions',
        cell: ({row}) => <PrivateTransactionRowActions transactionId={row.original.id} />,
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
              sort: serializeSortOption(sort) as TPrivateTransactionSortField,
            }),
            to: '/my-finances',
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
