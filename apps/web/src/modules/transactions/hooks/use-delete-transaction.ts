import {deleteTransaction} from '@/modules/api/transactions-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import posthog from 'posthog-js';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useDeleteTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

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
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
        },
      });

      toast.error('Brisanje transakcije nije uspelo');
    },
  });
};
