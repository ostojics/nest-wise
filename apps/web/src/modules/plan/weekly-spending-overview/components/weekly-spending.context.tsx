import React, {createContext, useContext, useState} from 'react';
import {startOfWeek, endOfWeek, addWeeks, subWeeks} from 'date-fns';
import {getWeeklyOverviewKey} from '@/lib/utils';

interface WeeklySpendingContextValue {
  selectedDayKey: string;
  setSelectedDayKey: (key: string) => void;
  weekStart: Date;
  weekEnd: Date;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
}

const WeeklySpendingContext = createContext<WeeklySpendingContextValue | undefined>(undefined);

interface WeeklySpendingProviderProps {
  children: React.ReactNode;
}

export function WeeklySpendingProvider({children}: WeeklySpendingProviderProps) {
  const [selectedDayKey, setSelectedDayKey] = useState(() => getWeeklyOverviewKey(new Date()));
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), {weekStartsOn: 1}));
  const weekEnd = endOfWeek(weekStart, {weekStartsOn: 1});

  const goToPreviousWeek = () => {
    const newStart = subWeeks(weekStart, 1);
    setWeekStart(newStart);
    setSelectedDayKey(getWeeklyOverviewKey(newStart));
  };

  const goToNextWeek = () => {
    const newStart = addWeeks(weekStart, 1);
    setWeekStart(newStart);
    setSelectedDayKey(getWeeklyOverviewKey(newStart));
  };

  const goToCurrentWeek = () => {
    const newStart = startOfWeek(new Date(), {weekStartsOn: 1});
    setWeekStart(newStart);
    setSelectedDayKey(getWeeklyOverviewKey(newStart));
  };

  return (
    <WeeklySpendingContext.Provider
      value={{
        selectedDayKey,
        setSelectedDayKey,
        weekStart,
        weekEnd,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
      }}
    >
      {children}
    </WeeklySpendingContext.Provider>
  );
}

export function useWeeklySpending() {
  const context = useContext(WeeklySpendingContext);
  if (!context) {
    throw new Error('useWeeklySpending must be used within a WeeklySpendingProvider');
  }
  return context;
}
