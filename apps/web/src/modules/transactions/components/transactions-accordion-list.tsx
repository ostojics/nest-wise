import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {TransactionContract, TransactionType} from '@nest-wise/contracts';
import {format} from 'date-fns';
import TransactionRowActions from './transaction-row-actions';

interface TransactionsAccordionListProps {
  data: TransactionContract[];
}

export default function TransactionsAccordionList({data}: TransactionsAccordionListProps) {
  const {formatBalance} = useFormatBalance();

  if (!data.length) {
    return <div className="rounded-md border bg-card p-6 text-center text-muted-foreground">No transactions found</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Accordion type="single" collapsible className="w-full">
        {data.map((tx) => {
          const isIncome = tx.type === TransactionType.INCOME;
          const sign = isIncome ? '+' : '-';
          const amount = formatBalance(tx.amount);
          const dateLabel = format(new Date(tx.transactionDate), 'PP');

          return (
            <AccordionItem key={tx.id} value={String(tx.id)}>
              <AccordionTrigger className="px-4">
                <div className="w-full flex items-center justify-between gap-5 py-1.5 @container/tx">
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate font-medium text-foreground/90">{tx.description}</div>
                    <div className="text-xs text-muted-foreground truncate hidden @md/tx:block">
                      {tx.category?.name ?? '-'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={cn('font-medium', isIncome ? 'text-emerald-600' : 'text-red-600')}>
                      {sign}
                      {amount}
                    </span>
                    <span className="text-xs text-muted-foreground">{dateLabel}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 gap-3 text-sm @sm:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground">Description</div>
                    <div className="text-foreground/90">{tx.description}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Account</div>
                    <div className="text-foreground/80">{tx.account?.name ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Category</div>
                    <div className="text-foreground/80">{tx.category?.name ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Type</div>
                    <div className="mt-1">
                      <Badge
                        className={cn(isIncome && 'bg-emerald-100 text-emerald-700')}
                        variant={tx.type === TransactionType.EXPENSE ? 'destructive' : 'secondary'}
                      >
                        {tx.type}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Date</div>
                    <div className="text-foreground/80">{dateLabel}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Amount</div>
                    <div className={cn('font-medium', isIncome ? 'text-emerald-600' : 'text-red-600')}>
                      {sign}
                      {amount}
                    </div>
                  </div>
                </div>
                <div className="pt-3 flex justify-end">
                  <TransactionRowActions transaction={tx} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
