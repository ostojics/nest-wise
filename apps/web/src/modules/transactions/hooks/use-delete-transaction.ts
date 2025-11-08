import {deleteTransaction} from '@/modules/api/transactions-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import posthog from 'posthog-js';

export const useDeleteTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await client.invalidateQueries();
      toast.success('Transakcija je obrisana');
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'useDeleteTransaction',
        },
      });

      toast.error('Brisanje transakcije nije uspelo');
    },
  });
};
