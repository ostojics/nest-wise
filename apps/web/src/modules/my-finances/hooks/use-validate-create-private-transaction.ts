import {zodResolver} from '@hookform/resolvers/zod';
import {CreatePrivateTransactionDTO, createPrivateTransactionSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';
import {formatDateOnly, createUtcDate} from '@/lib/date-utils';

export const useValidateCreatePrivateTransaction = () => {
  const today = new Date();

  return useForm<CreatePrivateTransactionDTO>({
    resolver: zodResolver(createPrivateTransactionSchema),
    defaultValues: {
      accountId: '',
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: formatDateOnly(createUtcDate(today.getFullYear(), today.getMonth() + 1, today.getDate())),
    },
  });
};
