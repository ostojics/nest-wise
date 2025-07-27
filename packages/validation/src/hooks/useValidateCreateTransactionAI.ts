import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {createTransactionAiSchema} from '../schemas';

interface UseValidateCreateTransactionAIArgs {
  householdId: string;
}

export const useValidateCreateAiTransaction = ({householdId}: UseValidateCreateTransactionAIArgs) => {
  return useForm({
    resolver: zodResolver(createTransactionAiSchema),
    defaultValues: {
      householdId,
      accountId: '',
      description: '',
    },
  });
};
