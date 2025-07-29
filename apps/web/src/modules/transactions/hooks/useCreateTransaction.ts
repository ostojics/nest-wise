import {queryKeys} from '@/modules/api/query-keys';
import {createTransaction} from '@/modules/api/transactions-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Transaction created successfully');
    },
    onError: () => {
      toast.error('Failed to create transaction');
    },
  });
};
