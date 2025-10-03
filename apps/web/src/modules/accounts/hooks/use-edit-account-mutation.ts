import {editAccount} from '@/modules/api/accounts-api';
import {EditAccountDTO, ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useEditAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: EditAccountDTO}) => editAccount(id, dto),
    onSuccess: () => {
      toast.success('Račun je uspešno ažuriran');
      void queryClient.invalidateQueries();
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
