import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateUsername} from '@/modules/api/users-api';
import {UpdateUsernameDTO} from '@nest-wise/contracts';
import {toast} from 'sonner';
import posthog from 'posthog-js';

export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateUsernameDTO) => updateUsername(dto),
    onSuccess: () => {
      toast.success('Korisničko ime je izmenjeno');
      void queryClient.invalidateQueries({refetchType: 'all'});
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'user_update_username',
        },
      });

      toast.error('Greška pri izmeni korisničkog imena');
    },
  });
};
