import {AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {TransactionContract, TransactionType} from '@nest-wise/contracts';
import {format} from 'date-fns';

interface TransactionAccordionItemProps {
  transaction: TransactionContract;
  actions?: React.ReactNode;
}

export default function TransactionAccordionItem({transaction: tx, actions}: TransactionAccordionItemProps) {
  const {formatBalance} = useFormatBalance();

  const isIncome = tx.type === TransactionType.INCOME;
  const amount = formatBalance(tx.amount);
  const dateLabel = format(new Date(tx.transactionDate), 'PP');

  return (
    <AccordionItem key={tx.id} value={String(tx.id)} className="border-b border-border/50 last:border-0">
      <AccordionTrigger className="px-4 hover:no-underline cursor-pointer hover:bg-muted/30 transition-colors">
        <div className="w-full flex items-center justify-between gap-5 py-1.5 @container/tx">
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate font-semibold text-foreground">{tx.description}</div>
            <div className="text-sm text-muted-foreground truncate">{tx.category?.name ?? '-'}</div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className={cn('font-bold tabular-nums', isIncome ? 'text-emerald-600' : 'text-red-600')}>
              {amount}
            </span>
            <span className="text-sm text-muted-foreground tabular-nums">{dateLabel}</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 bg-muted/10">
        <div className="grid grid-cols-1 gap-3 text-sm @sm:grid-cols-2 pt-2">
          <div>
            <span className="text-muted-foreground text-xs">Opis</span>
            <div>
              <span className="text-base font-medium text-foreground">{tx.description}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Račun</span>
            <div>
              <span className="text-foreground">{tx.account?.name ?? '-'}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Kategorija</span>
            <div>
              <span className="text-foreground">{tx.category?.name ?? '-'}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Tip</span>
            <div className="mt-1">
              <Badge
                className={cn(isIncome && 'bg-emerald-100 text-emerald-700')}
                variant={tx.type === TransactionType.EXPENSE ? 'destructive' : 'secondary'}
              >
                <span>{tx.type === TransactionType.EXPENSE ? 'Rashod' : 'Prihod'}</span>
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Datum</span>
            <div>
              <span className="text-foreground tabular-nums">{dateLabel}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Iznos</span>
            <div>
              <span className={cn('text-lg font-bold tabular-nums', isIncome ? 'text-emerald-600' : 'text-red-600')}>
                {amount}
              </span>
            </div>
          </div>
        </div>
        {actions && <div className="pt-4 flex justify-end">{actions}</div>}
      </AccordionContent>
    </AccordionItem>
  );
}
