import {resetPassword} from '@/modules/api/auth-api';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';
import posthog from 'posthog-js';

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: async () => {
      toast.success('Lozinka je uspešno resetovana.');
      await navigate({to: '/login'});
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'useResetPassword',
        },
      });

      toast.error('Nevažeći ili istekao token. Pokušajte ponovo.');
    },
  });
};
