import {queryKeys} from '@/modules/api/query-keys';
import {createAiTransaction} from '@/modules/api/transactions-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateTransactionAI = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createAiTransaction,
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Transaction processed successfully');
    },
    onError: () => {
      toast.error('Failed to process transaction');
    },
  });
};
