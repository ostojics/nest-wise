import {Accordion} from '@/components/ui/accordion';
import {TransactionContract} from '@nest-wise/contracts';
import TransactionRowActions from './transaction-row-actions';
import TransactionAccordionItem from './transaction-accordion-item';

interface TransactionsAccordionListProps {
  data: TransactionContract[];
}

export default function TransactionsAccordionList({data}: TransactionsAccordionListProps) {
  if (!data.length) {
    return (
      <div className="rounded-md border bg-card p-6 text-center text-muted-foreground">Nema pronađenih transakcija</div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Accordion type="single" collapsible className="w-full">
        {data.map((tx) => (
          <TransactionAccordionItem key={tx.id} transaction={tx} actions={<TransactionRowActions transaction={tx} />} />
        ))}
      </Accordion>
    </div>
  );
}
