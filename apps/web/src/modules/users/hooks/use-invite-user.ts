import {useMutation} from '@tanstack/react-query';
import {inviteUserToHousehold} from '@/modules/api/users-api';
import {toast} from 'sonner';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';

export const useInviteUserToHousehold = () => {
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (email: string) => {
      if (!me?.householdId) {
        throw new Error('No household found for current user');
      }
      return inviteUserToHousehold(me.householdId, {email});
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully');
    },
  });
};
