import {useSearch} from '@tanstack/react-router';
import {useGetTransactions} from '../hooks/useGetTransactions';
import TransactionsPagination from './transactions-pagination';
import {TransactionsTable} from './transactions-table';
import TransactionsTableActions from './transactions-table-actions';
import {TransactionContract} from '@maya-vault/contracts';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';

const fallbackTransactions: TransactionContract[] = [];

const TransactionsPage = () => {
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const {data: me} = useGetMe();
  const householdId = me?.householdId;
  const {data} = useGetTransactions({search: {...search, householdId}});

  return (
    <section className="p-4 flex flex-col h-full @container/transactions">
      <div className="flex-1">
        <TransactionsTableActions />
        <TransactionsTable data={data?.data ?? fallbackTransactions} />
      </div>
      <TransactionsPagination />
    </section>
  );
};

export default TransactionsPage;
