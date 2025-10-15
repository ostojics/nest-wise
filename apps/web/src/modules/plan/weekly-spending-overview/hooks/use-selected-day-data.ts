import {useMemo} from 'react';
import {TransactionContract} from '@nest-wise/contracts';

interface DayData {
  key: string;
  date: Date;
  label: string;
  shortLabel: string;
  total: number;
  transactions: TransactionContract[];
}

interface UseSelectedDayDataArgs {
  days: DayData[];
  selectedDayKey: string;
}

export function useSelectedDayData({days, selectedDayKey}: UseSelectedDayDataArgs) {
  return useMemo(() => {
    return days.find((day) => day.key === selectedDayKey);
  }, [days, selectedDayKey]);
}

export type {DayData};
