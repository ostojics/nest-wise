import {useMutation} from '@tanstack/react-query';
import {requestEmailChange} from '@/modules/api/users-api';
import {RequestEmailChangeDTO} from '@nest-wise/contracts';
import {toast} from 'sonner';

export const useRequestEmailChange = () => {
  return useMutation({
    mutationFn: (dto: RequestEmailChangeDTO) => requestEmailChange(dto),
    onSuccess: () => {
      toast.success('Poslali smo Vam link za potvrdu na novu e‑poštu');
    },
    onError: async (error) => {
      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'user_request_email_change',
        },
      });

      toast.error('Greška pri slanju potvrde');
    },
  });
};
