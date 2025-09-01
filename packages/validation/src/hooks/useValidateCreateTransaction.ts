import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateTransactionDTO, createTransactionSchema} from '../schemas/transactions';

interface UseValidateCreateTransactionArgs {
  householdId: string;
}

export const useValidateCreateTransaction = ({householdId}: UseValidateCreateTransactionArgs) => {
  return useForm<CreateTransactionDTO>({
    // @ts-expect-error DTO is inferred from the schema
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      householdId,
      accountId: '',
      categoryId: '',
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: new Date(),
      isReconciled: true,
    },
  });
};
