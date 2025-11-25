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

interface WeeklySpendingContentProps {
  days: DayData[];
}

export default function WeeklySpendingContent({days}: WeeklySpendingContentProps) {
  const isMobileOrTablet = useIsMobile(TABLET_BREAKPOINT);
  const {selectedDayKey} = useWeeklySpending();
  const selectedDayData = useSelectedDayData({days, selectedDayKey});
  const {formatBalance} = useFormatBalance();

  if (!selectedDayData) {
    return null;
  }

  const transactions = selectedDayData.transactions;

  return (
    <>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Potrošnja po sedmicama</CardTitle>
        <CardDescription>Pregled dnevne potrošnje i transakcija</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <WeekNavigation />

        <div className="space-y-4">
          {isMobileOrTablet ? (
            <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
              <WeekDaySelect days={days} />
              <div className="flex justify-between items-center text-sm pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Ukupna potrošnja</span>
                <span className="font-semibold text-base">{formatBalance(selectedDayData.total)}</span>
              </div>
            </div>
          ) : (
            <WeekDayStrip days={days} />
          )}
        </div>

        <div className="max-h-[31.25rem] overflow-y-auto pr-1">
          {transactions.length === 0 ? (
            <div className="rounded-lg border-none bg-muted/30 p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <p className="text-sm">Nema transakcija za ovaj dan</p>
            </div>
          ) : (
            <div className="rounded-lg border-none bg-transparent space-y-2">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="bg-card border border-border/40 rounded-lg shadow-sm overflow-hidden">
                    <TransactionAccordionItem transaction={tx} />
                  </div>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}
