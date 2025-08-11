import {useSearch} from '@tanstack/react-router';
import {useGetTransactions} from '../hooks/useGetTransactions';
import TransactionsPagination from './transactions-pagination';
import {TransactionsTable} from './transactions-table';
import TransactionsTableActions from './transactions-table-actions';
import {TransactionContract} from '@maya-vault/contracts';

const fallbackTransactions: TransactionContract[] = [];

const TransactionsPage = () => {
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const {data} = useGetTransactions({search});

  return (
    <section className="p-4 flex flex-col h-full">
      <div className="flex-1">
        <TransactionsTableActions />
        <TransactionsTable data={data?.data ?? fallbackTransactions} />
      </div>
      <TransactionsPagination />
    </section>
  );
};

export default TransactionsPage;
