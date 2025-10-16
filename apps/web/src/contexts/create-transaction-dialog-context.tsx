import React, {createContext, useContext, ReactNode, useState} from 'react';

interface CreateTransactionDialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isManualMode: boolean;
  setIsManualMode: (manual: boolean) => void;
  close: () => void;
}

const CreateTransactionDialogContext = createContext<CreateTransactionDialogContextType | undefined>(undefined);

interface CreateTransactionDialogProviderProps {
  children: ReactNode;
}

export function CreateTransactionDialogProvider({children}: CreateTransactionDialogProviderProps) {
  const [isManualMode, setIsManualMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsManualMode(false);
    setIsOpen(false);
  };

  const value: CreateTransactionDialogContextType = {
    isManualMode,
    setIsManualMode,
    isOpen,
    setIsOpen,
    close: handleClose,
  };

  return <CreateTransactionDialogContext.Provider value={value}>{children}</CreateTransactionDialogContext.Provider>;
}

export function useCreateTransactionDialog() {
  const context = useContext(CreateTransactionDialogContext);
  if (context === undefined) {
    throw new Error('useCreateTransactionDialog must be used within a CreateTransactionDialogProvider');
  }
  return context;
}
