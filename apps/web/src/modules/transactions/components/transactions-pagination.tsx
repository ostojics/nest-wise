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
    <section>
      <Pagination>
        <PaginationContent>
          {canGoPrev && (
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage - 1);
                }}
              />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>

          {canGoNext && (
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default TransactionsPagination;
