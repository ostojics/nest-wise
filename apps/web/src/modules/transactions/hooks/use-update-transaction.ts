import {updateTransaction} from '@/modules/api/transactions-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {UpdateTransactionDTO} from '@nest-wise/contracts';
import posthog from 'posthog-js';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useUpdateTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: UpdateTransactionDTO}) => updateTransaction(id, dto),
    onSuccess: async () => {
      await client.invalidateQueries({refetchType: 'all'});
      toast.success('Transakcija je izmenjena');
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'useUpdateTransaction',
        },
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
        },
      });

      toast.error('Izmena transakcije nije uspela');
    },
  });
};
