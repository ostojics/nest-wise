import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateTransactionHouseholdDTO, createTransactionHouseholdSchema} from '@nest-wise/contracts';
import {dateAtNoon} from '@/lib/utils';

interface UseValidateCreateTransactionDefaultValues {
  accountId?: string;
}

export const useValidateCreateTransaction = ({accountId}: UseValidateCreateTransactionDefaultValues) => {
  return useForm<CreateTransactionHouseholdDTO>({
    // @ts-expect-error DTO is inferred from the schema
    resolver: zodResolver(createTransactionHouseholdSchema),
    defaultValues: {
      accountId: accountId ?? '',
      categoryId: '',
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: dateAtNoon(new Date()).toISOString(),
      isReconciled: true,
    },
  });
};
