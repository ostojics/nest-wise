import React, {createContext, useContext, useState} from 'react';
import {startOfWeek, endOfWeek, addWeeks, subWeeks} from 'date-fns';

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
  initialSelectedDay: string;
}

export function WeeklySpendingProvider({children, initialSelectedDay}: WeeklySpendingProviderProps) {
  const [selectedDayKey, setSelectedDayKey] = useState(initialSelectedDay);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), {weekStartsOn: 1}));

  const weekEnd = endOfWeek(weekStart, {weekStartsOn: 1});

  const goToPreviousWeek = () => {
    setWeekStart((prev) => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setWeekStart((prev) => addWeeks(prev, 1));
  };

  const goToCurrentWeek = () => {
    setWeekStart(startOfWeek(new Date(), {weekStartsOn: 1}));
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
