import {useMutation, useQueryClient} from '@tanstack/react-query';
import {activateAccount} from '@/modules/api/accounts-api';
import {toast} from 'sonner';
import {queryKeys} from '@/modules/api/query-keys';
import {HTTPError} from 'ky';
import {ErrorResponse} from '@nest-wise/contracts';
import posthog from 'posthog-js';

export const useActivateAccountMutation = (accountId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => activateAccount(accountId),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Račun je aktiviran.');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      posthog.captureException(error, {
        context: {
          feature: 'useActivateAccountMutation',
        },
      });

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
