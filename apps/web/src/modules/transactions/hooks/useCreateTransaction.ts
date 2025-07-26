import {createTransaction} from '@/modules/api/transactions-api';
import {useMutation} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success('Transaction created successfully');
    },
    onError: () => {
      toast.error('Failed to create transaction');
    },
  });
};
