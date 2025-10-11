import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {UpdateTransactionDTO, updateTransactionSchema, TransactionContract} from '@nest-wise/contracts';

interface UseValidateUpdateTransactionProps {
  transaction: TransactionContract;
}

export const useValidateUpdateTransaction = ({transaction}: UseValidateUpdateTransactionProps) => {
  return useForm<UpdateTransactionDTO>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      transactionDate: transaction.transactionDate, // Already a string from API
      isReconciled: transaction.isReconciled,
    },
  });
};
