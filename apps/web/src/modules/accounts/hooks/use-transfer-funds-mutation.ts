import {useMutation} from '@tanstack/react-query';
import {transferFunds} from '@/modules/api/accounts-api';
import {toast} from 'sonner';
import {useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '@/modules/api/query-keys';
import {HTTPError} from 'ky';
import {ErrorResponse} from '@maya-vault/contracts';

export const useTransferFundsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      toast.success('Funds transferred successfully');
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
