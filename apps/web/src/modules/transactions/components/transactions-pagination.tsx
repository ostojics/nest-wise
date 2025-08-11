import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {cn} from '@/lib/utils';
import {useNavigate, useSearch} from '@tanstack/react-router';

const TransactionsPagination = () => {
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const navigate = useNavigate();

  const currentPage = Number(search.page);

  const goToPage = (page: number) => {
    void navigate({to: '/transactions', search: (prev) => ({...prev, page})});
  };

  const canGoPrev = currentPage > 1;

  return (
    <section>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(!canGoPrev && 'pointer-events-none opacity-50')}
              onClick={(e) => {
                e.preventDefault();
                if (canGoPrev) goToPage(currentPage - 1);
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
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
