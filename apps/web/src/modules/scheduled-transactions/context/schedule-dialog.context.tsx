import React, {createContext, useContext, useState} from 'react';
import {TransactionDetailsFormData} from '../hooks/use-validate-transaction-details';

interface ScheduleDialogContextValue {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  transactionDetails: TransactionDetailsFormData | null;
  setTransactionDetails: (data: TransactionDetailsFormData) => void;
  resetDialog: () => void;
}

const ScheduleDialogContext = createContext<ScheduleDialogContextValue | undefined>(undefined);

export const useScheduleDialogContext = () => {
  const context = useContext(ScheduleDialogContext);
  if (!context) {
    throw new Error('useScheduleDialogContext must be used within a ScheduleDialogProvider');
  }
  return context;
};

interface ScheduleDialogProviderProps {
  children: React.ReactNode;
}

export const ScheduleDialogProvider: React.FC<ScheduleDialogProviderProps> = ({children}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsFormData | null>(null);

  const resetDialog = () => {
    setCurrentStep(1);
    setTransactionDetails(null);
  };

  return (
    <ScheduleDialogContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        transactionDetails,
        setTransactionDetails,
        resetDialog,
      }}
    >
      {children}
    </ScheduleDialogContext.Provider>
  );
};
