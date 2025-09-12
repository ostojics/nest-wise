import {queryKeys} from '@/modules/api/query-keys';
import {deletePrivateTransaction} from '@/modules/api/private-transactions';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';
import {toast} from 'sonner';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {HTTPError} from 'ky';
import {ErrorResponse} from '@maya-vault/contracts';

export const useDeletePrivateTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();
  const search = useSearch({from: '/__pathlessLayout/my-finances'});

  return useMutation({
    mutationFn: async (id: string) => deletePrivateTransaction(id),
    onSuccess: async () => {
      toast.success('Private transaction deleted');
      await client.invalidateQueries({
        queryKey: queryKeys.privateTransactions.all({...search, householdId: me?.householdId ?? ''}),
      });
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
