import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {useSearch, useNavigate} from '@tanstack/react-router';
import {useGetScheduledTransactions} from '../hooks/use-scheduled-transactions';
import ScheduledTransactionList from '../components/scheduled-transaction-list';
import ScheduleDialog from '../components/schedule-dialog/schedule-dialog';

function ScheduledTransactionsPageContent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const search = useSearch({from: '/__pathlessLayout/scheduled-transactions'});
  const navigate = useNavigate();

  const {data, isLoading} = useGetScheduledTransactions({
    page: search.page,
    pageSize: search.pageSize,
  });

  const handlePageChange = (page: number) => {
    void navigate({
      to: '/scheduled-transactions',
      search: (prev) => ({...prev, page}),
    });
  };

  const handleCreateNew = () => {
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zakazane transakcije</h1>
          <p className="text-muted-foreground mt-1">Upravljajte ponavljajućim transakcijama</p>
        </div>
        <Button onClick={handleCreateNew}>Zakažite novu transakciju</Button>
      </div>

      <ScheduledTransactionList
        transactions={data?.data ?? []}
        currentPage={search.page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={handlePageChange}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onEdit={() => {}}
      />

      <ScheduleDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

export default function ScheduledTransactionsPage() {
  return <ScheduledTransactionsPageContent />;
}
