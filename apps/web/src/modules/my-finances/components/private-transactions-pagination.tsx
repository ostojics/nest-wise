import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {useGetPrivateTransactions} from '../hooks/use-get-private-transactions';

const PrivateTransactionsPagination = () => {
  const search = useSearch({from: '/__pathlessLayout/my-finances'});
  const navigate = useNavigate();
  const {data} = useGetPrivateTransactions();

  const currentPage = Number(search.page);
  const totalPages = data?.meta.totalPages;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < (totalPages ?? 1);

  const goToPage = (page: number) => {
    void navigate({to: '/my-finances', search: (prev) => ({...prev, page})});
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

export default PrivateTransactionsPagination;
