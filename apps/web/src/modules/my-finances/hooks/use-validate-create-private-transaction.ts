import {zodResolver} from '@hookform/resolvers/zod';
import {CreatePrivateTransactionDTO, createPrivateTransactionSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';
import {UTCDate} from '@date-fns/utc';

export const useValidateCreatePrivateTransaction = () => {
  return useForm<CreatePrivateTransactionDTO>({
    resolver: zodResolver(createPrivateTransactionSchema),
    defaultValues: {
      accountId: '',
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: new UTCDate(),
    },
  });
};
