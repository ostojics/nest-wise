import {forgotPassword} from '@/modules/api/auth-api';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: async () => {
      toast.success('If an account exists, an email has been sent');
      await navigate({to: '/login'});
    },
    onError: () => {
      toast.error('Failed to process request. Please try again.');
    },
  });
};
