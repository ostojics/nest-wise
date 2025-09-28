import {createPrivateTransaction} from '@/modules/api/private-transactions';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useCreatePrivateTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createPrivateTransaction,
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: queryKeys.privateTransactions.key(),
      });
      await client.invalidateQueries({
        queryKey: queryKeys.accounts.all(),
      });
      toast.success('Privatna transakcija je uspešno kreirana');
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
