import React, {createContext, useContext, ReactNode} from 'react';

interface CreateTransactionDialogContextType {
  isManual: boolean;
  setManual: (isManual: boolean) => void;
  close: () => void;
  success: () => void;
}

const CreateTransactionDialogContext = createContext<CreateTransactionDialogContextType | undefined>(undefined);

interface CreateTransactionDialogProviderProps {
  children: ReactNode;
  isManual: boolean;
  setManual: (isManual: boolean) => void;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTransactionDialogProvider({
  children,
  isManual,
  setManual,
  onClose,
  onSuccess,
}: CreateTransactionDialogProviderProps) {
  const value: CreateTransactionDialogContextType = {
    isManual,
    setManual,
    close: onClose,
    success: onSuccess,
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
