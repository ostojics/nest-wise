import {createPrivateTransaction} from '@/modules/api/private-transaction';
import {ErrorResponse} from '@maya-vault/contracts';
import {useMutation} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useCreatePrivateTransaction = () => {
  //   const client = useQueryClient();

  return useMutation({
    mutationFn: createPrivateTransaction,
    onSuccess: () => {
      //   void client.invalidateQueries({queryKey: queryKeys.categories.all()});
      toast.success('Private transaction created successfully');
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
