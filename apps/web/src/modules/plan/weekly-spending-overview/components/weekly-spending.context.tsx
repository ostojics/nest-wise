import React, {createContext, useContext, useState} from 'react';

interface WeeklySpendingContextValue {
  selectedDayKey: string;
  setSelectedDayKey: (key: string) => void;
}

const WeeklySpendingContext = createContext<WeeklySpendingContextValue | undefined>(undefined);

interface WeeklySpendingProviderProps {
  children: React.ReactNode;
  initialSelectedDay: string;
}

export function WeeklySpendingProvider({children, initialSelectedDay}: WeeklySpendingProviderProps) {
  const [selectedDayKey, setSelectedDayKey] = useState(initialSelectedDay);

  return (
    <WeeklySpendingContext.Provider value={{selectedDayKey, setSelectedDayKey}}>
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
