import {editAccount} from '@/modules/api/accounts-api';
import {queryKeys} from '@/modules/api/query-keys';
import {EditAccountDTO, ErrorResponse} from '@maya-vault/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useEditAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: EditAccountDTO}) => editAccount(id, dto),
    onSuccess: () => {
      toast.success('Account updated successfully');
      void queryClient.invalidateQueries({queryKey: queryKeys.accounts.all()});
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
