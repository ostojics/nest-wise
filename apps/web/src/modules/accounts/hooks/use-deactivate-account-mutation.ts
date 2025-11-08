import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deactivateAccount} from '@/modules/api/accounts-api';
import {toast} from 'sonner';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse} from '@nest-wise/contracts';
import {HTTPError} from 'ky';

export const useDeactivateAccountMutation = (accountId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deactivateAccount(accountId),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Račun je deaktiviran.');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'account_deactivate',
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
