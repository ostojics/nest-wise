import {CreatePrivateTransactionDialog} from './create-private-transaction-dialog';
import {useGetPrivateTransactions} from '../hooks/use-get-private-transactions';
import PrivateTransactionsTableSkeleton from './private-transactions-table.skeleton';
import PrivateTransactionsTableError from './private-transactions-table.error';
import {lazy, Suspense} from 'react';

const PrivateTransactionsTable = lazy(() =>
  import('./private-transactions-table').then((m) => ({default: m.PrivateTransactionsTable})),
);

const MyFinancesPage = () => {
  const {data, isLoading, isError, refetch} = useGetPrivateTransactions();

  return (
    <section className="p-4 flex flex-col h-full space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Finances</h1>
        <p className="text-muted-foreground mt-1">
          This page shows only your private finances. Use it to review and log your personal expenses and income.
        </p>
      </div>
      <div className="mt-2">
        <CreatePrivateTransactionDialog />
      </div>
      <div className="flex-1">
        {isLoading ? (
          <PrivateTransactionsTableSkeleton />
        ) : isError ? (
          <PrivateTransactionsTableError onRetry={refetch} />
        ) : (
          <Suspense fallback={<PrivateTransactionsTableSkeleton />}>
            <PrivateTransactionsTable data={data?.data ?? []} />
          </Suspense>
        )}
      </div>
    </section>
  );
};

export default MyFinancesPage;
