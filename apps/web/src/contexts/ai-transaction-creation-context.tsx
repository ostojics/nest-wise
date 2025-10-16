import React, {createContext, useContext, ReactNode, useState} from 'react';

type Step = 'input' | 'processing' | 'confirm';

interface AiTransactionCreationContextType {
  step: Step;
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

  const back = () => {
    if (step === 'confirm') {
      setStep('input');
    }
  };

  const reset = () => {
    setStep('input');
  };

  const value: AiTransactionCreationContextType = {
    step,
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
