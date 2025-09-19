import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateTransactionAiDTO, createTransactionAiSchema} from '@maya-vault/contracts';

interface UseValidateCreateTransactionAIArgs {
  householdId: string;
}

export const useValidateCreateAiTransaction = ({householdId}: UseValidateCreateTransactionAIArgs) => {
  return useForm<CreateTransactionAiDTO>({
    resolver: zodResolver(createTransactionAiSchema),
    defaultValues: {
      householdId,
      accountId: '',
      description: '',
    },
  });
};
