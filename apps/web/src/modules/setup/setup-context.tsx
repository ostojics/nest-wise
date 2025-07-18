import React, {createContext, useState, ReactNode} from 'react';
import {UserRegistrationDTO} from '@maya-vault/validation';

interface SetupContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  userData: UserRegistrationDTO | null;
  setUserData: (data: UserRegistrationDTO | null) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export const SetupContext = createContext<SetupContextType | undefined>(undefined);

interface SetupProviderProps {
  children: ReactNode;
}

export const SetupProvider: React.FC<SetupProviderProps> = ({children}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userData, setUserData] = useState<UserRegistrationDTO | null>(null);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const value: SetupContextType = {
    currentStep,
    setCurrentStep,
    userData,
    setUserData,
    nextStep,
    previousStep,
  };

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
};
