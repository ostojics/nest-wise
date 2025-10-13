import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Accordion} from '@/components/ui/accordion';
import {useIsMobile, TABLET_BREAKPOINT} from '@/hooks/use-mobile';
import {useWeeklyTransactions} from '../hooks/use-weekly-transactions';
import {WeeklySpendingProvider, useWeeklySpending} from './weekly-spending.context';
import WeekDayStrip from './week-day-strip';
import WeekDaySelect from './week-day-select';
import TransactionAccordionItem from '@/modules/transactions/components/transaction-accordion-item';
import {Skeleton} from '@/components/ui/skeleton';

function WeeklySpendingContent() {
  const isMobileOrTablet = useIsMobile(TABLET_BREAKPOINT);
  const {selectedDayData} = useWeeklySpending();

  if (!selectedDayData) {
    return null;
  }

  const transactions = selectedDayData.transactions;

  return (
    <>
      <CardHeader>
        <CardTitle>Potrošnja za tekuću nedelju</CardTitle>
        <CardDescription>Pregled dnevne potrošnje i transakcija</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMobileOrTablet ? <WeekDaySelect /> : <WeekDayStrip />}

        <Separator />

        <div className="max-h-[31.25rem] overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="rounded-md border bg-card p-6 text-center text-muted-foreground">
              Nema transakcija za ovaj dan
            </div>
          ) : (
            <div className="rounded-md border bg-card">
              <Accordion type="single" collapsible className="w-full">
                {transactions.map((tx) => (
                  <TransactionAccordionItem key={tx.id} transaction={tx} />
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}

function WeeklySpendingLoading() {
  return (
    <>
      <CardHeader>
        <CardTitle>Potrošnja za tekuću nedelju</CardTitle>
        <CardDescription>Pregled dnevne potrošnje i transakcija</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({length: 7}).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Separator />
        <Skeleton className="h-40" />
      </CardContent>
    </>
  );
}

function WeeklySpendingError() {
  return (
    <>
      <CardHeader>
        <CardTitle>Potrošnja za tekuću nedelju</CardTitle>
        <CardDescription>Pregled dnevne potrošnje i transakcija</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border bg-card p-6 text-center text-muted-foreground">
          Nije moguće učitati podatke o potrošnji.
        </div>
      </CardContent>
    </>
  );
}

export default function WeeklySpendingOverview() {
  const {data, isLoading, isError} = useWeeklyTransactions();

  return (
    <Card>
      {isLoading && <WeeklySpendingLoading />}
      {isError && <WeeklySpendingError />}
      {data && (
        <WeeklySpendingProvider days={data.days} initialSelectedDay={data.initialSelectedDay}>
          <WeeklySpendingContent />
        </WeeklySpendingProvider>
      )}
    </Card>
  );
}
