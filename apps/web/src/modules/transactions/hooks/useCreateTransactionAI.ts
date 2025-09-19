import {queryKeys} from '@/modules/api/query-keys';
import {createAiTransactionForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {CreateTransactionAiHouseholdDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateTransactionAI = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (transaction: CreateTransactionAiHouseholdDTO) => {
      if (!me?.householdId) throw new Error('No household ID available');
      return createAiTransactionForHousehold(me.householdId, transaction);
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.accounts.all()});
      void client.invalidateQueries({queryKey: queryKeys.transactions.key()});
      void client.invalidateQueries({queryKey: queryKeys.categoryBudgets.key()});
      void client.invalidateQueries({queryKey: queryKeys.transactions.allPagesKey()});

      toast.success('Transaction processed successfully');
    },
    onError: () => {
      toast.error('Failed to process transaction');
    },
  });
};
