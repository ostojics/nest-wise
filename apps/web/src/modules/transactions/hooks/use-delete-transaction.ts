import {deleteTransaction} from '@/modules/api/transactions-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {reportError} from '@/lib/error-reporting';

export const useDeleteTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await client.invalidateQueries();
      toast.success('Transakcija je obrisana');
    },
    onError: async (error) => {
      await reportError(error, {
        feature: 'transaction_delete',
      });

      toast.error('Brisanje transakcije nije uspelo');
    },
  });
};
