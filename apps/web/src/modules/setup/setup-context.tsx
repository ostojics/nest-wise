import React, {createContext, useState, ReactNode} from 'react';
import {UserRegistrationDTO} from '@nest-wise/contracts';

interface SetupContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  userData: UserRegistrationDTO | null;
  setUserData: (data: UserRegistrationDTO | null) => void;
  licenseKey: string | null;
  setLicenseKey: (key: string | null) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export const SetupContext = createContext<SetupContextType | undefined>(undefined);

interface SetupProviderProps {
  children: ReactNode;
  licenseKey?: string;
}

export const SetupProvider: React.FC<SetupProviderProps> = ({children, licenseKey: initialLicenseKey}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userData, setUserData] = useState<UserRegistrationDTO | null>(null);
  const [licenseKey, setLicenseKey] = useState<string | null>(initialLicenseKey ?? null);

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
    licenseKey,
    setLicenseKey,
    nextStep,
    previousStep,
  };

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
};
