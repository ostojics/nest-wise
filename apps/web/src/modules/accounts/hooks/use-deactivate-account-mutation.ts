import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deactivateAccount} from '@/modules/api/accounts-api';
import {toast} from 'sonner';
import {queryKeys} from '@/modules/api/query-keys';

export const useDeactivateAccountMutation = (accountId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deactivateAccount(accountId),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Račun je deaktiviran.');
    },
    onError: () => {
      toast.error('Došlo je do greške. Pokušajte ponovo.');
    },
  });
};
