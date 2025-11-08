import {useMutation, useQueryClient} from '@tanstack/react-query';
import {confirmEmailChange} from '@/modules/api/users-api';
import {ConfirmEmailChangeDTO} from '@nest-wise/contracts';
import {toast} from 'sonner';
import posthog from 'posthog-js';

export const useConfirmEmailChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ConfirmEmailChangeDTO) => confirmEmailChange(dto),
    onSuccess: () => {
      toast.success('E‑pošta je uspešno promenjena');
      void queryClient.invalidateQueries({refetchType: 'all'});
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'user_confirm_email_change',
        },
      });

      toast.error('Greška pri potvrdi promene e‑pošte');
    },
  });
};
