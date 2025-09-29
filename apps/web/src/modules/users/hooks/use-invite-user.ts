import {useMutation} from '@tanstack/react-query';
import {inviteUserToHousehold} from '@/modules/api/users-api';
import {toast} from 'sonner';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useInviteUserToHousehold = () => {
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (email: string) => {
      if (!me?.householdId) {
        throw new Error('Nije pronađeno domaćinstvo za trenutnog korisnika');
      }
      return inviteUserToHousehold(me.householdId, {email});
    },
    onSuccess: () => {
      toast.success('Poziv je uspešno poslat');
    },
  });
};
