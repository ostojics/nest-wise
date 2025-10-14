import React from 'react';
import {CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Accordion} from '@/components/ui/accordion';
import {useIsMobile, TABLET_BREAKPOINT} from '@/hooks/use-mobile';
import TransactionAccordionItem from '@/modules/transactions/components/transaction-accordion-item';
import WeekDayStrip from './week-day-strip';
import WeekDaySelect from './week-day-select';
import WeekNavigation from './week-navigation';
import {useWeeklySpending} from './weekly-spending.context';
import {useSelectedDayData, DayData} from '../hooks/use-selected-day-data';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {format} from 'date-fns';

interface WeeklySpendingContentProps {
  days: DayData[];
}

export default function WeeklySpendingContent({days}: WeeklySpendingContentProps) {
  const isMobileOrTablet = useIsMobile(TABLET_BREAKPOINT);
  const {selectedDayKey, setSelectedDayKey} = useWeeklySpending();
  const selectedDayData = useSelectedDayData({days, selectedDayKey});
  const {formatBalance} = useFormatBalance();

  // Set initial selected day when days change or if no day is selected
  React.useEffect(() => {
    if (days.length > 0 && (!selectedDayKey || !days.find((d) => d.key === selectedDayKey))) {
      const today = new Date();
      const todayKey = format(today, 'yyyy-MM-dd');
      const todayDay = days.find((d) => d.key === todayKey);
      setSelectedDayKey(todayDay?.key ?? (days[0]?.key || ''));
    }
  }, [days, selectedDayKey, setSelectedDayKey]);

  if (!selectedDayData) {
    return null;
  }

  const transactions = selectedDayData.transactions;

  return (
    <>
      <CardHeader>
        <CardTitle>Potrošnja za tekuću sedmicu</CardTitle>
        <CardDescription>Pregled dnevne potrošnje i transakcija</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <WeekNavigation />

        <Separator />

        {isMobileOrTablet ? (
          <div className="space-y-2">
            <WeekDaySelect days={days} />
            <div className="text-sm">
              <span className="text-muted-foreground">Ukupna potrošnja: </span>
              <span className="font-medium">{formatBalance(selectedDayData.total)}</span>
            </div>
          </div>
        ) : (
          <WeekDayStrip days={days} />
        )}

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
