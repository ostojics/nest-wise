import {queryKeys} from '@/modules/api/query-keys';
import {deleteTransaction} from '@/modules/api/transactions-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useDeleteTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      const promises = [
        client.invalidateQueries({queryKey: queryKeys.transactions.netWorthTrend()}),
        client.invalidateQueries({
          queryKey: queryKeys.transactions.key(),
        }),
        client.invalidateQueries({queryKey: queryKeys.accounts.all()}),
        client.invalidateQueries({queryKey: queryKeys.categoryBudgets.key()}),
      ];

      await Promise.all(promises);
      toast.success('Transakcija je obrisana');
    },
    onError: () => {
      toast.error('Brisanje transakcije nije uspelo');
    },
  });
};
