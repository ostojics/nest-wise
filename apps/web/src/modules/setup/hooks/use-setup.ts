import {useContext} from 'react';
import {SetupContext} from '../setup-context';

export const useSetupContext = () => {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetupContext must be used within a SetupProvider');
  }
  return context;
};
