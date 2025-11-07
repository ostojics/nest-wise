import {useMutation, useQueryClient} from '@tanstack/react-query';
import {confirmEmailChange} from '@/modules/api/users-api';
import {ConfirmEmailChangeDTO} from '@nest-wise/contracts';
import {toast} from 'sonner';
import posthog from 'posthog-js';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useConfirmEmailChange = () => {
  const queryClient = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (dto: ConfirmEmailChangeDTO) => confirmEmailChange(dto),
    onSuccess: () => {
      toast.success('E‑pošta je uspešno promenjena');
      void queryClient.invalidateQueries({refetchType: 'all'});
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'useConfirmEmailChange',
        },
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
        },
      });

      toast.error('Greška pri potvrdi promene e‑pošte');
    },
  });
};
