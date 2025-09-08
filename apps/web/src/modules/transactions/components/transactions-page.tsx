import {useSearch} from '@tanstack/react-router';
import {useGetTransactions} from '../hooks/useGetTransactions';
import TransactionsPagination from './transactions-pagination';
import TransactionsTableActions from './transactions-table-actions';
import {TransactionContract} from '@maya-vault/contracts';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {TABLET_BREAKPOINT, useIsMobile} from '@/hooks/use-mobile';
import TransactionsTableSkeleton from './transactions-table.skeleton';
import TransactionsTableError from './transactions-table.error';
import TransactionsAccordionListSkeleton from './transactions-accordion-list.skeleton';
import TransactionsAccordionListError from './transactions-accordion-list.error';
import {lazy, Suspense} from 'react';

const TransactionsTable = lazy(() => import('./transactions-table').then((m) => ({default: m.TransactionsTable})));
const TransactionsAccordionList = lazy(() => import('./transactions-accordion-list'));

const fallbackTransactions: TransactionContract[] = [];

const TransactionsPage = () => {
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const {data: me} = useGetMe();
  const householdId = me?.householdId;
  const {data, isLoading, isError, refetch} = useGetTransactions({search: {...search, householdId}});
  const isMobile = useIsMobile(TABLET_BREAKPOINT);

  const renderContent = () => {
    if (isLoading) {
      return isMobile ? <TransactionsAccordionListSkeleton /> : <TransactionsTableSkeleton />;
    }

    if (isError) {
      return isMobile ? (
        <TransactionsAccordionListError onRetry={refetch} />
      ) : (
        <TransactionsTableError onRetry={refetch} />
      );
    }

    const items = data?.data ?? fallbackTransactions;
    return isMobile ? (
      <Suspense fallback={<TransactionsAccordionListSkeleton />}>
        <TransactionsAccordionList data={items} />
      </Suspense>
    ) : (
      <Suspense fallback={<TransactionsTableSkeleton />}>
        <TransactionsTable data={items} />
      </Suspense>
    );
  };

  return (
    <section className="p-4 flex flex-col h-full @container/transactions">
      <div className="flex-1">
        <TransactionsTableActions />
        {renderContent()}
      </div>
      <TransactionsPagination />
    </section>
  );
};

export default TransactionsPage;
