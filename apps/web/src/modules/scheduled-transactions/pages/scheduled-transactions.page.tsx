import TextBanner from '@/components/text-banner';
import {useSearch, useNavigate} from '@tanstack/react-router';
import {useGetScheduledTransactions} from '../hooks/use-scheduled-transactions';
import ScheduledTransactionList from '../components/scheduled-transaction-list';
import ScheduleDialog from '../components/schedule-dialog/schedule-dialog';
import ScheduledTransactionsError from '../components/scheduled-transactions-error';
import ScheduledTransactionsLoading from '../components/scheduled-transactions-loading';

function ScheduledTransactionsPageContent() {
  const search = useSearch({from: '/__pathlessLayout/scheduled-transactions'});
  const navigate = useNavigate();

  const {data, isLoading, isError} = useGetScheduledTransactions({
    page: search.page,
    pageSize: search.pageSize,
  });

  const handlePageChange = (page: number) => {
    void navigate({
      to: '/scheduled-transactions',
      search: (prev) => ({...prev, page}),
    });
  };

  if (isLoading) {
    return <ScheduledTransactionsLoading />;
  }

  if (isError) {
    return <ScheduledTransactionsError />;
  }

  return (
    <section className="p-4 space-y-4">
      <TextBanner
        aria-label="Zakazane transakcije"
        text="Zakazane transakcije omogućavaju automatsko kreiranje ponavljajućih transakcija. Podesite frekvenciju i iznos, a transakcije će biti kreirane po vašem rasporedu."
      />
      <div className="flex items-center gap-2">
        <ScheduleDialog />
      </div>
      <ScheduledTransactionList
        transactions={data?.data ?? []}
        currentPage={search.page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default function ScheduledTransactionsPage() {
  return <ScheduledTransactionsPageContent />;
}
