import {updateTransaction} from '@/modules/api/transactions-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {UpdateTransactionDTO} from '@nest-wise/contracts';

export const useUpdateTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: UpdateTransactionDTO}) => updateTransaction(id, dto),
    onSuccess: async () => {
      await client.invalidateQueries({refetchType: 'all'});
      toast.success('Transakcija je izmenjena');
    },
    onError: async (error) => {
      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'transaction_update',
        },
      });

      toast.error('Izmena transakcije nije uspela');
    },
  });
};
