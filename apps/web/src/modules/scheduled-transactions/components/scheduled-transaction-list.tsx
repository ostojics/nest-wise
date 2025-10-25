import {Accordion} from '@/components/ui/accordion';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {usePauseScheduledTransaction, useResumeScheduledTransaction} from '../hooks/use-scheduled-transactions';
import {ScheduledTransactionRuleContract, ScheduledTransactionStatus} from '@nest-wise/contracts';
import ScheduledTransactionAccordion from './scheduled-transaction-accordion';

interface ScheduledTransactionListProps {
  transactions: ScheduledTransactionRuleContract[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (transaction: ScheduledTransactionRuleContract) => void;
}

export default function ScheduledTransactionList({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
}: ScheduledTransactionListProps) {
  const pauseMutation = usePauseScheduledTransaction();
  const resumeMutation = useResumeScheduledTransaction();

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handleToggleStatus = (transaction: ScheduledTransactionRuleContract) => {
    if (transaction.status === ScheduledTransactionStatus.PAUSED) {
      resumeMutation.mutate(transaction.id);
    } else {
      pauseMutation.mutate(transaction.id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nema zakazanih transakcija.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {transactions.map((transaction) => (
          <ScheduledTransactionAccordion
            key={transaction.id}
            transaction={transaction}
            onEdit={() => onEdit(transaction)}
            onToggleStatus={() => handleToggleStatus(transaction)}
          />
        ))}
      </Accordion>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {canGoPrev && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage - 1);
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
                    onPageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
