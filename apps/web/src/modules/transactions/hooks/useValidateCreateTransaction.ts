import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateTransactionHouseholdDTO, createTransactionHouseholdSchema} from '@nest-wise/contracts';
import {UTCDate} from '@date-fns/utc';

export const useValidateCreateTransaction = () => {
  return useForm<CreateTransactionHouseholdDTO>({
    // @ts-expect-error DTO is inferred from the schema
    resolver: zodResolver(createTransactionHouseholdSchema),
    defaultValues: {
      accountId: '',
      categoryId: '',
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: new UTCDate(),
      isReconciled: true,
    },
  });
};
