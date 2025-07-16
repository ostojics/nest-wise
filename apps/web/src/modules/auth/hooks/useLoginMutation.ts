import {login} from '@/modules/api/auth-api';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await navigate({to: '/dashboard'});
    },
  });
};
