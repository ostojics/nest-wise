import {queryKeys} from '@/modules/api/query-keys';
import {deleteTransaction} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';
import {toast} from 'sonner';

export const useDeleteTransaction = () => {
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      const promises = [
        client.invalidateQueries({queryKey: queryKeys.transactions.netWorthTrend()}),
        client.invalidateQueries({
          queryKey: queryKeys.transactions.all({...search, householdId: me?.householdId ?? ''}),
        }),
        client.invalidateQueries({queryKey: queryKeys.accounts.all()}),
      ];

      await Promise.all(promises);
      toast.success('Transaction deleted');
    },
    onError: () => {
      toast.error('Failed to delete transaction');
    },
  });
};
