import React, {createContext, useContext, useState, useMemo} from 'react';
import {TransactionContract} from '@nest-wise/contracts';

interface DayData {
  key: string; // YYYY-MM-DD
  date: Date;
  label: string;
  shortLabel: string;
  total: number;
  transactions: TransactionContract[];
  isFuture: boolean;
}

interface WeeklySpendingContextValue {
  days: DayData[];
  selectedDayKey: string;
  setSelectedDayKey: (key: string) => void;
  selectedDayData: DayData | undefined;
  isLoading: boolean;
  isError: boolean;
}

const WeeklySpendingContext = createContext<WeeklySpendingContextValue | undefined>(undefined);

interface WeeklySpendingProviderProps {
  children: React.ReactNode;
  days: DayData[];
  initialSelectedDay?: string;
  isLoading?: boolean;
  isError?: boolean;
}

export function WeeklySpendingProvider({
  children,
  days,
  initialSelectedDay,
  isLoading = false,
  isError = false,
}: WeeklySpendingProviderProps) {
  const [selectedDayKey, setSelectedDayKey] = useState(initialSelectedDay ?? days[0]?.key ?? '');

  const selectedDayData = useMemo(() => {
    return days.find((day) => day.key === selectedDayKey);
  }, [days, selectedDayKey]);

  const value = useMemo(
    () => ({
      days,
      selectedDayKey,
      setSelectedDayKey,
      selectedDayData,
      isLoading,
      isError,
    }),
    [days, selectedDayKey, selectedDayData, isLoading, isError],
  );

  return <WeeklySpendingContext.Provider value={value}>{children}</WeeklySpendingContext.Provider>;
}

export function useWeeklySpending() {
  const context = useContext(WeeklySpendingContext);
  if (!context) {
    throw new Error('useWeeklySpending must be used within a WeeklySpendingProvider');
  }
  return context;
}

export type {DayData};
