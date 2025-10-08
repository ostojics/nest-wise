import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateUsername} from '@/modules/api/users-api';
import {UpdateUsernameDTO} from '@nest-wise/contracts';
import {toast} from 'sonner';

export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateUsernameDTO) => updateUsername(dto),
    onSuccess: () => {
      toast.success('Korisničko ime je izmenjeno');
      void queryClient.invalidateQueries({refetchType: 'all'});
    },
    onError: () => {
      toast.error('Greška pri izmeni korisničkog imena');
    },
  });
};
