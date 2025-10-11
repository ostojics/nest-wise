import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateTransactionHouseholdDTO, createTransactionHouseholdSchema} from '@nest-wise/contracts';
import {formatDateOnly, createUtcDate} from '@/lib/date-utils';

interface UseValidateCreateTransactionDefaultValues {
  accountId?: string;
}

export const useValidateCreateTransaction = ({accountId}: UseValidateCreateTransactionDefaultValues) => {
  const today = new Date();

  return useForm<CreateTransactionHouseholdDTO>({
    // @ts-expect-error DTO is inferred from the schema
    resolver: zodResolver(createTransactionHouseholdSchema),
    defaultValues: {
      accountId: accountId ?? '',
      categoryId: '',
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: formatDateOnly(createUtcDate(today.getFullYear(), today.getMonth() + 1, today.getDate())),
      isReconciled: true,
    },
  });
};
