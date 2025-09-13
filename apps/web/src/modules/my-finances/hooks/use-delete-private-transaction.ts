import {deletePrivateTransaction} from '@/modules/api/private-transactions';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse} from '@maya-vault/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useDeletePrivateTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deletePrivateTransaction(id),
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: queryKeys.privateTransactions.tag(),
      });
      toast.success('Private transaction deleted');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Unexpected error occurred');
    },
  });
};
