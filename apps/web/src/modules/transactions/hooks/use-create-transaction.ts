import {queryKeys} from '@/modules/api/query-keys';
import {createTransactionForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {CreateTransactionHouseholdDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (transaction: CreateTransactionHouseholdDTO) => {
      if (!me?.householdId) throw new Error('No household ID available');
      return createTransactionForHousehold(me.householdId, transaction);
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.accounts.all()});
      void client.invalidateQueries({queryKey: queryKeys.transactions.key()});
      void client.invalidateQueries({queryKey: queryKeys.categoryBudgets.key()});
      void client.invalidateQueries({queryKey: queryKeys.transactions.allPagesKey()});

      toast.success('Transaction created successfully');
    },
    onError: () => {
      toast.error('Failed to create transaction');
    },
  });
};
