import {zodResolver} from '@hookform/resolvers/zod';
import {TransferFundsDTO, transferFundsSchema} from '@maya-vault/contracts';
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
