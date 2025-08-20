import {useMutation} from '@tanstack/react-query';
import {inviteUser} from '@/modules/api/users-api';
import {toast} from 'sonner';

export const useInviteUser = () => {
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      toast.success('Invitation sent successfully');
    },
  });
};
