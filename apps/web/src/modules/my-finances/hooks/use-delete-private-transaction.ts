import {deletePrivateTransaction} from '@/modules/api/private-transactions';
import {ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useDeletePrivateTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deletePrivateTransaction(id),
    onSuccess: async () => {
      await client.invalidateQueries({
        refetchType: 'all',
      });
      toast.success('Privatna transakcija je obrisana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
