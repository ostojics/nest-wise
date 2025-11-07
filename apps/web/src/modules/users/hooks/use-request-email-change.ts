import {useMutation} from '@tanstack/react-query';
import {requestEmailChange} from '@/modules/api/users-api';
import {RequestEmailChangeDTO} from '@nest-wise/contracts';
import {toast} from 'sonner';
import posthog from 'posthog-js';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useRequestEmailChange = () => {
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (dto: RequestEmailChangeDTO) => requestEmailChange(dto),
    onSuccess: () => {
      toast.success('Poslali smo Vam link za potvrdu na novu e‑poštu');
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'useRequestEmailChange',
        },
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
        },
      });

      toast.error('Greška pri slanju potvrde');
    },
  });
};
