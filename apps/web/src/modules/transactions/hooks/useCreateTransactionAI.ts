import {createAiTransaction} from '@/modules/api/transactions-api';
import {useMutation} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateTransactionAI = () => {
  return useMutation({
    mutationFn: createAiTransaction,
    onSuccess: () => {
      toast.success('Transaction processed successfully');
    },
    onError: () => {
      toast.error('Failed to process transaction');
    },
  });
};
