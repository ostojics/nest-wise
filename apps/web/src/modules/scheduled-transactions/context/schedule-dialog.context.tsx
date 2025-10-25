import React, {createContext, useContext, useState} from 'react';
import {TransactionDetailsFormData} from '../hooks/use-validate-transaction-details';
import {ScheduleRuleFormData} from '../hooks/use-validate-schedule-rule';

interface ScheduleDialogContextValue {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  transactionDetails: TransactionDetailsFormData | null;
  setTransactionDetails: (data: TransactionDetailsFormData) => void;
  scheduleRule: ScheduleRuleFormData | null;
  setScheduleRule: (data: ScheduleRuleFormData) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
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
  const [scheduleRule, setScheduleRule] = useState<ScheduleRuleFormData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetDialog = () => {
    setCurrentStep(1);
    setTransactionDetails(null);
    setScheduleRule(null);
    setEditingId(null);
  };

  return (
    <ScheduleDialogContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        transactionDetails,
        setTransactionDetails,
        scheduleRule,
        setScheduleRule,
        editingId,
        setEditingId,
        resetDialog,
      }}
    >
      {children}
    </ScheduleDialogContext.Provider>
  );
};
