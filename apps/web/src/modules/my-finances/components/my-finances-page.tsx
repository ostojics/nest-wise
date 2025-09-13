import {CreatePrivateTransactionDialog} from './create-private-transaction-dialog';
import {useGetPrivateTransactions} from '../hooks/use-get-private-transactions';
import PrivateTransactionsTableSkeleton from './private-transactions-table.skeleton';
import PrivateTransactionsTableError from './private-transactions-table.error';
import {lazy, Suspense} from 'react';
import {TABLET_BREAKPOINT, useIsMobile} from '@/hooks/use-mobile';
import PrivateTransactionsTableActions from './private-transactions-table-actions';
import PrivateTransactionsPagination from './private-transactions-pagination';
import PrivateTransactionsAccordionListSkeleton from './private-transactions-accordion-list.skeleton';
import PrivateTransactionsAccordionListError from './private-transactions-accordion-list.error';

const PrivateTransactionsTable = lazy(() =>
  import('./private-transactions-table').then((m) => ({default: m.PrivateTransactionsTable})),
);
const PrivateTransactionsAccordionList = lazy(() => import('./private-transactions-accordion-list'));

const MyFinancesPage = () => {
  const {data, isLoading, isError, refetch} = useGetPrivateTransactions();
  const isMobile = useIsMobile(TABLET_BREAKPOINT);

  const renderContent = () => {
    if (isLoading) {
      return isMobile ? <PrivateTransactionsAccordionListSkeleton /> : <PrivateTransactionsTableSkeleton />;
    }

    if (isError) {
      return isMobile ? (
        <PrivateTransactionsAccordionListError onRetry={refetch} />
      ) : (
        <PrivateTransactionsTableError onRetry={refetch} />
      );
    }

    const items = data?.data ?? [];
    return isMobile ? (
      <Suspense fallback={<PrivateTransactionsAccordionListSkeleton />}>
        <PrivateTransactionsAccordionList data={items} />
      </Suspense>
    ) : (
      <Suspense fallback={<PrivateTransactionsTableSkeleton />}>
        <PrivateTransactionsTable data={items} />
      </Suspense>
    );
  };

  return (
    <section className="p-4 flex flex-col h-full @container/transactions">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Finances</h1>
        <p className="text-muted-foreground mt-1 text-balance">
          This page shows only your private finances. Use it to review and log your personal expenses and income.
        </p>
      </div>
      <div className="mt-4">
        <CreatePrivateTransactionDialog />
      </div>
      <div className="flex-1 mt-8">
        <PrivateTransactionsTableActions />
        {renderContent()}
      </div>
      <div className="mt-5">
        <PrivateTransactionsPagination />
      </div>
    </section>
  );
};

export default MyFinancesPage;
