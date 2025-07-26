import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {createTransactionSchema} from '../schemas/transactions';

interface UseValidateCreateTransactionArgs {
  householdId: string;
}

export const useValidateCreateTransaction = ({householdId}: UseValidateCreateTransactionArgs) => {
  return useForm({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      householdId,
      accountId: '',
      categoryId: '',
      amount: 0,
      type: 'expense',
      description: '',
      isReconciled: true,
    },
  });
};
