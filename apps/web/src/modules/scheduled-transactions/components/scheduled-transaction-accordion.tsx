import {AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/use-get-household-categories';
import {
  ScheduledTransactionRuleContract,
  ScheduledTransactionFrequencyType,
  ScheduledTransactionStatus,
} from '@nest-wise/contracts';
import {format} from 'date-fns';
import {sr} from 'date-fns/locale';
import {useState, useMemo} from 'react';
import DeleteScheduledTransactionDialog from './delete-scheduled-transaction-dialog';

interface ScheduledTransactionAccordionProps {
  transaction: ScheduledTransactionRuleContract;
  onToggleStatus: () => void;
}

const frequencyLabels: Record<ScheduledTransactionFrequencyType, string> = {
  [ScheduledTransactionFrequencyType.WEEKLY]: 'Nedeljno',
  [ScheduledTransactionFrequencyType.MONTHLY]: 'Mesečno',
};

const dayOfWeekLabels = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];

export default function ScheduledTransactionAccordion({
  transaction: tx,
  onToggleStatus,
}: ScheduledTransactionAccordionProps) {
  const {formatBalance} = useFormatBalance();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {data: accounts} = useGetHouseholdAccounts();
  const {data: categories} = useGetHouseholdCategories();

  const accountName = useMemo(() => {
    return accounts?.find((acc) => acc.id === tx.accountId)?.name ?? tx.accountId;
  }, [accounts, tx.accountId]);

  const categoryName = useMemo(() => {
    if (!tx.categoryId) return '-';
    return categories?.find((cat) => cat.id === tx.categoryId)?.name ?? tx.categoryId;
  }, [categories, tx.categoryId]);

  const isIncome = tx.type === 'income';
  const amount = formatBalance(tx.amount);
  const dateLabel = format(new Date(tx.startDate), 'PP', {locale: sr});
  const isPaused = tx.status === ScheduledTransactionStatus.PAUSED;

  const getFrequencyText = () => {
    if (tx.frequencyType === ScheduledTransactionFrequencyType.WEEKLY && tx.dayOfWeek !== null) {
      return `${frequencyLabels[ScheduledTransactionFrequencyType.WEEKLY]} - ${dayOfWeekLabels[tx.dayOfWeek]}`;
    }
    if (tx.frequencyType === ScheduledTransactionFrequencyType.MONTHLY && tx.dayOfMonth !== null) {
      return `${frequencyLabels[ScheduledTransactionFrequencyType.MONTHLY]} - ${tx.dayOfMonth}. dan`;
    }
    return frequencyLabels[tx.frequencyType];
  };

  return (
    <AccordionItem key={tx.id} value={String(tx.id)}>
      <AccordionTrigger className="px-4 hover:no-underline cursor-pointer">
        <div className="w-full flex items-center justify-between gap-5 py-1.5 @container/tx">
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate font-medium text-foreground/90">{tx.description ?? 'Bez opisa'}</div>
            <div className="text-xs text-muted-foreground truncate">{getFrequencyText()}</div>
          </div>
          <div className="flex flex-col items-end shrink-0 gap-1">
            <span className={cn('font-medium', isIncome ? 'text-emerald-600' : 'text-red-600')}>{amount}</span>
            <Badge variant={isPaused ? 'secondary' : 'default'} className="text-xs">
              {isPaused ? 'Pauzirano' : 'Aktivno'}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="grid grid-cols-1 gap-3 text-sm @sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Opis</span>
            <div>
              <span className="text-foreground/90">{tx.description ?? 'Bez opisa'}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Račun</span>
            <div>
              <span className="text-foreground/80">{accountName}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Kategorija</span>
            <div>
              <span className="text-foreground/80">{categoryName}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Tip</span>
            <div className="mt-1">
              <Badge
                className={cn(isIncome && 'bg-emerald-100 text-emerald-700')}
                variant={tx.type === 'expense' ? 'destructive' : 'secondary'}
              >
                <span>{tx.type === 'expense' ? 'Rashod' : 'Prihod'}</span>
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Frekvencija</span>
            <div>
              <span className="text-foreground/80">{getFrequencyText()}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Početak</span>
            <div>
              <span className="text-foreground/80">{dateLabel}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Iznos</span>
            <div>
              <span className={cn('font-medium', isIncome ? 'text-emerald-600' : 'text-red-600')}>{amount}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Status</span>
            <div className="mt-1">
              <Badge variant={isPaused ? 'secondary' : 'default'}>{isPaused ? 'Pauzirano' : 'Aktivno'}</Badge>
            </div>
          </div>
        </div>
        <div className="pt-3 flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onToggleStatus}>
            {isPaused ? 'Nastavi' : 'Pauziraj'}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            Obriši
          </Button>
        </div>
      </AccordionContent>
      <DeleteScheduledTransactionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        transactionId={tx.id}
        description={tx.description ?? 'Bez opisa'}
      />
    </AccordionItem>
  );
}
