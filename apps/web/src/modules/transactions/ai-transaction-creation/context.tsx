import React, {createContext, useContext, ReactNode, useState} from 'react';
import {AiTransactionSuggestion, CreateTransactionAiHouseholdDTO} from '@nest-wise/contracts';

type Step = 'input' | 'processing' | 'confirm';

interface AiTransactionCreationContextType {
  step: Step;
  suggestion: AiTransactionSuggestion | null;
  inputData: CreateTransactionAiHouseholdDTO | null;
  submitInput: (data: CreateTransactionAiHouseholdDTO) => void;
  setSuggestion: (suggestion: AiTransactionSuggestion) => void;
  setStep: (step: Step) => void;
  back: () => void;
  reset: () => void;
}

const AiTransactionCreationContext = createContext<AiTransactionCreationContextType | undefined>(undefined);

interface AiTransactionCreationProviderProps {
  children: ReactNode;
}

export function AiTransactionCreationProvider({children}: AiTransactionCreationProviderProps) {
  const [step, setStep] = useState<Step>('input');
  const [suggestion, setSuggestion] = useState<AiTransactionSuggestion | null>(null);
  const [inputData, setInputData] = useState<CreateTransactionAiHouseholdDTO | null>(null);

  const submitInput = (data: CreateTransactionAiHouseholdDTO) => {
    setInputData(data);
    setStep('processing');
  };

  const back = () => {
    if (step === 'confirm') {
      setStep('input');
      setSuggestion(null);
    }
  };

  const reset = () => {
    setStep('input');
    setSuggestion(null);
    setInputData(null);
  };

  const value: AiTransactionCreationContextType = {
    step,
    suggestion,
    inputData,
    submitInput,
    setSuggestion,
    setStep,
    back,
    reset,
  };

  return <AiTransactionCreationContext.Provider value={value}>{children}</AiTransactionCreationContext.Provider>;
}

export function useAiTransactionCreation() {
  const context = useContext(AiTransactionCreationContext);
  if (context === undefined) {
    throw new Error('useAiTransactionCreation must be used within an AiTransactionCreationProvider');
  }
  return context;
}
