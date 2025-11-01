import {useMutation, useQueryClient} from '@tanstack/react-query';
import {activateAccount} from '@/modules/api/accounts-api';
import {toast} from 'sonner';
import {queryKeys} from '@/modules/api/query-keys';

export const useActivateAccountMutation = (accountId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => activateAccount(accountId),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Račun je aktiviran.');
    },
    onError: () => {
      toast.error('Došlo je do greške. Pokušajte ponovo.');
    },
  });
};
