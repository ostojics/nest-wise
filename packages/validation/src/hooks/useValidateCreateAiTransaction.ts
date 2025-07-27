import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {createAiTransactionSchema} from '../schemas/transactions';

interface UseValidateCreateAiTransactionArgs {
  householdId: string;
}

export const useValidateCreateAiTransaction = ({householdId}: UseValidateCreateAiTransactionArgs) => {
  return useForm({
    resolver: zodResolver(createAiTransactionSchema),
    defaultValues: {
      householdId,
      accountId: '',
      description: '',
    },
  });
};
