import {zodResolver} from '@hookform/resolvers/zod';
import {TransferFundsDTO, transferFundsSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';

export const useValidateTransferFunds = () => {
  return useForm<TransferFundsDTO>({
    resolver: zodResolver(transferFundsSchema),
    defaultValues: {
      fromAccountId: '',
      toAccountId: '',
      amount: 1,
    },
  });
};
