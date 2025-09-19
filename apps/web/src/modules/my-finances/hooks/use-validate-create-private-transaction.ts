import {zodResolver} from '@hookform/resolvers/zod';
import {CreatePrivateTransactionDTO, createPrivateTransactionSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';

interface UseValidateCreatePrivateTransactionArgs {
  householdId: string;
}

export const useValidateCreatePrivateTransaction = ({householdId}: UseValidateCreatePrivateTransactionArgs) => {
  return useForm<CreatePrivateTransactionDTO>({
    resolver: zodResolver(createPrivateTransactionSchema),
    defaultValues: {
      householdId,
      accountId: '',
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: new Date(),
    },
  });
};
