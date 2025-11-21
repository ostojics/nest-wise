import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {useGetTransactions} from '../hooks/use-get-transactions';
import {cn} from '@/lib/utils';

const TransactionsPagination = () => {
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const navigate = useNavigate();
  const {data} = useGetTransactions({search});

  const currentPage = search.page;
  const totalPages = data?.meta.totalPages ?? 1;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToPage = (page: number) => {
    void navigate({to: '/transactions', search: (prev) => ({...prev, page})});
  };

  return (
    <section className="mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(!canGoPrev && 'pointer-events-none opacity-50')}
              onClick={(e) => {
                if (!canGoPrev) return;

                e.preventDefault();
                goToPage(currentPage - 1);
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              className={cn(!canGoNext && 'pointer-events-none opacity-50')}
              onClick={(e) => {
                if (!canGoNext) return;

                e.preventDefault();
                goToPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default TransactionsPagination;
