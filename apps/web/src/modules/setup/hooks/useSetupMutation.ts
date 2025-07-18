import {setup} from '@/modules/api/auth-api';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';

export const useSetupMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: setup,
    onSuccess: () => {
      toast.success('Setup successful');
      void navigate({to: '/dashboard'});
    },
    onError: () => {
      toast.error('Setup failed');
    },
  });
};
